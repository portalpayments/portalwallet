<script lang="ts">
  import { amountAndDecimalsToString } from "../utils";
  import { stringify } from "../../backend/functions";
  import { CURRENCY_ICONS } from "../constants";
  import { getCurrencySymbolByMint } from "../../backend/constants";
  import type { AccountSummary } from "../../backend/types";

  export let account: AccountSummary;
  export let changeAccount: Function;

  const currencySymbol = getCurrencySymbolByMint(account.currency);

  let currencyIconMap = CURRENCY_ICONS[currencySymbol];
</script>

<button type="button" class="with-icon" on:click={() => changeAccount()}>
  <img
    src={currencyIconMap ? currencyIconMap.grey : null}
    alt="{currencySymbol} account"
  />
  <div class="text">
    <div class="currency-name">
      {currencySymbol}
    </div>
    <div class="balance">
      {amountAndDecimalsToString(account.balance, account.decimals)}
    </div>
  </div>
</button>

<style type="text/scss">
  button.with-icon .text {
    grid-auto-flow: row;
    grid-template-rows: 18px 10px;
  }

  button.with-icon .text {
    grid-auto-flow: row;
    gap: 8px;
    grid-template-rows: 18px 10px;
  }

  button.with-icon .balance {
    color: rgb(195, 195, 195);
    font-size: 13px;
  }

  button.with-icon:hover,
  :global(a.button.with-icon):hover {
    transform: translateX(12px);
  }
</style>
