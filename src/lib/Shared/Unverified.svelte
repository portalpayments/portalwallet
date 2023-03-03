<script lang="ts">
  import AnonymousImage from "../../assets/anonymous.svg";
  import Label from "../Shared/Label.svelte";
  import { LabelColor } from "../frontend-constants";
  import type { Contact } from "../../backend/types";
  import { truncateWallet, copyToClipboard } from "../utils";
  import { getGradient } from "../../backend/deterministic-beautiful-gradient";
  import { onMount } from "svelte";

  export let contact: Contact;

  let isNew = false;
  let gradient: string | null = null;

  onMount(async () => {
    gradient = await getGradient(contact.walletAddress);
  });
</script>

{#if contact.profilePictureURL}
  <!-- Solana PFP 'standard' (very few people uses this) -->
  <img
    class="profile-pic individual"
    src={contact.profilePictureURL}
    alt="anonymous wallet avatar"
  />
{:else}
  <!-- Make a gradient from the wallet address -->
  <div class="profile-pic" style={gradient} />
{/if}
<div class="recipient-info">
  <button
    class="truncated-wallet"
    on:click={async () => {
      await copyToClipboard(contact.walletAddress);
    }}>{truncateWallet(contact.walletAddress)}</button
  >
  <div class="badges-and-labels">
    <Label color={LabelColor.Grey}>Unverified</Label>
    {#if isNew}
      <Label color={LabelColor.Yellow}>New</Label>
    {/if}
    {#if contact.isPending}
      <Label color={LabelColor.Yellow}>Pending</Label>
    {/if}
  </div>
</div>

<style lang="scss">
  .profile-pic {
    width: 100%;
    aspect-ratio: 1/1;
    border-radius: 50%;
  }

  .recipient-info {
    display: grid;
    justify-content: start;
  }

  .badges-and-labels {
    display: grid;
    align-items: start;
  }

  .truncated-wallet {
    cursor: pointer;
    background-color: transparent;
    color: var(--black);
  }
</style>
