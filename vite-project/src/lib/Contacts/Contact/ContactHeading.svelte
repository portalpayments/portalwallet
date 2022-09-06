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
    grid-template-columns: 30px 60px 1fr;
    gap: 10px;
    justify-content: center;
    align-items: center;
    height: 80px;
    width: 100%;
    margin-top: 10px;
    border-bottom: 1px solid #d9d9d9;
  }
</style>
