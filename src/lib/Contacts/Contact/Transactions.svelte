<script lang="ts">
  import { getFormattedMajorUnits, getFormattedMinorUnits } from "../../utils";
  import USDClogo from "../../../assets/Icons/usdc.svg";
  import { Direction, type TransactionSummary } from "../../../lib/types";

  export let transactions: Array<TransactionSummary>;
</script>

<div class="history-container">
  <div class="transaction-history">
    {#each transactions as transaction}
      <div
        class="amount {transaction.direction === Direction.recieved
          ? 'amount-received'
          : 'amount-sent'}"
      >
        <img
          src={USDClogo}
          class={transaction.direction === Direction.recieved
            ? ""
            : "white-usdc"}
          alt="USDC logo"
        />
        <div>
          <span class="major">{getFormattedMajorUnits(transaction.amount)}</span
          ><span class="minor"
            >{getFormattedMinorUnits(transaction.amount)}</span
          >
        </div>
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

  .major {
  }

  .minor {
    font-size: 24px;
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
    background-color: var(--dark-grey);
    color: var(--mid-blue);
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
    border-top-color: var(--dark-grey);
  }
  .amount-sent {
    position: relative;
    justify-self: end;
    background-color: var(--mid-blue);
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
    border-top-color: var(--mid-blue);
  }
</style>
