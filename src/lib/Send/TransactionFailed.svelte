<script lang="ts">
  import FailedAction from "../../assets/failedAction.svg";
  import { truncateWallet } from "../utils";
  import { log } from "../../backend/functions";
  import type {
    VerifiedClaimsForIndividual,
    VerifiedClaimsForOrganization,
    CurrencyDetails,
  } from "../../backend/types";
  export let errorMessage: string | null = null;
  export let verifiedClaims:
    | VerifiedClaimsForIndividual
    | VerifiedClaimsForOrganization;
  export let destinationWalletAddress: string | null;
  export let transferAmount: number | null;
  export let currency: CurrencyDetails;

  log(`transferAmount is`, transferAmount);
</script>

<div class="transaction-details">
  <h1>Transfer unsuccessful</h1>
  <img class="fail-icon" src={FailedAction} alt="money could not be sent" />
  <div class="recipient-and-amount">
    <p class="error">{errorMessage}</p>
    <p>
      Failed to send<img
        class="symbol"
        src={currency.logo}
        alt={currency.symbol}
      />{transferAmount} to
      <br />
      {#if verifiedClaims}
        {#if verifiedClaims.type === "INDIVIDUAL"}
          {verifiedClaims.givenName}
          {verifiedClaims.familyName}
        {:else if verifiedClaims.type === "ORGANIZATION"}
          {verifiedClaims.legalName}
        {/if}
      {:else}
        {truncateWallet(destinationWalletAddress)}
      {/if}
    </p>
  </div>
</div>

<style lang="scss">
  .fail-icon {
    width: 64px;
    justify-self: center;
    align-self: center;
  }

  .symbol {
    display: inline;
    height: 16px;
    /* Hack to get baseline of $ to line up with baseline of text */
    transform: translateY(2px);
    margin: 0 3px;
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

  .error {
    // Very long transaction signatures can make this quite wide
    max-width: var(--wallet-width);
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
