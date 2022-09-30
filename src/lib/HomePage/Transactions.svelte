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
  import MockTransactionsSvg from "../Shared/MockedSVGs/MockTransactionsSVG.svelte"

  let transactionsByDays: Array<TransactionsByDay>;

  transactionsStore.subscribe((newValue) => {
    if (newValue) {
      transactionsByDays = getTransactionsByDays(newValue, Currency.USDC);
    }
  });
</script>
{#if transactionsByDays}
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
  {#if !transactionsByDays.length}
    <p>No transactions</p>
  {/if}
{:else}
<MockTransactionsSvg />
{/if}

<style>
  .transactions {
    display: grid;
    grid-auto-flow: row;
    gap: 6px;
  }

  .day {
    padding: 12px;
    gap: 6px;
  }

  .day-summary {
    grid-auto-flow: column;
    grid-template-columns: 3fr 1fr;
  }

  .day-name {
    text-align: left;
    font-size: 16px;
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
