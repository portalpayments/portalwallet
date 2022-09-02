<script lang="ts">
  import BackButton from "../Shared/BackButton.svelte";
  import Unverified from "../Shared/Unverified.svelte";
  import Verified from "../Shared/Verified.svelte";
  import { warningUnverifiedAccount } from "../constants";
  import type { VerifiedClaims } from "../../../../src/types";
  import type { Contact } from "../../lib/types";

  export let contact: Contact;
  export let hasLoadedVerificationStateFromNetwork: boolean = false;
</script>

<div class="recipientDetails">
  <BackButton />
  {#if hasLoadedVerificationStateFromNetwork}
    <div class="verification-status">
      <div class="verified-header">
        {#if contact.verifiedClaims.type}
          <Verified {contact} />
        {:else}
          <Unverified {contact} />
        {/if}
      </div>
      <!-- {#if !verifiedClaims?.type}
        <div class="unverified-message">{warningUnverifiedAccount}</div>
      {/if} -->
    </div>
  {:else}
    Loading...
  {/if}
</div>

<style>
  .recipientDetails {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 12px 1fr;
    width: 100%;
    height: 150px;
    justify-content: center;
    align-items: baseline;
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
