<script lang="ts">
  import TransactionsHeading from "./TransactionsHeading.svelte";
  import Balance from "./Balance.svelte";
  import Transactions from "./Transactions.svelte";
  import Buttons from "./Buttons.svelte";
  import Heading from "../Shared/Heading.svelte";
  import QRCodeIcon from "../../assets/Icons/get-address-qr.svg";
  import Menu from "../../lib/Menu/Menu.svelte";
  import MenuButton from "../../lib/Menu/MenuButton.svelte";
  import type { Contact } from "../../lib/types";
  import { Link } from "svelte-navigator";
  import { connectionStore, authStore, transactionsStore } from "../stores";
  import { HOW_MANY_TRANSACTIONS_TO_SHOW } from "../constants";
  import { amountAndDecimalsToMajorAndMinor } from "../utils";
  import type { Connection, Keypair } from "@solana/web3.js";
  import type {
    PublicKey,
    AccountInfo,
    ParsedAccountData,
  } from "@solana/web3.js";
  import SkeletonBalance from "../Shared/Skeletons/SkeletonBalance.svelte";
  import { log, sleep, stringify } from "../../backend/functions";
  import type { TransactionSummary } from "../types";
  import { getEmailLink } from "../../backend/email";

  log(`Homepage loading...`);

  import {
    getUSDCAccounts,
    getTransactionSummariesForAddress,
  } from "../../backend/vmwallet";

  export let user: Contact | null;

  const JUST_ONE_SUPPORTED_USDC_ACCOUNT_FOR_NOW = 0;

  let connection: Connection;
  let keypair: Keypair;

  let isBalanceLoaded = false;
  $: isMenuActive = false;

  let isNewUnverifiedWallet: null | boolean = null;

  // Explicitly mark these values as reactive as they depend on other data
  // being updated (they're derived from usdcAccounts)
  let major: string | null;
  $: major = null;
  let minor: string | null;
  $: minor = null;

  interface SolanaAccount {
    pubkey: PublicKey;
    account: AccountInfo<ParsedAccountData>;
  }

  // https://stackoverflow.com/questions/73300193/svelte-reactive-value-with-typescript-type
  let usdcAccounts: Array<SolanaAccount>;
  $: usdcAccounts = [];

  let emailLink: null | string = null;

  const updateBalance = async () => {
    if (!connection) {
      return;
    }
    if (!keypair) {
      return;
    }

    log(`Updating balance...`);
    usdcAccounts = await getUSDCAccounts(connection, keypair.publicKey);

    let usdcAccount: SolanaAccount;
    let amount: string;
    let decimals: number;

    let transactionSummaries: Array<TransactionSummary>;

    // TODO: somewhat simplified logic, but will do for now.
    // We should also check for missing identity NFTs etc
    isNewUnverifiedWallet = usdcAccounts.length === 0;

    if (isNewUnverifiedWallet) {
      const walletAddressBase58 = keypair.publicKey.toBase58();
      log(`No USDC accounts on ${walletAddressBase58}`);
      emailLink = getEmailLink(walletAddressBase58);
      transactionSummaries = [];
      usdcAccount = null;
      amount = "0";
      decimals = 6;
    } else {
      transactionSummaries = await getTransactionSummariesForAddress(
        connection,
        keypair.publicKey,
        HOW_MANY_TRANSACTIONS_TO_SHOW
      );

      transactionsStore.set(transactionSummaries);

      usdcAccount = usdcAccounts[JUST_ONE_SUPPORTED_USDC_ACCOUNT_FOR_NOW];

      amount = usdcAccount.account.data.parsed.info.tokenAmount.amount;
      decimals = usdcAccount.account.data.parsed.info.tokenAmount.decimals;
    }

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
    if (newValue.keyPair) {
      log(`🗝️ keyPair has changed, updating balance`);
      keypair = newValue.keyPair;
      updateBalance();
    }
  });
</script>

<div class="feature">
  <div class="top-toolbar">
    <MenuButton
      {user}
      onClick={() => {
        log(`Toggling isMenuActive`);
        isMenuActive = true;
      }}
    />
    {#if isMenuActive}
      <Menu
        {user}
        {isMenuActive}
        onClose={() => {
          isMenuActive = false;
        }}
      />
    {/if}
    <div class="wallet-address-qr">
      <Link to={"/myWalletAddress/" + keypair.publicKey}>
        <img alt="Wallet address" src={QRCodeIcon} style={"width:34px;"} />
      </Link>
    </div>
  </div>
  {#if isNewUnverifiedWallet}
    <div class="welcome">
      <Heading>Welcome to the Portal alpha!</Heading>
      <p>Get verified to receive:</p>
      <p>💰 $5 of real USDC you can send to anyone you like</p>
      <p>✅ Your Portal verification token so people can send you money!</p>

      <a class="button" href={emailLink}>Get verified</a>
    </div>
  {:else}
    {#if isBalanceLoaded}
      <Balance {isBalanceLoaded} {major} {minor} />
    {:else}
      <SkeletonBalance />
    {/if}
    <Buttons />
    <TransactionsHeading />
    <Transactions />
  {/if}
</div>

<style>
  .feature {
    grid-template-rows: 72px 128px 48px 2fr;
    background: radial-gradient(at 50% 50%, #dde9ff 0, #fff 80%, #fff 100%);
    padding: 16px;
  }

  .welcome {
    justify-content: center;
    align-content: center;
    gap: 8px;
    height: 400px;
  }

  .welcome a {
    color: white;
    font-weight: 600;
    padding: 7px 0px;
    font-size: 14px;

    border-radius: 24px;
    background: var(--blue-green-gradient);
  }
  .welcome a {
    color: #fff;
    background-color: var(--mid-blue);
  }

  .welcome p {
    text-align: left;
  }
  .top-toolbar {
    display: grid;
    grid-auto-flow: column;
  }
  .wallet-address-qr {
    align-self: center;
    justify-self: end;
    /* eyeballed position */
    padding-right: 10px;
    transform: translateY(5px);
  }
</style>
