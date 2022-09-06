<script lang="ts">
  import BackButton from "../../Shared/BackButton.svelte";
  import { log, stringify } from "../../../../../src/functions";
  import type { Contact } from "../../types";
  import type { VerifiedClaims } from "../../../../../src/types";
  import Unverified from "../../Shared/Unverified.svelte";
  import Verified from "../../Shared/Verified.svelte";

  export let contact: Contact;

  log(`contact is`, stringify(contact));
</script>

<div class="heading">
  <BackButton />

  {#if contact}
    {#if contact.verifiedClaims}
      <Verified {contact} />
    {:else}
      <Unverified {contact} />
    {/if}
  {:else}
    Loading
  {/if}
</div>

<style>
  .heading {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 64px 1fr;
    gap: 12px;
    justify-content: center;
    align-items: center;
    height: 80px;
    width: 100%;
    padding: 12px 24px;
    border-bottom: 1px solid var(--dark-grey);
    box-sizing: border-box;
  }
</style>
