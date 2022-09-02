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
  import base58 from "bs58";

  import { SECONDS, SECOND } from "../../../../src/constants";
  import { log } from "../../../../src/functions";

  let walletAddress: string = "";
  let amount: number;
  let fetchedAddressDetails = {
    addressFetched: false,
    name: "",
    isAnonymous: false,
    isPending: false,
    isNew: false,
  };

  let sendButtonDisabled = true;

  let showGasFee = false;

  let isLoading = false;

  let isRequestingVerification = false;
  let isSendingAnyway = false;
  let isSending = false;

  let destinationWalletAddress: string | null;
  let transferAmount: number | null;

  let connection: Connection | null = null;

  connectionStore.subscribe((value) => {
    connection = value;
  });

  let keyPair: Keypair | null = null;

  keyPairStore.subscribe((value) => {
    keyPair = value;
  });

  const handleKeyupWalletAddress = async () => {
    isLoading = true;

    let isValidWalletAddress: Boolean | null = null;
    try {
      new PublicKey(walletAddress);
      isValidWalletAddress = true;
    } catch {
      isValidWalletAddress = false;
    }

    if (!isValidWalletAddress) {
      // TODO: handle invalid wallet addresses better
      log(`This is not a valid wallet address`);

      fetchedAddressDetails.addressFetched = false;
      fetchedAddressDetails.isAnonymous = false;
      sendButtonDisabled = true;
      isRequestingVerification = false;
      isSendingAnyway = false;
      isSending = false;
      isLoading = false;
      return;
    }

    // Get identity from the portal Identity Token
    const verifiedClaims = await verifyWallet(
      connection,
      keyPair,
      identityTokenIssuerPublicKey,
      new PublicKey(walletAddress)
    );

    isLoading = false;

    if (!verifiedClaims) {
      fetchedAddressDetails.addressFetched = true;
      fetchedAddressDetails.isAnonymous = true;
    }

    if (verifiedClaims) {
      fetchedAddressDetails.addressFetched = true;
      fetchedAddressDetails.isNew = true;
      fetchedAddressDetails.name = `${verifiedClaims.givenName} ${verifiedClaims.familyName}`;
      fetchedAddressDetails.isAnonymous = false;
      sendButtonDisabled = false;
    }

    destinationWalletAddress = walletAddress;
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
    <!-- <TransferHeading {...fetchedAddressDetails} /> -->
  </div>

  <div class="detailsContainer">
    <div class="walletaddressContainer">
      <input
        bind:value={walletAddress}
        type="text"
        required
        on:keyup|preventDefault={debounce(handleKeyupWalletAddress, 1 * SECOND)}
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
  {#if isLoading}
    <LoaderModal />
  {/if}
  <TransferButtons
    isAnonymous={fetchedAddressDetails.isAnonymous}
    {sendButtonDisabled}
    {destinationWalletAddress}
    {transferAmount}
    bind:sendClicked={isSending}
    bind:requestVerificationClicked={isRequestingVerification}
    bind:sendAnywayClicked={isSendingAnyway}
  />
  {#if isSending}
    <Modal buttonType="transfer">
      <TransactionCompleted
        {destinationWalletAddress}
        {transferAmount}
        verifiedAddress={true}
        name={fetchedAddressDetails.name}
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
          name={fetchedAddressDetails.name}
        />
      </div></Modal
    >
  {/if}

  {#if isRequestingVerification}
    <Modal buttonType="requestVerification"
      ><div>
        <!-- TODO emailAddress is missing -->
        <RequestVerification
          {destinationWalletAddress}
          {transferAmount}
          bind:isPending={fetchedAddressDetails.isPending}
        />
      </div></Modal
    >
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
  .walletaddressContainer {
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
