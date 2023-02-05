<script lang="ts">
  import {
    connectionStore,
    authStore,
    identityTokenIssuerPublicKey,
  } from "../stores";
  import { PublicKey, Connection, Keypair } from "@solana/web3.js";
  import Fee from "./Fee.svelte";
  import SendHeading from "./SendHeading.svelte";
  import Heading from "../Shared/Heading.svelte";
  import Loader from "../Shared/Loader.svelte";
  import SendButtons from "./SendButtons.svelte";
  import Input from "../Shared/Input.svelte";
  import Modal from "../Shared/Modal.svelte";
  import RequestVerification from "./RequestVerification.svelte";
  import FocusContext from "../Shared/FocusContext.svelte";
  import TransactionFailed from "./TransactionFailed.svelte";
  import { verifyWallet } from "../../backend/wallet";
  import { makeAccountsAndDoTransfer } from "../../backend/tokens";
  import { checkIfValidWalletAddress, truncateWallet } from "../utils";
  import { log, sleep, stringify } from "../../backend/functions";
  import { SECOND } from "../../backend/constants";
  import type {
    VerifiedClaimsForIndividual,
    VerifiedClaimsForOrganization,
  } from "../../backend/types";
  import type { Contact } from "../../backend/types";
  import { updateAccountTransactions, getActiveAccount } from "../stores";
  import { SECONDS, getCurrencyByMint } from "../../backend/constants";

  let destinationWalletAddress: string | null = null;
  let transferAmount: number | null = null;
  let memo: string | null = null;

  let hasLoadedVerificationStateFromNetwork = false;
  let isCurrentlyLoadingVerificationStateFromNetwork = false;

  let verifiedClaims:
    | VerifiedClaimsForIndividual
    | VerifiedClaimsForOrganization
    | null = null;

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

  let fee: number | null = null;

  $: {
    log(`Updating contact`);
    contact = {
      walletAddress: destinationWalletAddress,
      isNew: true,
      isPending: false,
      verifiedClaims,
    };
  }

  const activeAccount = getActiveAccount();

  const currency = getCurrencyByMint(activeAccount.currency);

  const updateFee = async () => {
    // TODO: estimate fee based on destinationWalletAddress and memo
    log(`Updating fee...`);
    // In lamports
    fee = 25;
  };

  // Convert UI displayed major units into minor units
  export const getAmountInMinorUnits = (
    transferAmount: number,
    decimals: number
  ) => {
    const multiplier = 10 ** decimals;
    const transferAmountInMinorUnits = Number(transferAmount) * multiplier;
    return transferAmountInMinorUnits;
  };

  const doTransfer = async () => {
    const slowTransactionTimeout1 = setTimeout(() => {
      keepWaitingMessage = "Still going...";
    }, 1 * SECONDS);
    const slowTransactionTimeout2 = setTimeout(() => {
      keepWaitingMessage = "Nearly there...";
    }, 2 * SECONDS);
    const slowTransactionTimeout3 = setTimeout(() => {
      keepWaitingMessage = "Finishing up...";
    }, 3 * SECONDS);
    try {
      // Convert UI displayed major units into minor units
      const transferAmountInMinorUnits = getAmountInMinorUnits(
        transferAmount,
        activeAccount.decimals
      );

      log(`Doing transfer, will send ${transferAmountInMinorUnits} cents`);

      const TEST_FAKE_TRANSACTIONS = false;

      if (!TEST_FAKE_TRANSACTIONS) {
        const signature = await makeAccountsAndDoTransfer(
          connection,
          keyPair,
          transferAmountInMinorUnits,
          currency,
          new PublicKey(contact.walletAddress),
          memo
        );
        log(`Finished transfer, signature was`, signature);
        await updateAccountTransactions(signature, activeAccount.address);
      } else {
        log(`TESTING skipping transfer`);
        await sleep(1 * SECOND);
      }

      clearTimeout(slowTransactionTimeout1);
      clearTimeout(slowTransactionTimeout2);
      clearTimeout(slowTransactionTimeout3);

      isSending = false;
      isSendingAnyway = false;
      isTransactionComplete = true;
    } catch (thrownObject) {
      const error = thrownObject as Error;
      log(`Transaction failed:`, error.message);
      log(error.stack);
      transactionFailed = true;
      errorMessage = error.message;
    }
  };

  $: (isSending || isSendingAnyway) && doTransfer();

  $: memo, destinationWalletAddress, updateFee();

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

<div class="transfer-screen">
  <SendHeading {contact} {hasLoadedVerificationStateFromNetwork} />

  <div class="inputs">
    <FocusContext>
      <Input
        bind:value={destinationWalletAddress}
        label="wallet address"
        isFocused={true}
        filterField={"walletAddress"}
        onTypingPause={handleKeyupDestinationWalletAddress}
        theme="square"
      />

      <Input
        bind:value={transferAmount}
        label="amount"
        isFocused={false}
        {currency}
        filterField={"numbers"}
        onTypingPause={null}
        theme="square"
      />

      <Input
        bind:value={memo}
        label="Message (eg 'Thanks!')"
        isFocused={false}
        filterField={null}
        onTypingPause={null}
        theme="square"
      />

      <Fee amount={fee} />
    </FocusContext>
  </div>

  {#if isCurrentlyLoadingVerificationStateFromNetwork}
    <Modal>
      <!-- TODO: we should probably use a different component for verifying versus sending -->
      <Loader isComplete={false} />
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

  {#if isSending || isSendingAnyway || isTransactionComplete}
    <Modal showCloseButton={isTransactionComplete}>
      <Heading>
        {#if !isTransactionComplete}
          Sending money...
        {:else}
          <img
            class="currency-symbol {currency.symbol}"
            src={currency.logo}
            alt={currency.symbol}
          />{transferAmount} recieved by<br />
          {#if verifiedClaims}
            {#if verifiedClaims.type === "INDIVIDUAL"}
              {verifiedClaims.givenName} {verifiedClaims.familyName}!
            {/if}
            {#if verifiedClaims.type === "ORGANIZATION"}
              {verifiedClaims.legalName}!
            {/if}
          {:else}
            {truncateWallet(destinationWalletAddress)}!
          {/if}
        {/if}
      </Heading>

      <Loader isComplete={isTransactionComplete} />
      {#if !isTransactionComplete && keepWaitingMessage}
        <p>{keepWaitingMessage}</p>
      {/if}
    </Modal>
  {/if}

  {#if transactionFailed}
    <Modal>
      <TransactionFailed
        {errorMessage}
        {destinationWalletAddress}
        {transferAmount}
        {currency}
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

<style lang="scss">
  .transfer-screen {
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

  .currency-symbol {
    display: inline;
    height: 22px;
    margin-right: 3px;
    /* Hack to get baseline of $ to line up with baseline of text */
    transform: translateY(2px);
    // Change color.
    // Made with https://codepen.io/sosuke/pen/Pjoqqp
    filter: invert(50%) sepia(98%) saturate(2025%) hue-rotate(172deg)
      brightness(100%) contrast(102%);
  }
</style>
