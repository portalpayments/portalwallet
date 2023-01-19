<script lang="ts">
  import type { SimpleTransaction } from "../../../backend/types";
  import ChatTransaction from "./ChatTransaction.svelte";

  export let transactions: Array<SimpleTransaction>;
</script>

<div class="history-container">
  <div class="transaction-history">
    {#each transactions as transaction}
      <ChatTransaction {transaction} />
    {/each}
  </div>
</div>

<style lang="scss">
  /* TODO cannot scroll */
  .history-container {
    overflow-y: scroll;
  }
  .transaction-history {
    gap: 8px;
    color: white;
    font-size: 40px;
    font-weight: 600;
  }
</style>
