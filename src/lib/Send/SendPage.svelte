<script lang="ts">
  import {
    connectionStore,
    authStore,
    identityTokenIssuerPublicKey,
  } from "../stores";
  import { PublicKey, Connection, Keypair } from "@solana/web3.js";
  import SendHeading from "./SendHeading.svelte";
  import Heading from "../Shared/Heading.svelte";
  import SendButtons from "./SendButtons.svelte";
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
  import { updateAccountTransactions, getActiveAccount } from "../stores";
  import { SECONDS } from "../../backend/constants";
  const ACTUALLY_SEND_MONEY = true;

  const TRANSACTION_TIME_IS_SLOW = 5 * SECONDS;

  let destinationWalletAddress: string | null = null;
  let transferAmount: number | null = null;
  let memo: string | null = null;

  let hasLoadedVerificationStateFromNetwork = false;
  let isCurrentlyLoadingVerificationStateFromNetwork = false;

  let verifiedClaims: VerifiedClaims | null = null;

  let isSendButtonDisabled = true;

  let keepWaitingMessage: string | null = null;

  let isAskingWalletOwnerToGetVerified = false;

  let isSendingAnyway = false;
  let isSending = false;
  let isTransactionComplete = false;

  let transactionFailed = false;
  let errorMessage: string | null = null;

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
    const slowTransactionTimeout = setTimeout(() => {
      keepWaitingMessage = "Nearly there...";
    }, TRANSACTION_TIME_IS_SLOW);
    try {
      // Convert UI displayed major units into minor units
      const activeAccount = getActiveAccount();
      const multiplier = 10 ** activeAccount.decimals;
      const transferAmountInMinorUnits = Number(transferAmount) * multiplier;

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

        await updateAccountTransactions(signature, activeAccount.address);
      } else {
        log(`ACTUALLY_SEND_MONEY is false, skipping transfer`);
        await sleep(1 * SECOND);
      }

      clearTimeout(slowTransactionTimeout);

      isSending = false;
      isSendingAnyway = false;
      isTransactionComplete = true;
    } catch (thrownObject) {
      const error = thrownObject as Error;
      transactionFailed = true;
      errorMessage = error.message;
    }
  };

  $: (isSending || isSendingAnyway) && doTransfer();

  connectionStore.subscribe((newValue) => {
    connection = newValue;
  });

  let keyPair: Keypair | null = null;

  authStore.subscribe((newValue) => {
    if (newValue.keyPair) {
      keyPair = newValue.keyPair;
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

    // Get identity from the portal Identity Token
    verifiedClaims = await verifyWallet(
      connection,
      keyPair,
      identityTokenIssuerPublicKey,
      new PublicKey(destinationWalletAddress),
      true
    );

    log(`Verification result!`, verifiedClaims);

    hasLoadedVerificationStateFromNetwork = true;
    isCurrentlyLoadingVerificationStateFromNetwork = false;
    isSendButtonDisabled = false;
  };
</script>

<div class="transfer-page">
  <SendHeading {contact} {hasLoadedVerificationStateFromNetwork} />

  <div class="inputs">
    <FocusContext>
      <Input
        bind:value={destinationWalletAddress}
        label="wallet address"
        isFocused={true}
        isAmount={false}
        filterField={"walletAddress"}
        onTypingPause={handleKeyupDestinationWalletAddress}
        theme="square"
      />

      <Input
        bind:value={transferAmount}
        label="amount"
        isFocused={false}
        isAmount={true}
        filterField={"numbers"}
        onTypingPause={null}
        theme="square"
      />

      <Input
        bind:value={memo}
        label="Message (eg 'Thanks!')"
        isFocused={false}
        isAmount={false}
        filterField={null}
        onTypingPause={null}
        theme="square"
      />
    </FocusContext>
  </div>

  {#if isCurrentlyLoadingVerificationStateFromNetwork}
    <Modal>
      <Circle color="var(--mid-blue)" />
    </Modal>
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
    <Modal>
      <div class="transferring-wait">
        <Heading>Sending money...</Heading>
        {#if keepWaitingMessage}
          <p>{keepWaitingMessage}</p>
        {/if}
        <Circle color="var(--mid-blue)" />
      </div>
    </Modal>
  {/if}

  {#if isTransactionComplete}
    <Modal showCloseButton={true}>
      <TransactionCompleted
        {destinationWalletAddress}
        {transferAmount}
        {verifiedClaims}
      />
    </Modal>
  {/if}

  {#if transactionFailed}
    <Modal>
      <TransactionFailed
        {errorMessage}
        {destinationWalletAddress}
        {transferAmount}
        {verifiedClaims}
      />
    </Modal>
  {/if}

  {#if isAskingWalletOwnerToGetVerified}
    <Modal>
      <RequestVerification
        {destinationWalletAddress}
        {transferAmount}
        bind:isPending={isAskingWalletOwnerToGetVerified}
      />
    </Modal>
  {/if}
</div>

<style type="text/scss">
  .transfer-page {
    min-width: var(--wallet-width);
    max-width: var(--wallet-width);
    min-height: var(--wallet-height);
    max-height: var(--wallet-height);
    display: grid;
    grid-auto-flow: row;
    align-items: center;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-columns: 100%;

    /* Cool subtle background borrowed from website */
    background: radial-gradient(at 50% 50%, #ddfff6 0, #fff 80%, #fff 100%);
  }
  .inputs {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 1fr;
    align-self: center;
    width: 100%;
    gap: 12px;
    padding: 12px;
  }

  .transferring-wait {
    justify-items: center;
    align-content: center;
    gap: 24px;
  }
</style>
