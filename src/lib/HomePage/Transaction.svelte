<script lang="ts">
  import {
    amountAndDecimalsToMajorAndMinor,
    truncateWallet,
  } from "../../lib/utils";
  import type {
    SimpleTransaction,
    Contact,
    CurrencyDetails,
  } from "../../backend/types";
  import { log, isEmpty, stringify } from "../../backend/functions";
  import { formatNumber } from "../utils";
  import { getCurrencyByMint } from "../../backend/solana-functions";
  import { Direction } from "../../backend/types";
  import { getGradient } from "../../backend/deterministic-beautiful-gradient";
  import { contactsStore } from "../stores";

  import { onMount } from "svelte";

  let gradient: string | null = null;

  export let transaction: SimpleTransaction | null;
  export let decimals: number;


  // Find the contact for this transaction
  //
  // TODO - we could just make a prop for the contact on the transaction
  // and the parent could provide the contact
  // rather than having every single Transaction subscribe to contact store
  let contact: Contact | null = null;
  contactsStore.subscribe(async (newValue) => {
    if (newValue) {
      let contactWalletAddress: string | null = transaction.counterParty;
      contact = newValue.find(
        (contact) => contact.walletAddress === contactWalletAddress
      );
      if (!contact) {
        log(
          `Contact for ${contactWalletAddress} used in this transaction hasn't yet loaded in contact store`
        );
        return;
      }
      gradient = await getGradient(contact.walletAddress);
    }
  });

  const isRecievedOrSwapped =
    transaction.direction === Direction.recieved ||
    transaction.direction === Direction.swapped;

  const formattedAmount = formatNumber(
    isRecievedOrSwapped,
    transaction.amount,
    decimals,
    true
  );

  let swapCurrencyMajorAndMinor = null;
  let swapCurrencyDetails: CurrencyDetails | null = null;

  if (transaction.direction === Direction.swapped) {
    swapCurrencyDetails = getCurrencyByMint(transaction.swapCurrency) || null;
    swapCurrencyMajorAndMinor = amountAndDecimalsToMajorAndMinor(
      transaction.swapAmount,
      swapCurrencyDetails.decimals
    );
  }
</script>

<div
  class={`transaction ${transaction.id} ${
    transaction.receipt ? "with-receipt" : ""
  }`}
>
  <textarea class="debug">{stringify(transaction)}</textarea>
  {#if transaction.direction === Direction.swapped}
    <img
      class="swap-currency"
      alt={swapCurrencyDetails.symbol}
      src={getCurrencyBySymbol(swapCurrencyDetails.symbol).logo}
    />
    <div class="name-and-memo">
      <div class="name">
        Swapped {swapCurrencyMajorAndMinor[0]}.{swapCurrencyMajorAndMinor[1]}
        {swapCurrencyDetails.symbol} for
        {getCurrencyByMint(transaction.currency).symbol}
      </div>
    </div>
  {/if}
  {#if transaction.direction === null}
    <div class="profile-pic">
      <div>✔️</div>
    </div>
    <div class="name-and-memo">
      <div class="name">Wallet approval</div>
    </div>
  {/if}
  {#if transaction.direction === Direction.recieved || transaction.direction === Direction.sent}
    {#if contact}
      {#if isEmpty(contact.verifiedClaims)}
        {#if contact.profilePictureURL}
          <!-- Solana PFP 'standard' (very few people uses this) -->
          <img
            class="profile-pic individual"
            src={contact.profilePictureURL}
            alt="wallet avatar"
          />
        {:else}
          <!-- Make a gradient from the wallet address -->
          <div class="hash-avatar-wrapper" style={gradient} />
        {/if}
      {:else}
        <!-- Verified selfie -->
        <img
          class="profile-pic {contact?.verifiedClaims?.type === 'ORGANIZATION'
            ? 'organization'
            : 'individual'}"
          src={contact.verifiedClaims.imageUrl}
          alt="wallet avatar"
        />
      {/if}
      <div class="name-and-memo">
        <div class="name">
          {#if transaction?.receipt?.shop}
            {transaction.receipt.shop}
          {:else if !isEmpty(contact?.verifiedClaims)}
            {#if contact.verifiedClaims.type === "INDIVIDUAL"}
              {contact.verifiedClaims?.givenName}
              {contact.verifiedClaims?.familyName}
            {/if}
            {#if contact.verifiedClaims.type === "ORGANIZATION"}
              {contact.verifiedClaims?.legalName}
            {/if}
          {:else if transaction.isMultisig}
            Multisig wallet
          {:else}
            Anonymous
          {/if}
        </div>
        {#if transaction.memo && !transaction.receipt}
          <div class="memo">{transaction.memo}</div>
        {/if}
        {#if !transaction?.receipt?.shop && isEmpty(contact?.verifiedClaims)}
          <div class="memo">{truncateWallet(contact.walletAddress)}</div>
        {/if}
      </div>
    {:else}
      Error: could not load contact for transaction.
    {/if}
  {/if}
  <div class="amount {isRecievedOrSwapped ? 'positive' : ''}">
    {formattedAmount}
  </div>
  {#if transaction.receipt}
    <div class="receipt">
      {#each transaction.receipt.items as item, index}
        <div class="receipt-item">
          <div class="receipt-item-name">{item.quantity} × {item.name}</div>
          <!-- Oddly Decaf receipts are in major units -->
          <div class="receipt-item-price">{item.price}.00</div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  @import "../../mixins.scss";
  .transaction {
    display: grid;
    color: var(--black);
    grid-auto-flow: column;
    grid-template-columns: 42px 1fr 64px;
    align-items: center;
    gap: 8px;
  }

  .transaction.with-receipt {
    grid-template-rows: 1fr 24px;
    grid-template-columns: 42px 1fr 64px;
  }

  .receipt {
    grid-row-start: 2;
    grid-column-start: 1;

    grid-row-end: 3;
    grid-column-end: 4;

    font-size: 14px;
  }

  .receipt-item {
    width: 100%;
    grid-template-columns: 1fr 64px;
  }

  .receipt-item-name {
    width: 100%;
    text-align: left;
  }

  .receipt-item-price {
    width: 100%;
    text-align: right;
  }

  .swap-currency {
    width: 50%;
    align-self: center;
    justify-self: center;
  }

  .profile-pic.individual {
    border-radius: 50%;
  }

  .profile-pic.organization {
    border-radius: 4px;
  }

  img {
    width: 100%;
  }

  .name-and-memo {
    text-align: left;
  }

  .name {
    font-weight: 600;
  }

  .memo {
    font-size: 11px;
    line-height: 14px;
    /* Solana pay writes long unreadable memos */
    overflow: hidden;
  }

  .amount {
    text-align: right;
    font-weight: 600;
  }

  .positive {
    color: var(--bright-green);
  }

  .hash-avatar-wrapper {
    height: 42px;
    width: 42px;
    overflow: hidden;
    border-radius: 50%;
  }
</style>
