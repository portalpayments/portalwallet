<script lang="ts">
  import usdcSymbolURL from "../../assets/Icons/usdc.svg";
  import solSymbolURL from "../../assets/Icons/solana.svg";
  import { formatMajorUnits } from "../utils";
  import { walletBalanceAccount } from "../stores";

  export let isBalanceLoaded: boolean;
  export let major: string;
  export let minor: string;

  const SYMBOLS = {
    usdc: usdcSymbolURL,
    sol: solSymbolURL,
  };
</script>

<div class="balance">
  <div class="symbol-major-minor">
    {#if isBalanceLoaded}
      {#if $walletBalanceAccount.isShowingBalanceInSol}
        <!-- TODO load sol account balance here @MikeMacCana -->
        <img class="symbol" alt="Sol logo" src={SYMBOLS.sol} />
        <div class="major">{0}</div>
        <div class="minor">.{0}</div>
      {:else}
        <img class="symbol" alt="USDC logo" src={SYMBOLS.usdc} />
        <div class="major">{formatMajorUnits(major)}</div>
        <div class="minor">.{minor}</div>
      {/if}
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
