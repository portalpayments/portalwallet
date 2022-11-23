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
  import { nativeAccountStore, tokenAccountsStore } from "../stores";
  import type { Connection, Keypair } from "@solana/web3.js";
  import SkeletonBalance from "../Shared/Skeletons/SkeletonBalance.svelte";
  import { log, sleep, stringify } from "../../backend/functions";
  import type { AccountSummary } from "../types";
  import { Currency } from "../types";

  log(`Homepage loading...`);

  export let user: Contact | null;

  let keypair: Keypair | null = null;

  let haveAccountsLoaded = false;

  $: isMenuActive = false;

  let tokenAccounts: Array<AccountSummary>;

  let activeAccount: AccountSummary | null = null;

  let noUSDCAccountYet: boolean | null = null;

  tokenAccountsStore.subscribe((newValue: Array<AccountSummary>) => {
    if (newValue) {
      tokenAccounts = newValue;
      // By default we always load USDC
      const usdcAccount = tokenAccounts.find((tokenAccount) => {
        return tokenAccount.currency === Currency.USDC;
      });
      if (!usdcAccount) {
        noUSDCAccountYet = true;
        return;
      }
      activeAccount = usdcAccount;
      haveAccountsLoaded = true;
    }
  });

  let isNewUnverifiedWallet: null | boolean = null;

  let emailLink: null | string = null;
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
    {#if keypair}
      <div class="wallet-address-qr">
        <Link to={"/myWalletAddress/" + keypair.publicKey}>
          <img alt="Wallet address" src={QRCodeIcon} class="qr-code-icon" />
        </Link>
      </div>
    {/if}
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
    {#if haveAccountsLoaded}
      <Balance account={activeAccount} {noUSDCAccountYet} />
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
    /* heading, balance, buttons, heading, transactions */
    grid-template-rows: 72px 128px 48px 24px 1fr;
    background: radial-gradient(at 50% 50%, #dde9ff 0, #fff 80%, #fff 100%);
  }

  .welcome {
    justify-content: center;
    align-content: center;
    gap: 8px;
    height: 400px;
    padding: 16px;
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

  .qr-code-icon {
    width: 36px;
  }
</style>
