<script lang="ts">
  import { getCurrencyBySymbol } from "../../backend/constants";
  export let amount: number | null = null;

  const solana = getCurrencyBySymbol("SOL");
</script>

{#if amount !== null}
  <div class="fee">
    <span>Fee: </span>
    <img src={solana.logo} class="icon" alt="{solana.symbol} logo" />
    <span>{amount}</span>
  </div>
{/if}

<style lang="scss">
  .fee {
    grid-auto-flow: row;
    font-size: 0.65rem;
    color: var(--black);
    justify-self: end;
    font-weight: 600;
    gap: 3px;
    grid-template-columns: 20px 12px 1fr;
    align-items: center;
  }

  .fee .icon {
    width: 12px;
  }
</style>
