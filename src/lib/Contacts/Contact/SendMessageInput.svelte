<script lang="ts">
  import { NUMBERS_OPTIONAL_DECIMAL_PLACE_TWO_NUMBERS } from "../../frontend-constants";
  import { EMPTY } from "../../../backend/constants";
  import type { Contact } from "../../../backend/types";
  import type { Thread } from "@dialectlabs/sdk";
  import Input from "../../Shared/Input.svelte";
  import { log, stringify } from "../../../backend/functions";
  import FocusContext from "../../Shared/FocusContext.svelte";
  import { sendDialectMessage } from "../../../backend/messaging";
  import UpArrow from "../../../assets/up-arrow.svg";
  export let thread: Thread | null = null;

  let messageOrAmountText = "";

  // TODO replace the following code with a backend function sending money to recipient
  // And reload the transaction history to show the latest transaction
  const sendMessageOrMoney = () => {
    log(`Sending message`);
    sendDialectMessage(thread, messageOrAmountText);
    messageOrAmountText = EMPTY;
    // TODO: send money
  };
</script>

<FocusContext>
  <Input
    bind:value={messageOrAmountText}
    isAmount={false}
    isFocused={true}
    label="Message..."
    onTypingPause={() => {
      log(`User finished typing`);
    }}
    hasButton={true}
    onButtonSubmit={sendMessageOrMoney}
  >
    <img class="up-arrow" src={UpArrow} alt="send" />
  </Input>
</FocusContext>

<style lang="scss">
  @import "../../../mixins.scss";

  .up-arrow {
    height: 22px;
  }
</style>
