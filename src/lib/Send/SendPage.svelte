<script lang="ts">
  import { connectionStore, authStore } from "../stores";
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
  import { verifyWallet } from "../../backend/identity-tokens";
  import { makeAccountsAndDoTransfer } from "../../backend/tokens";
  import { truncateWallet } from "../utils";
  import { checkIfValidWalletAddress } from "../../backend/solana-functions";
  import { log, sleep, stringify } from "../../backend/functions";
  import { checkWalletAddressOrName } from "../../backend/check-wallet-address-or-name";
  import { SECOND } from "../../backend/constants";

  import type {
    VerifiedClaimsForIndividual,
    VerifiedClaimsForOrganization,
  } from "../../backend/types";
  import type { Contact } from "../../backend/types";
  import { updateAccountsForNewTransaction, getActiveAccount } from "../stores";
  import { SECONDS } from "../../backend/constants";
  import { getCurrencyByMint } from "../../backend/solana-functions";
  import { PORTAL_IDENTITY_TOKEN_ISSUER_WALLET } from "../../backend/constants";

  const identityTokenIssuerPublicKey = new PublicKey(
    PORTAL_IDENTITY_TOKEN_ISSUER_WALLET
  );

  let destinationWalletAddress: string | null = null;
  let transferAmount: number | null = null;
  let memo: string | null = null;

  // The entered wallet name or address (foo.sol, abcdef, foo.abc, whatever)
  let walletNameEnteredByUser: string | null = null;

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
      profilePictureURL: null,
    };
  }

  const activeAccount = getActiveAccount();

  const currency = activeAccount
    ? getCurrencyByMint(activeAccount.currency)
    : null;

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
    try {
      // Convert UI displayed major units into minor units
      const transferAmountInMinorUnits = getAmountInMinorUnits(
        transferAmount,
        activeAccount.decimals
      );

      log(`Doing transfer, will send ${transferAmountInMinorUnits} cents`);

      const signature = await makeAccountsAndDoTransfer(
        connection,
        keyPair,
        transferAmountInMinorUnits,
        currency,
        new PublicKey(contact.walletAddress),
        memo
      );
      log(`Finished transfer, signature was`, signature);
      await updateAccountsForNewTransaction(signature, activeAccount.address);

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

  const resolveInputWalletNameOrAddress = async () => {
    isCurrentlyLoadingVerificationStateFromNetwork = true;
    isSendButtonDisabled = true;

    const walletNameCheckResults = await checkWalletAddressOrName(
      connection,
      walletNameEnteredByUser
    );

    if (!walletNameCheckResults.destinationWalletAddress) {
      // TODO: handle invalid wallet addresses better
      log(
        `The name or addresss '${walletNameEnteredByUser}' is not a valid wallet name or address`
      );
      verifiedClaims = null;
      isAskingWalletOwnerToGetVerified = false;
      isSendingAnyway = false;
      isSending = false;
      hasLoadedVerificationStateFromNetwork = false;
      isCurrentlyLoadingVerificationStateFromNetwork = false;
      return;
    }

    log(
      `This is a valid wallet ${
        walletNameCheckResults.isUsingWalletname ? "name" : "address"
      }}`
    );
    destinationWalletAddress = walletNameCheckResults.destinationWalletAddress;
    contact.profilePictureURL = walletNameCheckResults.profilePictureURL;

    log(`Valid wallet address!`);

    // Get identity from the Portal Identity Token
    verifiedClaims = await verifyWallet(
      connection,
      keyPair,
      identityTokenIssuerPublicKey,
      new PublicKey(destinationWalletAddress),
      true
    );

    log(`Verification result:`, verifiedClaims);

    hasLoadedVerificationStateFromNetwork = true;
    isCurrentlyLoadingVerificationStateFromNetwork = false;
    isSendButtonDisabled = false;
  };
</script>

<div class="send-screen">
  <SendHeading
    {contact}
    {hasLoadedVerificationStateFromNetwork}
    {walletNameEnteredByUser}
  />

  <div class="inputs">
    <FocusContext>
      <Input
        bind:value={walletNameEnteredByUser}
        label="wallet name or address"
        isFocused={true}
        filterField={null}
        onTypingPause={resolveInputWalletNameOrAddress}
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
  .send-screen {
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
