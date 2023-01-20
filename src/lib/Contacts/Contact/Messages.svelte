<script lang="ts">
  import type {
    SimpleTransaction,
    SimpleWalletMessage,
  } from "../../../backend/types";
  import ChatTransaction from "./ChatTransaction.svelte";
  import {
    log,
    stringify,
    dateToISODate,
    byDateNewestToOldest,
    isoDateToFriendlyName,
  } from "../../../backend/functions";

  export let transactionsAndMessagesByDays: Array<{
    isoDate: string;
    transactionsAndMessages: Array<SimpleTransaction | SimpleWalletMessage>;
  }>;

  log(`Hello from messages svelte`, stringify(transactionsAndMessagesByDays));
</script>

<div class="transaction-history">
  {#each transactionsAndMessagesByDays as transactionsAndMessagesByDay}
    <div class="day">
      {isoDateToFriendlyName(transactionsAndMessagesByDay.isoDate)}
    </div>
    {#each transactionsAndMessagesByDay.transactionsAndMessages as transactionOrMessage}
      <ChatTransaction {transactionOrMessage} />
    {/each}
    <div class="scroll-anchor" />
  {/each}
</div>

<style lang="scss">
  @import "../../../mixins.scss";

  .transaction-history {
    overflow-y: scroll;
    padding: 2px;

    gap: 8px;
    color: white;
    font-size: 40px;
    font-weight: 600;

    // Extra padding since the bottom area sits on top of the last message
    padding-bottom: 64px;
  }

  .day {
    color: var(--dark-grey);
    font-size: 12px;
  }

  // See https://css-tricks.com/books/greatest-css-tricks/pin-scrolling-to-bottom/
  .transaction-history * {
    overflow-anchor: none;
  }

  .scroll-anchor {
    overflow-anchor: auto;
    height: 1px;
  }
</style>
