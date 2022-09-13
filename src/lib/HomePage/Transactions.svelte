<script lang="ts">
  import { transactionsStore } from "../../lib/stores";
  import TransactionComponent from "./Transaction.svelte";
  import type { Transaction } from "../../lib/types";

  let transactions: Array<Transaction> = [];

  transactionsStore.subscribe((newValue) => {
    transactions = newValue;
  });
</script>

<div class="transactions">
  {#each transactions as transaction}
    <TransactionComponent {transaction} />
  {/each}
</div>

<style>
  :root {
    --bright-green: #33b275;
  }
  .transactions {
    display: grid;
    grid-auto-flow: row;
    grid-auto-rows: 48px;
    padding: 0 12px;
    gap: 6px;
    height: auto;
    max-height: 300px;
    overflow: hidden;
  }
</style>
