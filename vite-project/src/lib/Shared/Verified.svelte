<script lang="ts">
  import Label from "../Shared/Label.svelte";
  import Checkmark from "../../assets/Checkmark.svg";
  import { LabelColor } from "../constants";
  import type { Contact } from "../types";

  export let contact: Contact;

  // TODO: implement
  let isNew = false;
</script>

<img
  src={contact.verifiedClaims.imageUrl}
  class="profile-pic"
  alt="Address is verified"
/>
<div class="recipient-info">
  {contact.verifiedClaims.givenName}
  {contact.verifiedClaims.familyName}
  <div class="badges-and-labels">
    <img src={Checkmark} class="verified-checkmark" alt="User is Verified" />
    {#if isNew}
      <Label color={LabelColor.Yellow}>New</Label>
    {/if}
  </div>
</div>

<style>
  .verified-checkmark {
    height: 18px;
    /* transform: translateY(4px); */
  }
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
