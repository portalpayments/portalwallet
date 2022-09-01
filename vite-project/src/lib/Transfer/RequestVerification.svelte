<script lang="ts">
  import SuccessfulAction from "../../assets/SuccessfulAction.svg";
  let emailAddress: string | null = null;
  import { log, sleep } from "../../../../src/functions";
  import { SECOND } from "../../../../src/constants";
  export let destinationWalletAddress: string | null;
  export let transferAmount: number | null;
  let isRequestVerificationEmailSentSuccessfully = false;
  export let isPending = false;

  const sendVerificationEmail = async () => {
    if (emailAddress != "" || emailAddress != null) {
      log("sending an email to " + emailAddress);
      log("request verification was clicked");
      log(
        "wallet Address: " +
          destinationWalletAddress +
          " wants to send you " +
          transferAmount +
          " money"
      );
      await sleep(1 * SECOND);
      isRequestVerificationEmailSentSuccessfully = true;
      isPending = true;
    } else {
      log("Input a valid email address");
    }
  };
</script>

{#if !isRequestVerificationEmailSentSuccessfully}
  <div class="emailAddressContainer">
    <input bind:value={emailAddress} type="email" required />
    <span class="floating-label">Recipient email address</span>
    <button on:click={sendVerificationEmail} class="request-verification"
      >Request verification</button
    >
  </div>
{:else if isRequestVerificationEmailSentSuccessfully}
  <div class="emailSent">
    <img src={SuccessfulAction} alt="email was sent successfully" />
    <div>
      A verification request has been sent successfully. We will notify you once
      the address is verified.
    </div>
  </div>
{/if}

<style>
  button {
    width: 100%;
    padding: 10px 0px;
    margin: auto;
    color: #fff;
    font-weight: 600;
    font-size: 1.1rem;
  }
  .emailSent {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 1fr 1fr;
    justify-content: center;
    align-items: center;
    color: #9d9d9d;
  }

  img {
    width: 60px;
    justify-self: center;
    align-self: center;
  }
  .request-verification {
    background-color: #2775c9;
  }
  input {
    border-radius: 9px;
    padding: 10px 0px 0px 10px;
    border: 1px solid rgba(217, 217, 217, 0.3);
    background-color: rgba(217, 217, 217, 0.3);
    font-size: 14px;
    width: 200px;
    height: 35px;
    font-size: 1.1rem;
    color: #4d4d4d;
    font-weight: 600;
  }

  input:focus {
    outline: none !important;
    border: 2px solid rgba(65, 156, 253, 0.8);
    box-shadow: 0 0 2px rgba(65, 156, 253, 0.3);
  }
  input:focus ~ .floating-label,
  input:not(:focus):valid ~ .floating-label {
    top: -1px;
    font-size: 0.7rem;
    opacity: 1;
  }

  .floating-label {
    position: absolute;
    pointer-events: none;
    color: #9d9d9d;
    left: 15px;
    top: 10px;
    transition: 0.2s ease all;
    font-size: 1rem;
  }
  .emailAddressContainer {
    position: relative;
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 1fr 1fr;
    justify-content: center;
    align-items: center;
    gap: 30px;
  }
</style>
