<script lang="ts">
  import { amountAndDecimalsToString } from "../utils";
  import { CURRENCY_ICONS } from "../constants";
  import { getCurrencyNameByMint } from "../../backend/constants";
  import type { AccountSummary } from "../../lib/types";

  export let account: AccountSummary;
  export let changeAccount: Function;
</script>

<button type="button" class="with-icon" on:click={() => changeAccount()}>
  <img
    src={CURRENCY_ICONS[getCurrencyNameByMint(account.currency)].grey}
    alt="{getCurrencyNameByMint(account.currency)} account"
  />
  <div class="text">
    <div class="currency-name">
      {getCurrencyNameByMint(account.currency)}
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
