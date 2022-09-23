<script lang="ts">
  import { transactionsStore } from "../../lib/stores";
  import TransactionComponent from "./Transaction.svelte";
  import type { TransactionSummary } from "../../lib/types";
  import { Currency } from "../../lib/types";
  import { stringify } from "../../backend/functions";

  let transactions: Array<TransactionSummary> | null = null;

  transactionsStore.subscribe((newValue) => {
    transactions = newValue;
  });
</script>

<div class="transactions">
  {#if transactions}
    {#each transactions as transaction}
      {#if transaction.currency === Currency.USDC}
        <TransactionComponent {transaction} />
      {/if}
    {/each}
    {#if !transactions.length}
      <p>No transactions</p>
    {/if}
  {:else}
    <p>Loading...</p>
  {/if}
</div>

<style>
  .transactions {
    display: grid;
    grid-auto-flow: row;
    grid-auto-rows: 48px;
    padding: 0 12px;
    gap: 6px;
    overflow: hidden;
  }
</style>
