<script lang="ts">
  import {
    getFormattedMajorUnits,
    getFormattedMinorUnits,
    amountAndDecimalsToMajorAndMinor,
  } from "../../utils";
  import { log, stringify } from "../../../backend/functions";
  import { getCurrencyByMint } from "../../../backend/constants";
  import { Direction, type SimpleTransaction } from "../../../backend/types";

  export let transaction: SimpleTransaction;

  const currency = getCurrencyByMint(transaction.currency);

  const [major, minor] = amountAndDecimalsToMajorAndMinor(
    transaction.amount,
    currency.decimals
  );
</script>

<div
  class="transaction {transaction.direction === Direction.recieved
    ? 'received'
    : 'sent'}"
>
  <textarea class="debug">{stringify(transaction)}</textarea>
  <div class="logo-and-amount">
    <img
      src={currency.logo}
      class={transaction.direction === Direction.recieved ? "" : "white-logo"}
      alt="{currency.symbol} logo"
    />
    <div class="amount">
      <span class="major">{major}</span>.<span class="minor">{minor}</span>
    </div>
  </div>
  <div class="memo">{transaction.memo}</div>
</div>

<style>
  img {
    width: 36px;
  }

  /* Make a white version of the icon so it looks good against a blue background */
  .white-logo {
    filter: brightness(0) invert(1);
  }

  .transaction {
    padding: 12px 24px;
    border-radius: 27px;
    align-items: center;
    gap: 5px;
    display: grid;
    justify-content: center;
    grid-auto-flow: row;
  }
  .received {
    position: relative;
    background-color: var(--light-grey);
    color: var(--mid-blue);
    justify-self: start;
  }

  /* The little bump on the speech bubbles */
  .received::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: 100%;
    left: 0.6em;
    border: 0.6rem solid transparent;
    border-bottom: none;
    border-top-color: var(--light-grey);
  }
  .sent {
    position: relative;
    justify-self: end;
    background-color: var(--mid-blue);
  }

  /* The little bump on the speech bubbles */

  .sent::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: 100%;
    left: 2.1em;
    border: 0.6rem solid transparent;
    border-bottom: none;
    border-top-color: var(--mid-blue);
  }

  .logo-and-amount {
    grid-auto-flow: column;
    /* icon then rest is amount */
    grid-template-columns: 32px 1fr;
  }

  .amount {
    display: block;
    /* grid-auto-flow: column;
    grid-template-columns: repeat(auto-fit); */
  }

  .amount * {
    display: inline;
  }

  .minor {
    font-size: 24px;
  }

  .memo {
    font-size: 11px;
    line-height: 13px;
  }
</style>
