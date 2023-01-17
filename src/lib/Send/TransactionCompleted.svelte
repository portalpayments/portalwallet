<script lang="ts">
  import SuccessfulAction from "../../assets/SuccessfulAction.svg";
  import Heading from "../Shared/Heading.svelte";
  import { truncateWallet } from "../utils";
  import { log } from "../../backend/functions";
  import type { VerifiedClaims } from "../../backend/types";
  import USDClogo from "../../assets/Icons/usdc.svg";

  export let verifiedClaims: VerifiedClaims;
  export let destinationWalletAddress: string | null;
  export let transferAmount: number | null;

  log(`transferAmount is`, transferAmount);
</script>

<div class="transaction-details">
  <Heading
    ><img
      class="usdc-symbol"
      src={USDClogo}
      alt="usdc symbol"
    />{transferAmount} recieved by<br />
    {#if verifiedClaims}
      {verifiedClaims.givenName} {verifiedClaims.familyName}!
    {:else}
      {truncateWallet(destinationWalletAddress)}!
    {/if}
  </Heading>
  <img
    class="success-icon"
    src={SuccessfulAction}
    alt="money sent successfully"
  />
  <span class="recipient-and-amount"> Transaction complete. </span>
</div>

<style lang="scss">
  .success-icon {
    width: 64px;
    justify-self: center;
    align-self: center;
  }

  .usdc-symbol {
    display: inline;
    height: 22px;
    /* Hack to get baseline of $ to line up with baseline of text */
    transform: translateY(2px);
  }

  .transaction-details {
    position: relative;
    display: grid;
    grid-auto-flow: row;
    justify-content: center;
    align-items: start;
    gap: 12px;
    color: var(--black);
    font-size: 1.1rem;
  }
</style>
