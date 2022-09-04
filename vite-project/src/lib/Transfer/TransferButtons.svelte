<script lang="ts">
  import { log } from "../../../../src/functions";
  export let isAnonymous = false;
  export let requestVerificationClicked = false;
  export let sendAnywayClicked = false;
  export let sendClicked = false;
  export let sendButtonDisabled = true;

  export let destinationWalletAddress: string | null;
  export let transferAmount: number | null;

  const sendToVerifiedAddress = () => {
    log(
      `destinationWalletAddress: ${destinationWalletAddress} and transferAmount: ${transferAmount}`
    );
    sendClicked = true;
  };

  const sendToUnverifiedAddress = () => {
    log("send anyway was clicked");
    log(
      `destinationWalletAddress: ${destinationWalletAddress} and transferAmount: ${transferAmount}`
    );
    sendAnywayClicked = true;
  };

  const requestVerificationModal = () => {
    requestVerificationClicked = true;
  };
</script>

<div class="buttonContainer">
  {#if !isAnonymous}
    <button
      class={sendButtonDisabled ? "disabled" : "send"}
      on:click={sendToVerifiedAddress}
      disabled={sendButtonDisabled}>Send</button
    >
  {:else}
    <button on:click={requestVerificationModal} class="request-verification"
      >Request verification</button
    >

    <button on:click={sendToUnverifiedAddress} class="send-anyway"
      >Send anyway</button
    >
  {/if}
</div>

<style>
  .buttonContainer {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 1fr;
    align-self: start;
    gap: 10px;
  }
  button {
    width: 70%;
    padding: 10px 0px;
    margin: auto;
    color: #fff;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .disabled {
    background-color: #63a6ee;
  }

  .request-verification {
    background-color: #2775c9;
  }
  .send-anyway {
    background-color: #9d9d9d;
  }
  .send {
    background-color: #2775c9;
  }
</style>
