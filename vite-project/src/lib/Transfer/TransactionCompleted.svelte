<script lang="ts">
  import SuccessfulAction from "../../assets/SuccessfulAction.svg";
  import { truncateWallet } from "../utils";
  import { log } from "../../../../src/functions";
  import type { VerifiedClaims } from "../../../../src/types";
  import USDClogo from "../../assets/usdc.svg";

  export let verifiedClaims: VerifiedClaims;
  export let destinationWalletAddress: string | null;
  export let transferAmount: number | null;

  log(`transferAmount is`, transferAmount);
</script>

<div class="transaction-details">
  <h1>Transaction Complete!</h1>
  <img
    class="success-icon"
    src={SuccessfulAction}
    alt="money sent successfully"
  />
  <div class="recipient-and-amount">
    Sent <img
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

<style>
  h1 {
    font-size: 1rem;
    margin: 0;
  }
  .success-icon {
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
    grid-template-rows: 20px 60px 1fr;
    justify-content: center;
    align-items: start;
    gap: 24px;
    color: var(--black);
    font-size: 1.1rem;
  }
</style>
