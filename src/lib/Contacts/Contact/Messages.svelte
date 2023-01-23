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
  import Chevron from "../../../assets/chevron.svg";

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
  <button
    type="button"
    class="go-to-bottom"
    disabled={isAtBottom}
    on:click={goToBottom}
  >
    <img src={Chevron} alt="go to bottom" />
  </button>
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
    display: grid;
    justify-items: center;
    align-items: center;
    height: 40px;
    width: 40px;
    right: 12px;
    bottom: 68px;
    border-radius: 50%;
    border: 3px solid var(--mid-blue);
    background-color: white;

    animation: fadeIn 1s forwards;

    @include grey-shadow;
  }

  .go-to-bottom img {
    width: 24px;
    // TODO: remove this hack, think Figma export needs fixing
    transform: translateX(-1px) translateY(2px);
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
