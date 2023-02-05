<script lang="ts">
  import { convertLamportsToUSDOrEurCents } from "../../backend/currency-conversion";
  import { stringify, log } from "../../backend/functions";
  import { amountAndDecimalsToString } from "../utils";
  import { onMount } from "svelte";
  export let amount: number | null = null;

  let amountString: string | null = null;

  onMount(async () => {
    if (amount !== null) {
      const amountInUSCents = await convertLamportsToUSDOrEurCents(amount);
      amountString = `$${amountAndDecimalsToString(amountInUSCents, 2)}`;
      if ((amountString = "0.00")) {
        amountString = "less than 1 cent";
      }
    }
  });
</script>

{#if amountString !== null}
  <div class="fee">
    <span>Fee: </span>
    <span>{amountString}</span>
  </div>
{/if}

<style lang="scss">
  .fee {
    display: grid;
    grid-auto-flow: row;
    font-size: 0.65rem;
    color: var(--black);
    justify-self: end;
    font-weight: 600;
    gap: 3px;
    grid-template-columns: 20px 1fr;
    align-items: center;
  }
</style>
