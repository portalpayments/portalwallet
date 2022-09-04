<script lang="ts">
  import {
    connectionStore,
    keyPairStore,
    identityTokenIssuerPublicKey,
  } from "../stores";
  import { PublicKey, Connection, Keypair } from "@solana/web3.js";
  import TransferHeading from "./TransferHeading.svelte";
  import TransferButtons from "./TransferButtons.svelte";
  import LoaderModal from "../UI/LoaderModal.svelte";
  import Modal from "../UI/Modal.svelte";
  import RequestVerification from "./RequestVerification.svelte";
  import TransactionCompleted from "./TransactionCompleted.svelte";
  import { verifyWallet } from "../../../../src/vmwallet";
  import { debounce } from "lodash";

  import {
    SECONDS,
    SECOND,
    SOLANA_WALLET_REGEX,
  } from "../../../../src/constants";
  import { checkIfValidWalletAddress } from "../utils";
  import { log } from "../../../../src/functions";
  import type { VerifiedClaims } from "../../../../src/types";

  let hasLoadedVerificationStateFromNetwork = false;
  let isCurrentlyLoadingVerificationStateFromNetwork = false;
  let destinationWalletAddress: string | null;
  let verifiedClaims: VerifiedClaims | null = null;

  let amount: number;

  let isSendButtonDisabled = true;

  let showGasFee = false;

  let isAskingWalletOwnerToGetVerified = false;

  let isSendingAnyway = false;
  let isSending = false;

  let transferAmount: number | null;

  let connection: Connection | null = null;

  let contact;

  $: if (destinationWalletAddress && verifiedClaims) {
    contact = {
      walletAddress: destinationWalletAddress,
      isNew: true,
      isPending: false,
      verifiedClaims,
    };
  }

  connectionStore.subscribe((value) => {
    connection = value;
  });

  let keyPair: Keypair | null = null;

  keyPairStore.subscribe((value) => {
    keyPair = value;
  });

  const handleKeyupdestinationWalletAddress = async () => {
    isCurrentlyLoadingVerificationStateFromNetwork = true;
    let isValiddestinationWalletAddress = checkIfValidWalletAddress(
      destinationWalletAddress
    );

    if (!isValiddestinationWalletAddress) {
      // TODO: handle invalid wallet addresses better
      log(`This is not a valid wallet address`);

      verifiedClaims = null;
      isSendButtonDisabled = true;
      isAskingWalletOwnerToGetVerified = false;
      isSendingAnyway = false;
      isSending = false;
      hasLoadedVerificationStateFromNetwork = false;
      isCurrentlyLoadingVerificationStateFromNetwork = false;
      return;
    }

    log(`Valid wallet address!`);

    // Get identity from the portal Identity Token
    verifiedClaims = await verifyWallet(
      connection,
      keyPair,
      identityTokenIssuerPublicKey,
      new PublicKey(destinationWalletAddress)
    );

    log(`Verification result!`, verifiedClaims);

    hasLoadedVerificationStateFromNetwork = true;
    isCurrentlyLoadingVerificationStateFromNetwork = false;
  };

  const handleKeyupAmount = () => {
    if (amount > 0) {
      showGasFee = true;
      transferAmount = amount;
    } else {
      showGasFee = false;
      transferAmount = null;
    }
  };
</script>

<div class="wallet">
  <div>
    <TransferHeading {contact} {hasLoadedVerificationStateFromNetwork} />
  </div>

  <div class="detailsContainer">
    <div class="destinationWalletAddressContainer">
      <input
        bind:value={destinationWalletAddress}
        type="text"
        required
        on:keyup|preventDefault={debounce(
          handleKeyupdestinationWalletAddress,
          1 * SECOND
        )}
      />
      <span class="floating-label">wallet address</span>
    </div>
    <div class="amountContainer">
      <input
        class="usdc-amount"
        bind:value={amount}
        type="text"
        required
        on:keyup|preventDefault={debounce(handleKeyupAmount, 1 * SECOND)}
      />
      <span class="floating-label">amount</span>
      {#if showGasFee}
        <span class="gasfee"> fee: 0.00025</span>{/if}
    </div>
  </div>

  {#if isCurrentlyLoadingVerificationStateFromNetwork}
    <LoaderModal />
  {/if}

  <TransferButtons
    isAnonymous={Boolean(verifiedClaims)}
    sendButtonDisabled={isSendButtonDisabled}
    {destinationWalletAddress}
    {transferAmount}
    bind:sendClicked={isSending}
    bind:requestVerificationClicked={isAskingWalletOwnerToGetVerified}
    bind:sendAnywayClicked={isSendingAnyway}
  />
  {#if isSending}
    <Modal buttonType="transfer">
      <TransactionCompleted
        {destinationWalletAddress}
        {transferAmount}
        verifiedAddress={true}
        name={verifiedClaims.givenName}
      />
    </Modal>
  {/if}

  {#if isSendingAnyway}
    <Modal buttonType="transfer"
      ><div>
        <TransactionCompleted
          {destinationWalletAddress}
          {transferAmount}
          verifiedAddress={false}
          name={null}
        />
      </div></Modal
    >
  {/if}

  {#if isAskingWalletOwnerToGetVerified}
    <Modal buttonType="requestVerification">
      <!-- <div>
       emailAddress is missing
        <RequestVerification
          {destinationdestinationWalletAddress}
          {transferAmount}
          bind:isPending
        />isPending
      </div> -->
    </Modal>
  {/if}
</div>

<style>
  .wallet {
    min-width: var(--wallet-width);
    max-width: var(--wallet-width);
    min-height: var(--wallet-height);
    max-height: var(--wallet-height);
    display: grid;
    grid-auto-flow: row;
    justify-content: center;
    align-items: center;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-columns: 100%;
  }
  .detailsContainer {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 1fr;
    justify-content: center;
    align-self: center;
    width: 100%;
    gap: 15px;
  }
  input {
    border-radius: 9px;
    padding: 10px 0px 0px 10px;
    border: 1px solid rgba(217, 217, 217, 0.3);
    background-color: rgba(217, 217, 217, 0.3);
    font-size: 14px;
    width: 200px;
    height: 35px;
    font-size: 1.1rem;
    color: #4d4d4d;
    font-weight: 600;
  }
  .usdc-amount {
    background: url("../../assets/usdc.svg") no-repeat scroll 175px 10px;
    background-size: 26px;
    background-color: rgba(217, 217, 217, 0.3);
  }
  input:focus {
    outline: none !important;
    border: 2px solid rgba(65, 156, 253, 0.8);
    box-shadow: 0 0 2px rgba(65, 156, 253, 0.3);
  }
  input:focus ~ .floating-label,
  input:not(:focus):valid ~ .floating-label {
    top: -1px;
    font-size: 0.7rem;
    opacity: 1;
  }

  .floating-label {
    position: absolute;
    pointer-events: none;
    color: #9d9d9d;
    left: 15px;
    top: 10px;
    transition: 0.2s ease all;
    font-size: 0.9rem;
  }
  .destinationWalletAddressContainer {
    position: relative;
  }
  .amountContainer {
    position: relative;
    display: grid;
  }
  .gasfee {
    font-size: 0.65rem;
    color: #4d4d4d;
    justify-self: end;
    font-weight: 600;
    padding: 3px 4px 0px 0px;
  }
</style>
