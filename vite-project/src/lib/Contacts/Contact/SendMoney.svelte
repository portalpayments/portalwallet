<script lang="ts">
  import {
    warningUnverifiedAccount,
    NUMBERS_OPTIONAL_DECIMAL_PLACE_TWO_NUMBERS,
  } from "../../constants";
  import type { Contact, Transaction } from "../../../lib/types";
  import { log, stringify } from "../../../../../src/functions";
  export let sendAmount;

  export let contact: Contact | null = null;
  export let transactions;

  // TODO replace the following code with a backend function sending money to recipient
  // And reload the transaction history to show the latest transaction
  const sendMoney = () => {
    if (contact.walletAddress && sendAmount > 0) {
      log("Sending amount " + sendAmount + " To " + contact.walletAddress);
      const now = new Date().valueOf();
      transactions.push({
        date: now,
        amount: sendAmount,
        isReceived: false,
      });

      sendAmount = null;
      transactions = transactions;
    }
  };
</script>

<div class="send-money">
  <input
    type="text"
    pattern={NUMBERS_OPTIONAL_DECIMAL_PLACE_TWO_NUMBERS}
    bind:value={sendAmount}
  />

  <button
    type="submit"
    disabled={sendAmount === 0 || sendAmount === null}
    class={sendAmount === 0 || sendAmount === null ? "disabled" : ""}
    on:click={sendMoney}>send</button
  >
</div>

<style>
  .send-money {
    margin-bottom: 10px;
    height: 40px;
  }
  input {
    border-radius: 9px;
    padding: 0px 0px 0px 6px;
    border: 1px solid rgba(217, 217, 217, 0.7);
    background-color: rgba(217, 217, 217, 0.1);
    width: 45%;
    height: 38px;
    font-size: 1.1rem;
    color: #4d4d4d;
    font-weight: 600;
  }
  input:focus {
    outline: none !important;
    border: 2px solid rgba(65, 156, 253, 0.8);
    box-shadow: 0 0 2px rgba(65, 156, 253, 0.3);
  }
  button {
    width: 45%;
    padding: 0px 0px;
    margin: auto;
    height: 38px;
    color: #fff;
    font-weight: 600;
    font-size: 1.1rem;
    background-color: #419cfd;
  }

  .disabled {
    background-color: #98caff;
  }
</style>
