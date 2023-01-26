<script lang="ts">
  import Label from "../Shared/Label.svelte";
  import verifiedIconIndividual from "../../assets/verified.svg";
  import verifiedIconOrganization from "../../assets/verified-organization.svg";
  import { LabelColor } from "../frontend-constants";
  import type { Contact } from "../../backend/types";

  export let contact: Contact;

  // TODO: implement
  let isNew = false;
</script>

<img
  src={contact.verifiedClaims.imageUrl}
  class="profile-pic {contact.verifiedClaims.type === 'INDIVIDUAL'
    ? 'individual'
    : 'organization'}"
  alt="Address is verified"
/>
<div class="recipient-info">
  {#if contact.verifiedClaims.type === "INDIVIDUAL"}
    {contact.verifiedClaims.givenName}
    <!-- Note move verified badge inline -->
    {contact.verifiedClaims.familyName}{" "}<img
      class="verified-icon"
      src={verifiedIconIndividual}
      alt="User is Verified"
    />
  {/if}
  {#if contact.verifiedClaims.type === "ORGANIZATION"}
    {contact.verifiedClaims.legalName}<img
      class="verified-icon"
      src={verifiedIconOrganization}
      alt="User is Verified"
    />
  {/if}
  <div class="labels">
    {#if contact.isNew}
      <Label color={LabelColor.Yellow}>New</Label>
    {/if}
  </div>
</div>

<style lang="scss">
  .profile-pic {
    aspect-ratio: 1 / 1;
    width: 36px;
  }

  .profile-pic.individual {
    border-radius: 50%;
  }

  .profile-pic.organization {
    border-radius: 4px;
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
