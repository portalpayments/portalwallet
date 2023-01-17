<script lang="ts">
  import FailedAction from "../../assets/failedAction.svg";
  import { truncateWallet } from "../utils";
  import { log } from "../../backend/functions";
  import type { VerifiedClaims } from "../../backend/types";
  import USDClogo from "../../assets/Icons/usdc.svg";
  export let errorMessage: string | null = null;
  export let verifiedClaims: VerifiedClaims;
  export let destinationWalletAddress: string | null;
  export let transferAmount: number | null;

  log(`transferAmount is`, transferAmount);
</script>

<div class="transaction-details">
  <h1>Transfer unsuccessful</h1>
  <img class="fail-icon" src={FailedAction} alt="money could not be sent" />
  <div class="recipient-and-amount">
    <p>{errorMessage}</p>
    Failed to send<img
      class="usdc-symbol"
      src={USDClogo}
      alt="usdc symbol"
    />{transferAmount} to
    <br />{#if verifiedClaims}{verifiedClaims.givenName}
      {verifiedClaims.familyName}{:else}{truncateWallet(
        destinationWalletAddress
      )}{/if}
  </div>
</div>

<style lang="scss">
  .fail-icon {
    width: 64px;
    justify-self: center;
    align-self: center;
  }

  .usdc-symbol {
    display: inline;
    height: 16px;
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
  h1 {
    font-size: 24px;
    margin: 0;
    display: grid;
    align-content: center;
    /* Colored background techique used on website */
    color: rgb(249, 61, 61);
    background-clip: text;
    -webkit-background-clip: text;
    margin-top: 5px;
  }
</style>
