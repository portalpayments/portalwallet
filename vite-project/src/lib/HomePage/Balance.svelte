<script lang="ts">
  import imgUrl from "../../assets/usdc.svg";
  import { formatNumber } from "../utils";

  // TODO: dynamic URL for symbol
  // export let symbol: number;
  export let major: string;
  export let minor: string;
</script>

<div class="balance">
  <img class="symbol" alt="USDC logo" src={imgUrl} />
  <div class="major">{formatNumber(major, true)}</div>
  <div class="minor">.{formatNumber(minor, false)}</div>
</div>

<style>
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
    font-weight: 500;
  }

  .minor {
    font-size: 24px;
    line-height: 24px;
    transform: translateY(-1px);
  }
</style>
