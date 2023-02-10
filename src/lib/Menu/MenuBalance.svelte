<script lang="ts">
  import { amountAndDecimalsToString } from "../utils";
  import { stringify } from "../../backend/functions";
  import { getCurrencyByMint } from "../../backend/solana-functions";
  import type { AccountSummary } from "../../backend/types";

  export let account: AccountSummary;
  export let changeAccount: Function;

  const currency = getCurrencyByMint(account.currency);
</script>

<button type="button" class="with-icon" on:click={() => changeAccount()}>
  <img src={currency.logo} alt="{currency.symbol} account" />
  <div class="text">
    <div class="currency-name">
      {currency.symbol}
    </div>
    <div class="balance">
      {amountAndDecimalsToString(account.balance, account.decimals)}
    </div>
  </div>
</button>

<style lang="scss">
  button.with-icon .text {
    grid-auto-flow: row;
    grid-template-rows: 18px 10px;
    font-weight: 600;
    font-size: 20px;
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
</style>
