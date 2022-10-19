<script lang="ts">
  import TransactionsHeading from "./TransactionsHeading.svelte";
  import Balance from "./Balance.svelte";
  import Transactions from "./Transactions.svelte";
  import Buttons from "./Buttons.svelte";

  import Menu from "../../lib/Menu/Menu.svelte";

  import { connectionStore, authStore, transactionsStore } from "../stores";
  import { HOW_MANY_TRANSACTIONS_TO_SHOW } from "../constants";
  import { amountAndDecimalsToMajorAndMinor } from "../utils";
  import type { Connection, Keypair } from "@solana/web3.js";
  import { Keypair as KeypairConstructor } from "@solana/web3.js";
  import MockBalance from "../Shared/MockedSVGs/MockBalance.svelte";
  import { log, sleep, stringify } from "../../backend/functions";
  import type { User } from "../../lib/types";

  log(`Homepage loading...`);

  import {
    getUSDCAccounts,
    getTransactionSummariesForAddress,
  } from "../../backend/vmwallet";

  export let user: User | null;

  let connection: Connection;
  let keypair: Keypair;

  let isBalanceLoaded = false;

  // Explicitly mark these values as reactive as they depend on other data
  // being updated (they're derived from usdcAccounts)
  let major: string | null;
  $: major = null;
  let minor: string | null;
  $: minor = null;
  $: usdcAccounts = [];

  const updateBalance = async () => {
    if (!connection) {
      return;
    }
    if (!keypair) {
      return;
    }

    log(`Updating balance...`);

    usdcAccounts = await getUSDCAccounts(connection, keypair.publicKey);

    if (!usdcAccounts.length) {
      throw new Error(`No USDC accounts on ${keypair.publicKey.toBase58()}`);
    }

    const transactionSummaries = await getTransactionSummariesForAddress(
      connection,
      keypair.publicKey,
      HOW_MANY_TRANSACTIONS_TO_SHOW
    );

    transactionsStore.set(transactionSummaries);

    const JUST_ONE_SUPPORTED_USDC_ACCOUNT_FOR_NOW = 0;
    const usdcAccount = usdcAccounts[JUST_ONE_SUPPORTED_USDC_ACCOUNT_FOR_NOW];

    const amount = usdcAccount.account.data.parsed.info.tokenAmount.amount;
    const decimals = usdcAccount.account.data.parsed.info.tokenAmount.decimals;

    [major, minor] = amountAndDecimalsToMajorAndMinor(amount, decimals);
    isBalanceLoaded = true;
  };

  connectionStore.subscribe((newValue) => {
    if (newValue) {
      log(`🔌 connection has changed, updating balance`);
      connection = newValue;
      updateBalance();
    }
  });

  authStore.subscribe((newValue) => {
    if (newValue.secretKey) {
      log(`🗝️ secretKey has changed, updating balance`);
      keypair = KeypairConstructor.fromSecretKey(newValue.secretKey);
      updateBalance();
    }
  });
</script>

<div class="feature">
  <Menu {...user} />
  {#if isBalanceLoaded}
    <Balance {isBalanceLoaded} {major} {minor} />
  {:else}
    <MockBalance />
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
