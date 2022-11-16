<script lang="ts">
  import { transactionsStore } from "../../lib/stores";
  import TransactionComponent from "./Transaction.svelte";
  import { amountAndDecimalsToMajorAndMinor } from "../../lib/utils";
  import {
    getTransactionsByDays,
    isoDateToFriendlyName,
  } from "../../backend/transactions";
  import { Currency } from "../../lib/types";
  import type { TransactionsByDay } from "../../lib/types";
  import { stringify } from "../../backend/functions";
  import SkeletonTransactions from "../Shared/Skeletons/SkeletonTransactions.svelte";

  let transactionsByDays: Array<TransactionsByDay>;

  transactionsStore.subscribe((newValue) => {
    if (newValue) {
      transactionsByDays = getTransactionsByDays(newValue, Currency.USDC);
    }
  });
</script>

{#if false}
  <div class="days">
    {#each transactionsByDays as transactionsByDay}
      <div class="day">
        <div class="day-summary">
          <div class="day-name">
            {isoDateToFriendlyName(transactionsByDay.isoDate)}
          </div>

          <div class="day-total">
            <!-- TODO: clean up this code -->
            {amountAndDecimalsToMajorAndMinor(
              String(transactionsByDay.total),
              6
            )[0]}.{amountAndDecimalsToMajorAndMinor(
              String(transactionsByDay.total),
              6
            )[1]}
          </div>
        </div>

        <div class="transactions">
          {#each transactionsByDay.transactions as transaction}
            <TransactionComponent {transaction} />
          {/each}
        </div>
      </div>
    {/each}
  </div>
  {#if !transactionsByDays.length}
    <p>No transactions</p>
  {/if}
{:else}
  <div class="days mock-days">
    <SkeletonTransactions />
  </div>
{/if}

<style>
  .transactions {
    display: grid;
    grid-auto-flow: row;
    gap: 6px;
  }

  .days {
    align-content: start;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .mock-days {
    min-height: 400px;
  }

  .day {
    padding: 12px;
    gap: 6px;
    /* 24px for the heading line, auto for rest */
    grid-template-rows: 24px auto;
    align-content: start;
  }

  .day-summary {
    grid-auto-flow: column;
    grid-template-columns: 3fr 1fr;
  }

  .day-name {
    text-align: left;
    /* 16px can't quite fit 'Wednesday October 12' */
    font-size: 14px;
    text-transform: uppercase;
    font-weight: 600;
    color: #7d7d7d;
  }

  .day-total {
    text-align: right;
    font-size: 16px;
    text-transform: uppercase;
    font-weight: 600;
    color: #7d7d7d;
  }
</style>
