<script lang="ts">
  import TransactionsHeading from "./TransactionsHeading.svelte";
  import Balance from "./Balance.svelte";
  import Transactions from "./Transactions.svelte";
  import Buttons from "./Buttons.svelte";

  import { connectionStore, keyPairStore, transactionsStore } from "../stores";
  import { HOW_MANY_TRANSACTIONS_TO_SHOW } from "../constants";
  import { amountAndDecimalsToMajorAndMinor } from "../utils";
  import type { Connection, Keypair } from "@solana/web3.js";

  import { log, stringify } from "../../backend/functions";

  log(`Homepage loading...`);

  import {
    getUSDCAccounts,
    getTransactionSummariesForAddress,
  } from "../../backend/vmwallet";

  let connection: Connection;
  let keypair: Keypair;

  let isBalanceLoaded = false;

  const updateBalance = async () => {
    if (!connection) {
      return;
    }
    if (!keypair) {
      return;
    }
    log(`🔢 Keypair or connection have changed, updating balance`);

    usdcAccounts = await getUSDCAccounts(connection, keypair.publicKey);

    const transactions = await getTransactionSummariesForAddress(
      connection,
      keypair.publicKey,
      HOW_MANY_TRANSACTIONS_TO_SHOW
    );

    transactionsStore.set(transactions);

    const JUST_ONE_SUPPORTED_USDC_ACCOUNT_FOR_NOW = 0;
    const usdcAccount = usdcAccounts[JUST_ONE_SUPPORTED_USDC_ACCOUNT_FOR_NOW];

    const amount = usdcAccount.account.data.parsed.info.tokenAmount.amount;
    const decimals = usdcAccount.account.data.parsed.info.tokenAmount.decimals;

    [major, minor] = amountAndDecimalsToMajorAndMinor(amount, decimals);
    isBalanceLoaded = true;
  };

  // Explicitly mark these values as reactive as they depend on other data
  // being updated (they're derived from usdcAccounts)
  let major: string | null;
  $: major = null;
  let minor: string | null;
  $: minor = null;
  $: usdcAccounts = [];

  connectionStore.subscribe((newValue) => {
    if (newValue) {
      connection = newValue;
      updateBalance();
    }
  });

  keyPairStore.subscribe((newValue) => {
    if (newValue) {
      keypair = newValue;
      updateBalance();
    }
  });
</script>

<div class="feature">
  {#if isBalanceLoaded}
    <Balance {isBalanceLoaded} {major} {minor} />
  {:else}
    <div>Loading...</div>
  {/if}
  <Buttons />
  <TransactionsHeading />
  <Transactions />
</div>

<style>
  .feature {
    grid-template-rows: 128px 128px 24px 2fr;
    background: radial-gradient(at 50% 50%, #dde9ff 0, #fff 80%, #fff 100%);
  }
</style>
