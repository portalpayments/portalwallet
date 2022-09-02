<script lang="ts">
  import BackButton from "../../Shared/BackButton.svelte";
  import { log, stringify } from "../../../../../src/functions";
  import type { Contact } from "../../types";
  import type { verifiedClaims } from "../../../../../src/types";
  import Unverified from "../../Shared/Unverified.svelte";
  import Verified from "../../Shared/Verified.svelte";

  export let contact: Contact;
  export let verifiedClaims: verifiedClaims | null;

  const walletAddress = contact.walletAddress;

  // If someone is in contacts we don't consider them new
  const isNew = false;

  log(`verifiedClaims is`, stringify(verifiedClaims));
</script>

<div class="heading">
  <BackButton />

  {#if contact}
    {#if verifiedClaims}
      <Unverified {walletAddress} />
    {:else}
      <Verified {verifiedClaims} {isNew} />
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

  .name {
    display: grid;
    grid-auto-flow: row;
    text-align: left;
    font-size: 1.2rem;
    color: #4d4d4d;
    font-weight: 600;
  }

  img {
    width: 55px;
    margin: auto;
  }

  .labels {
    display: grid;
    grid-auto-flow: column;
  }
</style>
