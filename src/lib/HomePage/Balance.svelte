<script lang="ts">
  import { amountAndDecimalsToMajorAndMinor } from "../utils";
  import { log, stringify } from "../../backend/functions";

  import type { AccountSummary, CurrencyDetails } from "../../backend/types";
  import SkeletonBalance from "../Shared/Skeletons/SkeletonBalance.svelte";
  import {
    getCurrencyBySymbol,
    getCurrencyByMint,
  } from "../../backend/solana-functions";

  import {
    hasUSDCAccountStore,
    haveAccountsLoadedStore,
    onChangeActiveAccount,
  } from "../stores";

  let majorAndMinor: Array<string | null> = [null, null];

  let currency: CurrencyDetails | null = null;

  let activeAccount: AccountSummary | null;
  $: activeAccount = null;

  let haveAccountsLoaded: boolean = false;

  let hasUSDCAccount: boolean | null = null;

  hasUSDCAccountStore.subscribe((newValue) => {
    // Distinguish between null (we don't know) and false (we know, they don't have a USDC account)
    if (newValue !== null) {
      hasUSDCAccount = newValue;
    }
  });

  haveAccountsLoadedStore.subscribe((newValue) => {
    if (newValue !== null) {
      haveAccountsLoaded = newValue;
    }
  });

  onChangeActiveAccount((newValue) => {
    log(`Active account has changed, updating balance...`);
    majorAndMinor = amountAndDecimalsToMajorAndMinor(
      newValue.balance,
      newValue.decimals
    );
    currency = getCurrencyByMint(newValue.currency);
    haveAccountsLoaded = true;
    activeAccount = newValue;
  });
</script>

<div class="balance">
  {#if !haveAccountsLoaded || hasUSDCAccount === null}
    <div class="skeleton">
      <SkeletonBalance />
    </div>
  {:else if hasUSDCAccount}
    <div class="symbol-major-minor">
      <img class="symbol" alt="{currency.symbol} logo" src={currency.logo} />
      <div class="major">{majorAndMinor[0]}</div>
      <div class="minor">.{majorAndMinor[1]}</div>
    </div>
  {:else}
    <div class="symbol-major-minor">
      <img
        class="symbol"
        alt="USDC logo"
        src={getCurrencyBySymbol("USDC").logo}
      />
      <div class="major">0</div>
      <div class="minor">.0</div>
    </div>
  {/if}
</div>

<style lang="scss">
  @import "../../mixins.scss";
  .balance {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 1fr;
    align-items: center;
    justify-content: center;
  }

  .symbol-major-minor {
    color: var(--black);
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: max-content;
    justify-content: center;
    align-items: baseline;
    gap: 2px;
  }

  .symbol {
    width: 36px;

    /* Slight hack to make the $ in USDC be the baseline, rather than the brackets */
    transform: translateY(3px);
  }

  .major {
    font-size: 36px;
    line-height: 36px;
    font-weight: 600;
  }

  .minor {
    font-size: 20px;
    line-height: 24px;
    font-weight: 500;
    transform: translateY(-1px);
  }

  /* TODO: skeleton placeholder graphic doesn't seem to have a real height, maybe replace it to avoid hacks like this */
  .skeleton {
    height: 96px;
    width: var(--wallet-width);
  }
</style>
