<script lang="ts">
  import Label from "../Shared/Label.svelte";
  import Checkmark from "../../assets/Checkmark.svg";
  import { LabelColor } from "../constants";
  import { VAHEHS_WALLET, MIKES_WALLET } from "../../../../src/constants";
  import type { Contact } from "../types";

  export let contact: Contact;

  // TODO: delete
  const hackProfilePicsByWallet = {
    [VAHEHS_WALLET]: "/src/assets/ProfilePics/vaheh.jpg",
    [MIKES_WALLET]: "/src/assets/ProfilePics/mike.jpg",
  };

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
  {contact.verifiedClaims.familyName}
  <div class="badges-and-labels">
    <img src={Checkmark} class="verified-checkmark" alt="User is Verified" />
    <Label color={LabelColor.Yellow}>New</Label>
  </div>
</div>

<style>
  .profile-pic {
    border-radius: 50%;
  }
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
    grid-auto-flow: column;
    justify-content: start;
    align-items: center;
    gap: 6px;
  }
</style>
