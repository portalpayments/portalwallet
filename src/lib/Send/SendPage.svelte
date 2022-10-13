<script lang="ts">
  import {
    connectionStore,
    authStore,
    identityTokenIssuerPublicKey,
  } from "../stores";
  import { PublicKey, Connection, Keypair } from "@solana/web3.js";
  import SendHeading from "./SendHeading.svelte";
  import SendButtons from "./SendButtons.svelte";
  import LoaderModal from "../Shared/LoaderModal.svelte";
  import Input from "../Shared/Input.svelte";
  import Modal from "../Shared/Modal.svelte";
  import RequestVerification from "./RequestVerification.svelte";
  import FocusContext from "../Shared/FocusContext.svelte";
  import TransactionCompleted from "./TransactionCompleted.svelte";
  import TransactionFailed from "./TransactionFailed.svelte";
  import { verifyWallet } from "../../backend/vmwallet";
  import { makeAccountsAndDoTransfer } from "../../backend/tokens";
  import { checkIfValidWalletAddress } from "../utils";
  import { log, sleep, stringify } from "../../backend/functions";
  import { Circle } from "svelte-loading-spinners";
  import { SECOND } from "../../backend/constants";
  import type { VerifiedClaims } from "../../backend/types";
  import type { Contact } from "../types";

  const ACTUALLY_SEND_MONEY = true;

  const CACHED_VERIFIED_CLAIMS_BY_WALLET_ADDRESS: Record<
    string,
    VerifiedClaims
  > = {
    "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG": {
      familyName: "Hatami",
      givenName: "Vaheh",
      // TODO: add images next time we mint tokens
      imageUrl: "",
      type: "INDIVIDUAL",
    },
  };

  let destinationWalletAddress: string | null = null;
  let transferAmount: number | null = null;
  let memo: string | null = null;

  let hasLoadedVerificationStateFromNetwork = false;
  let isCurrentlyLoadingVerificationStateFromNetwork = false;

  let verifiedClaims: VerifiedClaims | null = null;

  let isSendButtonDisabled = true;

  let isAskingWalletOwnerToGetVerified = false;

  let isSendingAnyway = false;
  let isSending = false;
  let isTransactionComplete = false;

  let transactionFailed = false;
  let error;

  let connection: Connection | null = null;

  let contact: Contact | null = null;

  $: {
    log(`Updating contact`);
    contact = {
      walletAddress: destinationWalletAddress,
      isNew: true,
      isPending: false,
      verifiedClaims,
    };
  }

  const doTransfer = async () => {
    // USDC actually has 6 decimal places
    try {
      const transferAmountInMinorUnits = Number(transferAmount) * 1e6;

      if (ACTUALLY_SEND_MONEY) {
        log(`Doing transfer, will send ${transferAmountInMinorUnits} cents`);

        const signature = await makeAccountsAndDoTransfer(
          connection,
          keyPair,
          transferAmountInMinorUnits,
          new PublicKey(contact.walletAddress),
          memo,
          true
        );

        log(`Finished transfer, signature was`, signature);
      } else {
        log(`ACTUALLY_SEND_MONEY is false, skipping transfer`);
        await sleep(1 * SECOND);
      }

      isSending = false;
      isSendingAnyway = false;
      isTransactionComplete = true;
    } catch (error) {
      transactionFailed = true;
      error = error;
    }
  };

  $: (isSending || isSendingAnyway) && doTransfer();

  connectionStore.subscribe((newValue) => {
    connection = newValue;
  });

  let keyPair: Keypair | null = null;

  authStore.subscribe((newValue) => {
    if (newValue.secretKey) {
      keyPair = Keypair.fromSecretKey(newValue.secretKey);
    }
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

    const cachedVerifiedClaims =
      CACHED_VERIFIED_CLAIMS_BY_WALLET_ADDRESS[destinationWalletAddress];

    if (cachedVerifiedClaims) {
      log(`Using cached verified claims`);
      verifiedClaims = cachedVerifiedClaims;
      await sleep(1 * SECOND);
    } else {
      // Get identity from the portal Identity Token
      verifiedClaims = await verifyWallet(
        connection,
        keyPair,
        identityTokenIssuerPublicKey,
        new PublicKey(destinationWalletAddress)
      );
    }

    log(`Verification result!`, verifiedClaims);

    hasLoadedVerificationStateFromNetwork = true;
    isCurrentlyLoadingVerificationStateFromNetwork = false;
    isSendButtonDisabled = false;
  };
</script>

<div class="transfer-page">
  <SendHeading {contact} {hasLoadedVerificationStateFromNetwork} />

  <div class="destination-and-amount">
    <FocusContext>
      <Input
        bind:value={destinationWalletAddress}
        label="wallet address"
        isFocused={true}
        isAmount={false}
        filterField={"walletAddress"}
        onTypingPause={handleKeyupDestinationWalletAddress}
      />

      <Input
        bind:value={transferAmount}
        label="amount"
        isFocused={false}
        isAmount={true}
        filterField={"numbers"}
        onTypingPause={null}
      />

      <Input
        bind:value={memo}
        label="Message to recipient (optional)"
        isFocused={false}
        isAmount={false}
        filterField={null}
        onTypingPause={null}
      />
    </FocusContext>
  </div>

  {#if isCurrentlyLoadingVerificationStateFromNetwork}
    <LoaderModal />
  {/if}

  {#if hasLoadedVerificationStateFromNetwork}
    <SendButtons
      isAnonymous={!verifiedClaims}
      {isSendButtonDisabled}
      {destinationWalletAddress}
      {transferAmount}
      bind:isSending
      bind:isAskingWalletOwnerToGetVerified
      bind:sendAnywayClicked={isSendingAnyway}
    />
  {/if}

  {#if isSending || isSendingAnyway}
    <Modal buttonType="transfer">
      <div class="transferring-wait">Sending money...</div>
      <Circle color="var(--mid-blue)" />
    </Modal>
  {/if}

  {#if isTransactionComplete}
    <Modal buttonType="transfer">
      <TransactionCompleted
        {destinationWalletAddress}
        {transferAmount}
        {verifiedClaims}
      />
    </Modal>
  {/if}

  {#if transactionFailed}
    <Modal buttonType="transfer">
      <TransactionFailed
        {error}
        {destinationWalletAddress}
        {transferAmount}
        {verifiedClaims}
      />
    </Modal>
  {/if}

  {#if isAskingWalletOwnerToGetVerified}
    <Modal buttonType="requestVerification">
      <RequestVerification
        {destinationWalletAddress}
        {transferAmount}
        bind:isPending={isAskingWalletOwnerToGetVerified}
      />
    </Modal>
  {/if}
</div>

<style>
  .transfer-page {
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

    /* Cool subtle background borrowed from website */
    background: radial-gradient(at 50% 50%, #ddfff6 0, #fff 80%, #fff 100%);
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

  .transferring-wait {
    padding-bottom: 24px;
    font-weight: bold;
  }
</style>
