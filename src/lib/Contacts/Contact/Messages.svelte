<script lang="ts">
  import type {
    SimpleTransaction,
    SimpleWalletMessage,
  } from "../../../backend/types";
  import { checkIfScrolledAllTheWay } from "../../dom-utils";
  import Message from "./Message.svelte";
  import {
    log,
    stringify,
    dateToISODate,
    byDateNewestToOldest,
    isoDateToFriendlyName,
  } from "../../../backend/functions";

  export let transactionsAndMessagesByDays: Array<{
    isoDate: string;
    transactionsAndMessages: Array<SimpleTransaction | SimpleWalletMessage>;
  }>;

  let scrollableArea;

  //
  let isAtBottom = scrollableArea;

  const updateGoToBottomButtonVisibility = (event) => {
    isAtBottom = checkIfScrolledAllTheWay(event.target);
  };

  const goToBottom = (event) => {
    log(`Going to bottom`);
    scrollableArea.scrollTop = scrollableArea.scrollHeight;
  };
</script>

<div class="transaction-history">
  <div
    class="scrollable-area"
    bind:this={scrollableArea}
    on:scroll={updateGoToBottomButtonVisibility}
  >
    {#if transactionsAndMessagesByDays?.length}
      {#each transactionsAndMessagesByDays as transactionsAndMessagesByDay}
        <div class="day">
          {isoDateToFriendlyName(transactionsAndMessagesByDay.isoDate)}
        </div>
        {#each transactionsAndMessagesByDay.transactionsAndMessages as transactionOrMessage}
          <Message {transactionOrMessage} />
        {/each}
      {/each}
      <div class="scroll-anchor" />
    {/if}
  </div>
  <button class="go-to-bottom" disabled={isAtBottom} on:click={goToBottom}
    ><img src="" /></button
  >
</div>

<style lang="scss">
  @import "../../../mixins.scss";

  .transaction-history {
    // Explicitly position so go-to-bottom can be positioned absolutely and stay on screen
    position: relative;
    height: 510px;
  }

  .scrollable-area {
    overflow-y: scroll;
    padding: 2px;

    gap: 8px;
    color: white;
    font-size: 40px;
    font-weight: 600;

    // Extra padding since the bottom area sits on top of the last message
    padding-bottom: 64px;
  }

  .go-to-bottom {
    position: absolute;
    height: 64px;
    width: 64px;
    right: 24px;
    bottom: 64px;
    border-radius: 50%;

    animation: fadeIn 1s forwards;

    @include dark-polymer;
  }

  .go-to-bottom:disabled {
    animation: fadeOut 1s forwards;
  }

  .day {
    color: var(--dark-grey);
    font-size: 12px;
  }

  // See https://css-tricks.com/books/greatest-css-tricks/pin-scrolling-to-bottom/
  .day {
    overflow-anchor: none;
  }

  .scroll-anchor {
    overflow-anchor: auto;
    height: 1px;
  }
</style>
