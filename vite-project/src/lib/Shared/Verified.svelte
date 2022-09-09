<script lang="ts">
  import Label from "../Shared/Label.svelte";
  import Checkmark from "../../assets/Checkmark.svg";
  import { LabelColor } from "../constants";
  import {
    VAHEHS_WALLET,
    MIKES_WALLET,
    JOE_MCCANNS_WALLET,
    SHAQS_WALLET,
    YCOMBINATOR_DEMO_WALLET_FOR_JARED
  } from "../../backend/constants";
  import type { Contact } from "../types";

  export let contact: Contact;

  // TODO: delete
  const hackProfilePicsByWallet = {
    [VAHEHS_WALLET]: "/ProfilePics/vaheh.jpg",
    [MIKES_WALLET]: "/ProfilePics/mike.jpg",
    [JOE_MCCANNS_WALLET]: "/ProfilePics/joe.jpg",
    [SHAQS_WALLET]: "/ProfilePics/shaq.jpg",
    [YCOMBINATOR_DEMO_WALLET_FOR_JARED]: "/ProfilePics/jared.jpg",
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
