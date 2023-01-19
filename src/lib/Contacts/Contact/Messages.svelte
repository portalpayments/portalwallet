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
  } from "../../../backend/functions";

  export let transactionsAndMessages: Array<
    SimpleTransaction | SimpleWalletMessage
  >;

  let transactionsAndMessagesByDays: Array<{
    isoDate: string;
    transactionsAndMessages: Array<SimpleTransaction | SimpleWalletMessage>;
  }> = [];

  transactionsAndMessages.sort(byDateNewestToOldest);

  transactionsAndMessages.forEach((transactionOrMessage) => {
    const isoDate = dateToISODate(transactionOrMessage.date);
    const lastDay = transactionsAndMessagesByDays.at(-1) || null;
    if (lastDay?.isoDate === isoDate) {
      // Add this transaction to the existing entry for this day
      lastDay.transactionsAndMessages.push(transactionOrMessage);
    } else {
      // Create a new item for this day
      transactionsAndMessagesByDays.push({
        isoDate,
        transactionsAndMessages,
      });
    }
  });
</script>

<div class="history-container">
  <div class="transaction-history">
    {#each transactionsAndMessagesByDays.reverse() as transactionsAndMessagesByDay}
      <div class="day">{transactionsAndMessagesByDay.isoDate}</div>
      {#each transactionsAndMessagesByDay.transactionsAndMessages as transactionOrMessage}
        <ChatTransaction {transactionOrMessage} />
      {/each}
    {/each}
  </div>
</div>

<style lang="scss">
  @import "../../../mixins.scss";

  /* TODO cannot scroll */
  .history-container {
    overflow-y: scroll;
  }
  .transaction-history {
    gap: 8px;
    color: white;
    font-size: 40px;
    font-weight: 600;

    // cool kids

    scroll-snap-type: y proximity;
  }

  .day {
    color: var(--black);
    font-size: 10px;
    @include small-caps;
  }
</style>
