<script lang="ts">
  import { amountAndDecimalsToMajorAndMinor } from "../utils";
  import { log } from "../../backend/functions";
  import { get as getFromStore } from "svelte/store";
  import { ICONS } from "../constants";
  import { getCurrencyName } from "../../backend/vmwallet";
  import type { AccountSummary } from "../../lib/types";
  import SkeletonBalance from "../Shared/Skeletons/SkeletonBalance.svelte";

  import {
    hasUSDCAccountStore,
    haveAccountsLoadedStore,
    onChangeActiveAccount,
  } from "../stores";

  // TODO
  // Explicitly mark these values as reactive as they depend on other data
  let major: string | null;
  $: major = null;
  let minor: string | null;
  $: minor = null;

  let currencyName: string;

  let account: AccountSummary | null;
  $: account = null;

  let haveAccountsLoaded: boolean;

  let hasUSDCAccount: boolean;

  hasUSDCAccountStore.subscribe((newValue) => {
    hasUSDCAccount = newValue;
  });

  haveAccountsLoadedStore.subscribe((newValue) => {
    haveAccountsLoaded = newValue;
  });

  onChangeActiveAccount((activeAccount) => {
    log(`Active account has changed, updating balance...`);
    const majorAndMinor = amountAndDecimalsToMajorAndMinor(
      activeAccount.balance,
      activeAccount.decimals
    );
    major = majorAndMinor[0];
    minor = majorAndMinor[1];
    currencyName = getCurrencyName(activeAccount.currency);
    haveAccountsLoaded = true;
  });
</script>

<div class="balance">
  {#if haveAccountsLoaded}
    {#if hasUSDCAccount}
      <div class="symbol-major-minor">
        <img
          class="symbol"
          alt="{currencyName} logo"
          src={ICONS[currencyName]}
        />
        <div class="major">{major}</div>
        <div class="minor">.{minor}</div>
      </div>
    {:else}
      <div class="symbol-major-minor">
        <img
          class="symbol"
          alt="{currencyName} logo"
          src={ICONS[currencyName]}
        />
        <div class="major">0</div>
        <div class="minor">.0</div>
      </div>
    {/if}
  {:else}
    <SkeletonBalance />
  {/if}
</div>

<style>
  .balance {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 1fr;
    align-items: center;
    justify-content: center;
  }

  .symbol-major-minor {
    color: var(--mid-blue);
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
</style>
