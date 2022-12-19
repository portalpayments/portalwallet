<script lang="ts">
  import type { Contact } from "../types";
  import Unverified from "./Unverified.svelte";
  import Verified from "./Verified.svelte";

  export let contact: Contact;
</script>

<div class="contact">
  {#if contact}
    {#if contact.verifiedClaims}
      <Verified {contact} />
    {:else}
      <Unverified {contact} />
    {/if}
  {:else}
    Loading...
  {/if}
</div>

<style type="text/scss">
  .contact {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 64px 1fr;
    gap: 6px;
    justify-content: center;
    align-items: center;
    height: 80px;
    width: 100%;
    box-sizing: border-box;
  }
</style>
