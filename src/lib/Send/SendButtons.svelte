<script lang="ts">
  import { log } from "../../backend/functions";
  export let isAnonymous = false;
  export let isAskingWalletOwnerToGetVerified = false;
  export let sendAnywayClicked = false;
  export let isSending = false;
  export let isSendButtonDisabled = true;

  export let destinationWalletAddress: string | null;
  export let transferAmount: number | null;

  const sendToVerifiedAddress = () => {
    log(
      `Sending to: destinationWalletAddress: ${destinationWalletAddress} and transferAmount: ${transferAmount}`
    );

    isSending = true;
  };

  const sendToUnverifiedAddress = () => {
    log("send anyway was clicked");
    log(
      `destinationWalletAddress: ${destinationWalletAddress} and transferAmount: ${transferAmount}`
    );
    sendAnywayClicked = true;
  };

  const requestVerificationModal = () => {
    isAskingWalletOwnerToGetVerified = true;
  };
</script>

<div class="buttons">
  <!-- Don't bother showing anything until there's a destination wallet address -->
  {#if destinationWalletAddress}
    {#if !isAnonymous}
      <button
        class={isSendButtonDisabled ? "disabled" : "send"}
        on:click={sendToVerifiedAddress}
        disabled={isSendButtonDisabled}
      >
        Send
      </button>
    {:else}
      <button on:click={requestVerificationModal} class="request-verification">
        Request verification
      </button>

      <button on:click={sendToUnverifiedAddress} class="send-anyway">
        Send anyway
      </button>
    {/if}
  {/if}
</div>

<style>
  .buttons {
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
    border-radius: 24px;
  }

  .disabled {
    background-color: #63a6ee;
  }

  .request-verification {
    background: linear-gradient(45deg, var(--mid-blue), var(--bright-green));
  }
  .send-anyway {
    background-color: #9d9d9d;
  }
  .send {
    background: linear-gradient(45deg, var(--mid-blue), var(--bright-green));
  }
</style>
