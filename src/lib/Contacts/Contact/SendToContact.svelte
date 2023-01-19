<script lang="ts">
  import { NUMBERS_OPTIONAL_DECIMAL_PLACE_TWO_NUMBERS } from "../../constants";
  import type { Contact } from "../../../backend/types";
  import Input from "../../Shared/Input.svelte";
  import { log, stringify } from "../../../backend/functions";
  import FocusContext from "../../Shared/FocusContext.svelte";
  export let contact: Contact | null = null;

  let messageOrAmountText = "";

  // TODO replace the following code with a backend function sending money to recipient
  // And reload the transaction history to show the latest transaction
  const sendMessage = () => {
    if (contact.walletAddress && Number(messageOrAmountText) > 0) {
      log(
        "Sending amount " + messageOrAmountText + " To " + contact.walletAddress
      );
      throw new Error(`Not implemented`);
    }
  };
</script>

<div class="send-money">
  <FocusContext>
    <Input
      value={messageOrAmountText}
      isAmount={false}
      isFocused={true}
      label="Message or amount"
      onTypingPause={() => {
        log(`User finished typing`);
      }}
    />

    <button
      type="submit"
      disabled={messageOrAmountText.length === 0}
      class={messageOrAmountText.length === 0 ? "disabled" : ""}
      on:click={sendMessage}>▴</button
    >
  </FocusContext>
</div>

<style lang="scss">
  .send-money {
    height: 48px;
    grid-auto-flow: column;
    grid-template-columns: 1fr 48px;
    gap: 2px;
  }

  button {
    width: 48px;
    padding: 0px 0px;
    margin: auto;
    height: 38px;
    color: #fff;
    font-weight: 600;
    font-size: 1.1rem;
    background-color: var(--mid-blue);
  }

  .disabled {
    color: white;
    border-radius: 24px;
    background: var(--blue-green-gradient);
  }
</style>
