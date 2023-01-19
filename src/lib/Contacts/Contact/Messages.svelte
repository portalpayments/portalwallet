<script lang="ts">
  import type { SimpleTransaction } from "../../../backend/types";
  import ChatTransaction from "./ChatTransaction.svelte";
  import type { Thread, ThreadMessage } from "@dialectlabs/sdk";
  import { log } from "../../../backend/functions";

  export let transactions: Array<SimpleTransaction>;
  export let thread: Thread | null;

  let messages: Array<ThreadMessage> = [];
  const main = async () => {
    if (thread) {
      messages = await thread.messages();
      log(`There are ${messages.length} messages`);
    }
  };

  main();
</script>

<div class="history-container">
  <div class="transaction-history">
    {#each transactions as transaction}
      <ChatTransaction {transaction} />
    {/each}
    {#each messages as message}
      <p>{message.text}</p>
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
