<script lang="ts">
  import type { Contact } from "../../backend/types";
  import { truncateWallet, copyToClipboard } from "../utils";
  import { getGradient } from "../../backend/deterministic-beautiful-gradient";
  import { onMount } from "svelte";
  import { getSolanaName as getWalletAddressName } from "sol-namor";

  export let contact: Contact;

  const walletAddressName = getWalletAddressName(contact.walletAddress);

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
  <div class="anonymous">Anonymous</div>
  <button
    class="truncated-wallet"
    on:click={async () => {
      await copyToClipboard(contact.walletAddress);
    }}>{truncateWallet(contact.walletAddress)}</button
  >
  <div class="wallet-address-name">{walletAddressName}</div>
</div>

<style lang="scss">
  .profile-pic {
    width: 100%;
    aspect-ratio: 1/1;
    border-radius: 50%;
  }

  .recipient-info {
    display: grid;
    text-align: left;
    justify-content: start;
  }

  .badges-and-labels {
    display: grid;
    align-items: start;
  }

  .anonymous {
    font-weight: 600;
  }

  .truncated-wallet {
    cursor: pointer;
    background-color: transparent;
    color: var(--black);
    padding: 0;
    border: 0;
    text-align: left;
    font-size: 12px;
    line-height: 14px;
  }

  .wallet-address-name {
    font-size: 10px;
    line-height: 12px;
  }
</style>
