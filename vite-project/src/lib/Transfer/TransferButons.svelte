<script lang="ts">
  export let isAnonymous: boolean = false;

  export let requestVerificationClicked: boolean = false;
  export let sendAnywayClicked: boolean = false;
  export let sendClicked: boolean = false;
</script>

<div class="buttonContainer">
  {#if !isAnonymous}
    <button class="send">Send</button>
  {:else}
    <button class="request-verification">Request verification</button>
    <button class="send-anyway">Send anyway</button>
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
