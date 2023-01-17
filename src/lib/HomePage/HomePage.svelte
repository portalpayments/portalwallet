<script lang="ts">
  import TransactionsHeading from "./TransactionsHeading.svelte";
  import Balance from "./Balance.svelte";
  import Transactions from "./Transactions.svelte";
  import Buttons from "./Buttons.svelte";
  import Heading from "../Shared/Heading.svelte";
  import QRCodeIcon from "../../assets/Icons/get-address-qr.svg";
  import Menu from "../../lib/Menu/Menu.svelte";
  import MenuButton from "../../lib/Menu/MenuButton.svelte";
  import type { Contact } from "../../backend/types";
  import { Link } from "svelte-navigator";

  import { hasUSDCAccountStore } from "../../lib/stores";
  import { log, sleep, stringify } from "../../backend/functions";

  log(`Homepage loading...`);

  export let user: Contact | null;

  $: isMenuActive = false;

  let isNewUnverifiedWallet: null | boolean = null;

  hasUSDCAccountStore.subscribe((newValue) => {
    // TODO: we're saying if we have no USDC account, we don't have a wallet.
    // This isn't strictly true.

    // Check for 'false' specifically as null just means unknown.
    if (newValue === false) {
      isNewUnverifiedWallet = true;
    }
  });
</script>

<div class="feature">
  <Menu
    {user}
    {isMenuActive}
    onClose={() => {
      isMenuActive = false;
    }}
  />

  <div class="top-toolbar">
    <MenuButton
      {user}
      onClick={() => {
        log(`Toggling isMenuActive`);
        isMenuActive = true;
      }}
    />

    {#if user}
      <div class="wallet-address-qr">
        <Link to={`/myWalletAddress/${user.walletAddress}`}>
          <img alt="Wallet address" src={QRCodeIcon} class="qr-code-icon" />
        </Link>
      </div>
    {/if}
  </div>
  {#if isNewUnverifiedWallet}
    {#if user}
      <div class="welcome">
        <Heading>Welcome to the Portal alpha!</Heading>
        <p>Get verified to receive:</p>
        <p>💰 $5 of real USDC you can send to anyone you like</p>
        <p>✅ Your Portal verification token so people can send you money!</p>

        <Link to={`/myWalletAddress/${user.walletAddress}`}>
          <button class="get-verified primary">Get verified</button>
        </Link>
      </div>
    {/if}
  {:else}
    <Balance />
    <Buttons />
    <TransactionsHeading />
    <Transactions />
  {/if}
</div>

<style lang="scss">
  @import "../../mixins.scss";
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
