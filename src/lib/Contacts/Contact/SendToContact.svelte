<script lang="ts">
  import { NUMBERS_OPTIONAL_DECIMAL_PLACE_TWO_NUMBERS } from "../../constants";
  import type { Contact } from "../../types";
  import { log, stringify } from "../../../backend/functions";

  let sendAmount;

  export let contact: Contact | null = null;

  // TODO replace the following code with a backend function sending money to recipient
  // And reload the transaction history to show the latest transaction
  const sendMoney = () => {
    if (contact.walletAddress && sendAmount > 0) {
      log("Sending amount " + sendAmount + " To " + contact.walletAddress);
      throw new Error(`Not implemented`);
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

  button {
    width: 45%;
    padding: 0px 0px;
    margin: auto;
    height: 38px;
    color: #fff;
    font-weight: 600;
    font-size: 1.1rem;
    background-color: var(--mid-blue);
  }

  .disabled {
    background-color: #98caff;
  }
</style>
