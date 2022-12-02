<script lang="ts">
  import { amountAndDecimalsToMajorAndMinor } from "../utils";
  import { log } from "../../backend/functions";
  import type { AccountSummary } from "../types";

  import { getCurrencyName } from "../../backend/vmwallet";

  export let account: AccountSummary;
  export let noUSDCAccountYet: boolean;

  const ICONS = {
    USDC: "../assets/Icons/usdc-coin.svg",
    USDT: "../assets/Icons/usdt-coin.svg",
    USDH: "../assets/Icons/usdh-coin.svg",
  };

  // Explicitly mark these values as reactive as they depend on other data
  // being updated (they're derived from usdcAccounts)
  let major: string | null = null;
  let minor: string | null = null;

  let currencyName: string;

  if (account) {
    const majorAndMinor = amountAndDecimalsToMajorAndMinor(
      account.balance,
      account.decimals
    );
    major = majorAndMinor[0];
    minor = majorAndMinor[1];
    currencyName = getCurrencyName(account.currency);
  }
</script>

<div class="balance">
  <div class="symbol-major-minor">
    <img class="symbol" alt="{currencyName} logo" src={ICONS[currencyName]} />
    <div class="major">
      {noUSDCAccountYet ? "0" : major}
    </div>
    <div class="minor">
      .{noUSDCAccountYet ? "0" : minor}
    </div>
  </div>
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
