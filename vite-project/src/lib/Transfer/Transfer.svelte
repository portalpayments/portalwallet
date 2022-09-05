<script lang="ts">
  import {
    connectionStore,
    keyPairStore,
    identityTokenIssuerPublicKey,
  } from "../stores";
  import { PublicKey, Connection, Keypair } from "@solana/web3.js";
  import TransferHeading from "./TransferHeading.svelte";
  import ConfirmTransferButtons from "./TransferButtons.svelte";
  import LoaderModal from "../UI/LoaderModal.svelte";
  import Input from "../UI/Input.svelte";
  import Modal from "../UI/Modal.svelte";
  import RequestVerification from "./RequestVerification.svelte";
  import TransactionCompleted from "./TransactionCompleted.svelte";
  import { verifyWallet } from "../../../../src/vmwallet";
  import { checkIfValidWalletAddress } from "../utils";
  import { log, sleep, stringify, isEmpty } from "../../../../src/functions";
  import {
    SECONDS,
    SECOND,
    USDC_MAINNET_MINT_ACCOUNT,
  } from "../../../../src/constants";
  import type { VerifiedClaims } from "../../../../src/types";
  import { makeTokenAccount, sendUSDC } from "../../../../src/tokens";
  import type { Contact } from "../types";

  const ACTUALLY_SEND_MONEY = false;

  let destinationWalletAddress: string | null = null;
  let transferAmount: number | null = null;

  let hasLoadedVerificationStateFromNetwork = false;
  let isCurrentlyLoadingVerificationStateFromNetwork = false;

  let verifiedClaims: VerifiedClaims | null = null;

  let isSendButtonDisabled = true;

  let isAskingWalletOwnerToGetVerified = false;

  let isSendingAnyway = false;
  let isSending = false;
  let transActionIsComplete = false;

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
    const transferAmountInMinorUnits = Number(transferAmount) * 100;

    if (ACTUALLY_SEND_MONEY) {
      log(`Doing transfer, will send ${transferAmountInMinorUnits} cents`);

      const senderTokenAccount = await makeTokenAccount(
        connection,
        keyPair,
        new PublicKey(USDC_MAINNET_MINT_ACCOUNT),
        keyPair.publicKey
      );

      log(
        `Made / found our USDC token account`,
        senderTokenAccount.address.toBase58()
      );

      const recipientTokenAccount = await makeTokenAccount(
        connection,
        keyPair,
        new PublicKey(USDC_MAINNET_MINT_ACCOUNT),
        new PublicKey(contact.walletAddress)
      );

      log(
        `Made / found recipient's USDC token account`,
        senderTokenAccount.address.toBase58()
      );

      const signature = await sendUSDC(
        connection,
        keyPair,
        senderTokenAccount,
        recipientTokenAccount,
        transferAmount
      );
      log(`Finished transfer, signature was`, signature);
    } else {
      log(`ACTUALLY_SEND_MONEY is false, skipping transfer`);
      await sleep(1 * SECOND);
    }

    isSending = false;
    isSendingAnyway = false;
    transActionIsComplete = true;
  };

  $: (isSending || isSendingAnyway) && doTransfer();

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

  <ConfirmTransferButtons
    isAnonymous={isEmpty(verifiedClaims)}
    {isSendButtonDisabled}
    {destinationWalletAddress}
    {transferAmount}
    bind:isSending
    bind:isAskingWalletOwnerToGetVerified
    bind:sendAnywayClicked={isSendingAnyway}
  />

  {#if isSending || isSendingAnyway}
    <Modal buttonType="transfer">Loading...</Modal>
  {/if}

  {#if transActionIsComplete}
    <Modal buttonType="transfer">
      <TransactionCompleted
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
