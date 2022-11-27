<script lang="ts">
  import { activeAccountIndexStore, getActiveAccount } from "../../lib/stores";
  import TransactionComponent from "./Transaction.svelte";
  import { amountAndDecimalsToMajorAndMinor } from "../../lib/utils";
  import { get as getFromStore } from "svelte/store";
  import {
    getTransactionsByDays,
    isoDateToFriendlyName,
  } from "../../backend/transactions";
  import { Currency } from "../../lib/types";
  import type {
    TransactionSummary,
    TransactionsByDay,
    AccountSummary,
  } from "../../lib/types";
  import { log, stringify } from "../../backend/functions";
  import SkeletonTransactions from "../Shared/Skeletons/SkeletonTransactions.svelte";

  let transactionsByDays: Array<TransactionsByDay> = [];
  let decimals: number;
  let isLoadingTransactionSummaries: boolean = true;

  // TODO: maybe move transactionsByDays to the store?
  activeAccountIndexStore.subscribe((newValue) => {
    log(`Active account has changed, updating balance...`);
    if (newValue !== null) {
      const activeAccount = getActiveAccount();
      log(
        `Setting transactionsByDays, based on ${activeAccount.transactionSummaries.length} transactionSummaries `
      );

      transactionsByDays = getTransactionsByDays(
        activeAccount.transactionSummaries
      );
      decimals = activeAccount.decimals;

      isLoadingTransactionSummaries = false;
    }
  });
</script>

{#if transactionsByDays}
  {#if !isLoadingTransactionSummaries}
    <div class="days">
      {#each transactionsByDays as transactionsByDay}
        <div class="day">
          <div class="day-summary">
            <div class="day-name">
              {isoDateToFriendlyName(transactionsByDay.isoDate)}
            </div>

            <div class="day-total">
              {amountAndDecimalsToMajorAndMinor(
                transactionsByDay.totalSpending,
                decimals
              )[0]}.{amountAndDecimalsToMajorAndMinor(
                transactionsByDay.totalSpending,
                decimals
              )[1]}
            </div>
          </div>

          <div class="transactions">
            {#each transactionsByDay.transactions as transaction}
              <TransactionComponent {transaction} {decimals} />
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
