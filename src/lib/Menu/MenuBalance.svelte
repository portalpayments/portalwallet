<script lang="ts">
  import { getCurrencyName } from "../../backend/vmwallet";
  import { amountAndDecimalsToString } from "../utils";
  import type { AccountSummary } from "../../lib/types";

  export let account: AccountSummary;
  export let changeAccount: Function;

  const ICONS = {
    USDC: "../../assets/Icons/usdc-coin.svg",
    USDT: "../../assets/Icons/usdt-coin.svg",
    USDH: "../../assets/Icons/usdh-coin.svg",
  };
</script>

<button type="button" class="with-icon" on:click={() => changeAccount()}>
  <img
    src={ICONS[getCurrencyName(account.currency)]}
    alt="{getCurrencyName(account.currency)} account"
  />
  <div class="text">
    <div class="currency-name">
      {getCurrencyName(account.currency)}
    </div>
    <div class="balance">
      {amountAndDecimalsToString(account.balance, account.decimals)}
    </div>
  </div>
</button>

<style>
  /* :global(a.button):active {
    color: var(--white);
    background-color: var(--mid-blue);
  } */

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
