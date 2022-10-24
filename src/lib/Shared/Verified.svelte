<script lang="ts">
  import Label from "../Shared/Label.svelte";
  import verifiedIcon from "../../assets/verified.svg";
  import { LabelColor } from "../constants";
  import { hackProfilePicsByWallet } from "../utils";
  import type { Contact } from "../types";

  export let contact: Contact;

  // TODO: implement
  let isNew = false;
</script>

<!-- TODO: src={contact.verifiedClaims.imageUrl} -->
<img
  src={hackProfilePicsByWallet[contact.walletAddress]}
  class="profile-pic"
  alt="Address is verified"
/>
<div class="recipient-info">
  {contact.verifiedClaims.givenName}
  <!-- Note move verified badge inline -->
  {contact.verifiedClaims.familyName}{" "}<img
    class="verified-icon"
    src={verifiedIcon}
    alt="User is Verified"
  />
  <div class="labels">
    {#if contact.isNew}
      <Label color={LabelColor.Yellow}>New</Label>
    {/if}
  </div>
</div>

<style>
  .profile-pic {
    border-radius: 50%;
    aspect-ratio: 1 / 1;
  }

  .profile-pic {
    width: 100%;
  }

  .recipient-info {
    display: block;
    justify-content: start;
    text-align: left;
    gap: 6px;
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
  }

  .verified-icon {
    height: 18px;
    display: inline-grid;
    /* Move icon so the tick bottom is level with the text baseline */
    transform: translateY(5px);
  }

  .labels {
    display: grid;
    grid-auto-flow: column;
    justify-content: start;
    align-items: center;
    gap: 6px;
  }
</style>
