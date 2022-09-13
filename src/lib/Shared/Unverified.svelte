<script lang="ts">
  import AnonymousImage from "../../assets/anonymous.svg";
  import Label from "../Shared/Label.svelte";
  import { LabelColor } from "../constants";
  import type { Contact } from "../types";
  import { truncateWallet } from "../utils";

  export let contact: Contact;

  // TODO: implement
  let isPending = false;
  let isNew = false;
</script>

<img src={AnonymousImage} class="profile-pic" alt="Address is not verified" />
<div class="recipient-info">
  {truncateWallet(contact.walletAddress)}
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

<style>
  .profile-pic {
    width: 100%;
  }

  .recipient-info {
    display: grid;
    justify-content: start;
  }

  .badges-and-labels {
    display: grid;
    align-items: start;
  }
</style>
