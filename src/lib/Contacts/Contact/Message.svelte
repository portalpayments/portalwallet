<script lang="ts">
  import {
    getFormattedMajorUnits,
    getFormattedMinorUnits,
    amountAndDecimalsToMajorAndMinor,
  } from "../../utils";
  import { log, stringify, toLocalTime } from "../../../backend/functions";
  import { getCurrencyByMint } from "../../../backend/constants";
  import {
    Direction,
    type SimpleTransaction,
    type SimpleWalletMessage,
  } from "../../../backend/types";

  export let transactionOrMessage: SimpleTransaction | SimpleWalletMessage;

  let transactionOrMessageType: "message" | "transaction" =
    transactionOrMessage.id.includes("dialect") ? "message" : "transaction";

  let currency;
  let major;
  let minor;

  if (transactionOrMessageType === "transaction") {
    const transaction = transactionOrMessage as SimpleTransaction;
    currency = getCurrencyByMint(transaction.currency);

    [major, minor] = amountAndDecimalsToMajorAndMinor(
      transaction.amount,
      currency.decimals
    );
  }
</script>

<div
  class="transaction-or-message {transactionOrMessage.id} {transactionOrMessage.direction ===
  Direction.recieved
    ? 'received'
    : 'sent'}"
>
  {#if transactionOrMessageType === "transaction"}
    <div class="logo-and-amount">
      <img
        src={currency.logo}
        class="icon {transactionOrMessage.direction === Direction.recieved
          ? ''
          : 'white-logo'}"
        alt="{currency.symbol} logo"
      />
      <div class="amount">
        <span class="major">{major}</span><span class="minor">.{minor}</span>
      </div>
    </div>
  {/if}
  <div class="memo">{transactionOrMessage.memo}</div>
  <div class="time">{toLocalTime(transactionOrMessage.date)}</div>
</div>

<style lang="scss">
  @import "../../../mixins.scss";

  .transaction-or-message {
    // See https://css-tricks.com/books/greatest-css-tricks/pin-scrolling-to-bottom/
    overflow-anchor: none;

    // Needed to absolutely position .time below
    position: relative;
    padding: 12px 18px 24px 18px;
    border-radius: 27px;
    align-items: center;
    gap: 5px;
    display: grid;
    justify-content: start;
    grid-auto-flow: row;
    min-width: 76px;
    max-width: 200px;
  }
  .received {
    position: relative;
    background-color: var(--light-grey);
    color: var(--black);
    justify-self: start;
    @include grey-shadow;
  }

  /* The little bump on the speech bubbles */
  .received::before {
    transform: translateY(-13px) translateX(-2px) rotate(155deg);
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: 100%;
    left: 0;
    border: 10px solid transparent;
    border-bottom: none;
    border-top-color: var(--light-grey);
    @include grey-shadow;
  }
  .sent {
    position: relative;
    justify-self: end;
    background-color: var(--mid-blue);
    @include shadow;
  }

  /* The little bump on the speech bubbles */
  .sent::before {
    transform: translateY(-13px) translateX(3px) rotate(65deg);
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: 100%;
    right: 0;
    border: 10px solid transparent;
    border-bottom: none;
    border-top-color: var(--mid-blue);
    @include shadow;
  }

  .logo-and-amount {
    grid-auto-flow: column;
    justify-content: start;
    align-items: baseline;
    padding: 0;
    gap: 6px;
  }

  .icon {
    width: 36px;
    transform: translateY(3px);
  }

  /* Make a white version of the icon so it looks good against a blue background */
  .icon.white-logo {
    filter: brightness(0) invert(1);
  }

  .amount {
    display: block;
    font-kerning: normal;
    letter-spacing: -0.03em;
  }

  .minor {
    font-size: 24px;
  }

  .memo {
    text-align: left;
    font-size: 11px;
    line-height: 13px;
  }

  .time {
    height: 12px;
    position: absolute;
    font-size: 10px;
    right: 18px;
    bottom: 12px;
    font-weight: 400;
  }

  textarea {
    font-size: 12px;
  }
</style>
