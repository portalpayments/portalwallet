<script lang="ts">
  export let isVerified: boolean = true;
</script>

<div class="buttonContainer">
  {#if !isVerified}
    <button class="request-verification">Request verification</button>
    <button class="send-anyway">Send anyway</button>
  {:else}
    <button class="send">Send</button>
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
