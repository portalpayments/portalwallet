<script lang="ts">
  import usdcSymbolUrl from "../../assets/usdc.svg";
  import { formatNumber } from "../utils";

  export let major: string;
  export let minor: string;

  const SYMBOLS = {
    usdc: usdcSymbolUrl,
  };
</script>

<dic class="balanceCard">
  <div class="balance">
    <img class="symbol" alt="USDC logo" src={SYMBOLS.usdc} />
    <div class="major">{formatNumber(major, true)}</div>
    <div class="minor">.{formatNumber(minor, false)}</div>
  </div>
</dic>

<style>
  .balanceCard {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 1fr;
    align-items: center;
    justify-content: center;
  }
  :root {
    --usdc-blue: #2775c9;
  }
  .balance {
    color: var(--usdc-blue);
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
