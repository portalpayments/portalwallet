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
    height: 100%;
    position: relative;
    width: 100%;
    overflow-y: scroll;
  }
  .transaction-history {
    display: grid;
    width: 100%;
    grid-auto-flow: row;
    /* TODO weird just use padding */
    grid-template-columns: 95%;
    grid-auto-rows: 120px;
    gap: 0px;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 40px;
    font-weight: 600;
    position: absolute;
    overflow: hidden;
    bottom: 0px;
  }
</style>
