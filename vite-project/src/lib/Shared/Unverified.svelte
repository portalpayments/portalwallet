<script lang="ts">
  import AnonymousSvg from "../../assets/ProfilePics/anonymous.svg";
  import Label from "../Shared/Label.svelte";
  import { LabelColor } from "../constants";
  import { truncateWallet } from "../utils";
  export let walletAddress: string;
  let isPending = false;
  let isNew = false;
</script>

<img src={AnonymousSvg} class="profilePic" alt="Address is not verified" />
<div class="recipient-info">
  {truncateWallet(walletAddress)}
  <div class="badges-and-labels">
    <Label color={LabelColor.Grey}>Unverified</Label>
    {#if isNew}
      <Label color={LabelColor.Yellow}>New</Label>
    {/if}
  </div>
</div>

<style>
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
