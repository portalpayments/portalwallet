<script lang="ts">
  import BackButton from "../Shared/BackButton.svelte";
  import Unverified from "../Shared/Unverified.svelte";
  import Verified from "../Shared/Verified.svelte";
  import { warningUnverifiedAccount } from "../constants";
  import type { Contact } from "../../lib/types";
  import { isEmpty } from "../../../../src/functions";

  export let contact: Contact;
  export let hasLoadedVerificationStateFromNetwork: boolean = false;
</script>

<div class="back-heading-and-recipient-details">
  <BackButton />
  <div class="heading-and-recipient-details">
    <h1>Transfer</h1>
    {#if hasLoadedVerificationStateFromNetwork}
      <div class="verification-status">
        <div class="verified-header">
          {#if isEmpty(contact.verifiedClaims)}
            <Unverified {contact} />
          {:else}
            <Verified {contact} />
          {/if}
        </div>
        {#if isEmpty(contact.verifiedClaims)}
          <div class="unverified-message">{warningUnverifiedAccount}</div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .back-heading-and-recipient-details {
    display: grid;
    grid-auto-flow: column;
    /* Back button, main heading */
    grid-template-columns: 24px 1fr;
    width: 100%;
    height: 150px;
    justify-content: center;
    align-items: baseline;
  }

  .heading-and-recipient-details {
    display: grid;
    grid-auto-flow: row;
  }

  h1 {
    font-size: 24px;
    /* Center, despite back button */
    transform: translateX(-12px);
  }

  .verification-status {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 64px 1fr;
    padding: 6px 6px;
    gap: 12px;
    margin: auto;
    justify-content: stretch;
    align-items: start;
    text-align: left;
  }

  .verified-header {
    font-size: 1.1rem;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 64px 1fr;
    justify-content: center;
    align-items: center;
    gap: 12px;
    height: 64px;
    color: #4d4d4d;
    font-weight: 600;
  }

  .unverified-message {
    font-size: 0.8rem;
    line-height: 130%;
    color: #4d4d4d;
    font-weight: 500;
  }
</style>
