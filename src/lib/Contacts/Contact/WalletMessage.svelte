<script lang="ts">
  import { log, stringify } from "../../../backend/functions";
  import { Direction, type SimpleWalletMessage } from "../../../backend/types";

  export let message: SimpleWalletMessage;
</script>

<div
  class="transaction {message.direction === Direction.recieved
    ? 'received'
    : 'sent'}"
>
  <div class="memo">{message.memo}</div>
</div>

<style lang="scss">
  @import "../../../mixins.scss";

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
