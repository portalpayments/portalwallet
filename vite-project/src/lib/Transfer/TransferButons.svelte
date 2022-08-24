<script type="ts">
  export let isAnonymous = false;
  export let requestVerificationClicked = false;
  export let sendAnywayClicked = false;
  export let sendClicked = false;
  export let sendButtonDisabled = true;

  export let destinationWalletAddress: string | null;
  export let transferAmount: number | null;

  const sendToVerifiedAddress = () => {
    console.log(
      "wallet Address: " +
        destinationWalletAddress +
        " and amount is " +
        transferAmount
    );
    sendClicked = true;
  };

  const sendToUnverifiedAddress = () => {
    console.log("send anyway was clicked");
    console.log(
      "wallet Address: " +
        destinationWalletAddress +
        " and amount is " +
        transferAmount
    );
    sendAnywayClicked = true;
  };

  const requestVerification = () => {
    console.log("request verification was clicked");
    console.log(
      "wallet Address: " +
        destinationWalletAddress +
        " wants to send you " +
        transferAmount +
        " money"
    );
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
    <button on:click={requestVerification} class="request-verification"
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
