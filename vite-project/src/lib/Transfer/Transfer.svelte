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
  import Input from "../UI/Input.svelte";
  import Modal from "../UI/Modal.svelte";
  import RequestVerification from "./RequestVerification.svelte";
  import TransactionCompleted from "./TransactionCompleted.svelte";
  import { verifyWallet } from "../../../../src/vmwallet";
  import { checkIfValidWalletAddress } from "../utils";
  import { log } from "../../../../src/functions";
  import type { VerifiedClaims } from "../../../../src/types";

  let destinationWalletAddress: string | null = null;
  let transferAmount: number | null;

  let hasLoadedVerificationStateFromNetwork = false;
  let isCurrentlyLoadingVerificationStateFromNetwork = false;

  let verifiedClaims: VerifiedClaims | null = null;

  let isSendButtonDisabled = true;

  let isAskingWalletOwnerToGetVerified = false;

  let isSendingAnyway = false;
  let isSending = false;
  let transActionIsComplete = false;

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

  const handleKeyupDestinationWalletAddress = async () => {
    isCurrentlyLoadingVerificationStateFromNetwork = true;
    isSendButtonDisabled = true;

    let isValidDestinationWalletAddress = checkIfValidWalletAddress(
      destinationWalletAddress
    );

    if (!isValidDestinationWalletAddress) {
      // TODO: handle invalid wallet addresses better
      log(`This ${destinationWalletAddress} is not a valid wallet address`);
      verifiedClaims = null;
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
    isSendButtonDisabled = false;
  };
</script>

<div class="transfer-screen">
  <TransferHeading {contact} {hasLoadedVerificationStateFromNetwork} />

  <div class="destination-and-amount">
    <Input
      bind:value={destinationWalletAddress}
      label="wallet address"
      isAmount={false}
      filterField={"walletAddress"}
      onTypingPause={handleKeyupDestinationWalletAddress}
    />

    <Input
      bind:value={transferAmount}
      label="amount"
      isAmount={true}
      filterField={"numbers"}
      onTypingPause={null}
    />
  </div>

  {#if isCurrentlyLoadingVerificationStateFromNetwork}
    <LoaderModal />
  {/if}

  <TransferButtons
    isAnonymous={!verifiedClaims}
    sendButtonDisabled={isSendButtonDisabled}
    {destinationWalletAddress}
    {transferAmount}
    bind:sendClicked={isSending}
    bind:requestVerificationClicked={isAskingWalletOwnerToGetVerified}
    bind:sendAnywayClicked={isSendingAnyway}
  />
  {#if isSending || isSendingAnyway}
    {#if transActionIsComplete}
      <Modal buttonType="transfer">
        <TransactionCompleted
          {destinationWalletAddress}
          {transferAmount}
          verifiedAddress={Boolean(verifiedClaims)}
          name={verifiedClaims.givenName}
        />
      </Modal>
    {:else}
      Loading...
    {/if}
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
  .transfer-screen {
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
  .destination-and-amount {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 1fr;
    justify-content: center;
    align-self: center;
    width: 100%;
    gap: 15px;
  }
</style>
