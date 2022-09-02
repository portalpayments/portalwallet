<script lang="ts">
  import Label from "../Shared/Label.svelte";
  import Checkmark from "../../assets/Checkmark.svg";
  import { LabelColor } from "../constants";

  export let verifiedClaims;
  export let isNew: boolean;
</script>

<img
  src={verifiedClaims.imageUrl}
  class="profilePic"
  alt="Address is verified"
/>
<div class="recipient-info">
  {verifiedClaims.name}
  <div class="badges-and-labels">
    <img src={Checkmark} class="checkmark" alt="User is Verified" />
    {#if isNew}
      <Label color={LabelColor.Yellow}>New</Label>
    {/if}
  </div>
</div>

<style>
  .checkmark {
    height: 18px;
    margin-left: 5px;
    transform: translateY(4px);
  }
  .profilePic {
    margin: auto;
    height: 60px;
    width: 60px;
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
