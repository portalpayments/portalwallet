<script lang="ts">
  import { formatUSDCBalanceNumber } from "../../utils";
  import USDClogo from "../../../assets/usdc.svg";
  import { log, stringify } from "../../../../../src/functions";
  import type { Contact, Transaction } from "../../../lib/types";

  export let transactions: Array<Transaction>;
</script>

<div class="history-container">
  <div class="transaction-history">
    {#each transactions as transaction}
      <div
        class={transaction.isReceived
          ? "amount amount-received"
          : "amount amount-sent"}
      >
        <img
          src={USDClogo}
          class={!transaction.isReceived ? "white-usdc" : ""}
          alt="USDC logo"
        />
        <div>{formatUSDCBalanceNumber(transaction.amount)}</div>
      </div>
    {/each}
  </div>
</div>

<style>
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
  img {
    width: 36px;
  }
  .white-usdc {
    filter: brightness(0) invert(1);
  }

  .amount {
    padding: 12px 24px;
    border-radius: 27px;
    align-items: center;
    gap: 5px;
    display: grid;
    justify-content: center;
    grid-auto-flow: column;
  }
  .amount-received {
    position: relative;
    background-color: #d9d9d9;
    color: #2775c9;
    justify-self: start;
  }

  /* The little bump on the speech bubbles */
  .amount-received::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: 100%;
    left: 0.6em;
    border: 0.6rem solid transparent;
    border-bottom: none;
    border-top-color: #d9d9d9;
  }
  .amount-sent {
    position: relative;
    justify-self: end;
    background-color: #419cfd;
  }

  /* The little bump on the speech bubbles */

  .amount-sent::before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: 100%;
    left: 2.1em;
    border: 0.6rem solid transparent;
    border-bottom: none;
    border-top-color: #419cfd;
  }
</style>
