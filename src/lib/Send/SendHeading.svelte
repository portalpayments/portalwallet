<script lang="ts">
  import BackButton from "../Shared/BackButton.svelte";
  import Unverified from "../Shared/Unverified.svelte";
  import Heading from "../Shared/Heading.svelte";
  import Verified from "../Shared/Verified.svelte";
  import Loader from "../Shared/Loader.svelte";
  import type { Contact } from "../../backend/types";
  import { log, stringify } from "../../backend/functions";

  export let contact: Contact;
  export let hasLoadedVerificationStateFromNetwork: boolean = false;
  export let isCurrentlyLoadingVerificationStateFromNetwork: boolean = false;
</script>

<div class="send-heading">
  <BackButton />
  <Heading>Send money</Heading>

  {#if isCurrentlyLoadingVerificationStateFromNetwork}
    <!-- TODO: we should probably use a different component for verifying versus sending -->
    <Loader isComplete={false} />
  {:else if hasLoadedVerificationStateFromNetwork}
    <div class="verification-status">
      <div class="verified-header">
        {#if contact.verifiedClaims}
          <Verified {contact} />
        {:else}
          <Unverified {contact} />
        {/if}
      </div>
      {#if !contact.verifiedClaims}
        <div class="unverified-message">
          Note there is not a guarantee that the wallet name represents a
          particular individual or organisation.
        </div>
      {/if}
    </div>
  {:else}
    <!-- the default state when the user hasn't entered anything -->
    <div class="empty" />
  {/if}
</div>

<style lang="scss">
  .send-heading {
    display: grid;
    grid-auto-flow: row;
    grid-template-columns: 1fr;
    width: 100%;
    height: 150px;
    justify-content: center;
    align-items: baseline;
    padding: 0 24px;
    gap: 12px;
  }

  .verification-status {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 64px 1fr;
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
    color: var(--black);
    font-weight: 600;
  }

  .unverified-message {
    font-size: 0.8rem;
    line-height: 130%;
    color: var(--black);
    font-weight: 500;
    font-style: italic;
  }
</style>
