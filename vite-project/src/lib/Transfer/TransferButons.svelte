<script lang="ts">
  export let isAnonymous: boolean = false;

  export let requestVerificationClicked: boolean = false;
  export let sendAnywayClicked: boolean = false;
  export let sendClicked: boolean = false;
  export let sendButtonDisabled: boolean = true;

  const sendToVerifiedAddress = () => {
    console.log("send was clicked");
  };

  const sendToUnverifiedAddress = () => {
    console.log("send anyway was clicked");
  };

  const requestVerification = () => {
    console.log("request verification was clicked");
  };
</script>

<div class="buttonContainer">
  {#if !isAnonymous}
    <button
      class="send"
      on:click={sendToVerifiedAddress}
      disabled={sendButtonDisabled}>Send</button
    >
  {:else}
    <button on:click={sendToUnverifiedAddress} class="request-verification"
      >Request verification</button
    >
    <button on:click={requestVerification} class="send-anyway"
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
