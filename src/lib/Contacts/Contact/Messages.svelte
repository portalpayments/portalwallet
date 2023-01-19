<script lang="ts">
  import type {
    SimpleTransaction,
    SimpleWalletMessage,
  } from "../../../backend/types";
  import ChatTransaction from "./ChatTransaction.svelte";
  import WalletMessage from "./WalletMessage.svelte";
  import type { Thread, ThreadMessage } from "@dialectlabs/sdk";
  import { log, stringify } from "../../../backend/functions";

  export let transactions: Array<SimpleTransaction>;
  export let messages: Array<SimpleWalletMessage>;

  const main = async () => {
    log(`About to get new messages`);

    log(`There are ${messages.length} messages`);
  };

  main();
</script>

<div class="history-container">
  <div class="transaction-history">
    {#each transactions as transaction}
      <ChatTransaction {transaction} />
    {/each}
    {#each messages as message}
      <WalletMessage {message} />
    {/each}
    <p>end of messages</p>
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

    // cool kids

    scroll-snap-type: y proximity;
  }
</style>
