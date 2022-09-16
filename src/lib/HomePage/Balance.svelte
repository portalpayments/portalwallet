<script lang="ts">
  import usdcSymbolUrl from "../../assets/usdc.svg";
  import { formatMajorUnits } from "../utils";

  export let isBalanceLoaded: boolean;
  export let major: string;
  export let minor: string;

  const SYMBOLS = {
    usdc: usdcSymbolUrl,
  };
</script>

<div class="balance">
  <div class="symbol-major-minor">
    {#if isBalanceLoaded}
      <img class="symbol" alt="USDC logo" src={SYMBOLS.usdc} />
      <div class="major">{formatMajorUnits(major)}</div>
      <div class="minor">.{minor}</div>
    {:else}
      <div>...</div>
    {/if}
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