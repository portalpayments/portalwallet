<script lang="ts">
  import { Link } from "svelte-navigator";
  import { get as getFromStore } from "svelte/store";
  import {
    activeAccountIndexOrNativeStore,
    tokenAccountsStore,
  } from "../stores";
  import type { AccountSummary } from "../../lib/types";
  import solIconURL from "../../assets/Icons/solana-coin.svg";
  import closeIconURL from "../../assets/Icons/close.svg";
  import settingsIconURL from "../../assets/Icons/settings.svg";
  import type { Contact as ContactType } from "../types";
  import { log } from "../../backend/functions";
  import { getCurrencyName } from "../../backend/vmwallet";
  import Contact from "../Shared/Contact.svelte";

  const ICONS = {
    USDC: "../assets/Icons/usdc-coin.svg",
    USDT: "../assets/Icons/usdt-coin.svg",
    USDH: "../assets/Icons/usdh-coin.svg",
  };

  export let user: ContactType | null;

  export let isMenuActive: boolean;

  export let onClose: Function;

  let tokenAccounts: Array<AccountSummary>;

  tokenAccountsStore.subscribe((newValue: Array<AccountSummary>) => {
    tokenAccounts = newValue;
  });

  const changeAccount = (accountToSetActive: number | "native") => {
    log(`Setting ${accountToSetActive} as active account`);
    activeAccountIndexOrNativeStore.set(accountToSetActive);
    onClose();
  };
</script>

<div class="menu {isMenuActive ? 'active' : ''}">
  <button class="close" on:click={() => onClose}
    ><img src={closeIconURL} alt="close" /></button
  >

  <div class="accounts">
    {#each tokenAccounts as tokenAccount, index}
      <button
        type="button"
        class="with-icon {getFromStore(activeAccountIndexOrNativeStore) ===
        index
          ? 'active'
          : ''}"
        on:click={() => changeAccount(index)}
      >
        <img
          src={ICONS[getCurrencyName(tokenAccount.currency)]}
          alt="{getCurrencyName(tokenAccount.currency)} account"
        />{getCurrencyName(tokenAccount.currency)}
        account</button
      >
    {/each}

    <button
      type="button"
      class="with-icon {getFromStore(activeAccountIndexOrNativeStore) ===
      'native'
        ? 'active'
        : ''}"
      on:click={() => changeAccount("native")}
    >
      <img src={solIconURL} alt="Sol account" />
      Sol account
    </button>
  </div>
  <div class="settings-and-wallet">
    <Link class="button with-icon settings" to="/settings">
      <img src={settingsIconURL} alt="Settings" />
      Settings
    </Link>
    <button>
      <Contact contact={user} />
    </button>
  </div>
</div>

<style>
  .menu {
    /* Off screen by Default */
    transform: translateX(-100%);
    transition: all 200ms ease-in-out;

    position: absolute;
    top: 0;
    left: 0;
    width: calc(var(--wallet-width) * 0.7);
    height: var(--wallet-height);
    overflow: hidden;

    align-items: stretch;

    padding: 6px;
    grid-auto-flow: row;
    color: var(--black);
    background-color: white;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
    z-index: 2;
  }

  button.close {
    position: absolute;
    top: 12px;
    right: 12px;
    background: transparent;
    color: var(--black);
  }

  button.close img {
    width: 18px;
  }

  /* On screen when active */
  .menu.active {
    transform: translateX(0);
  }

  .menu .accounts {
    justify-content: start;
    align-content: start;
    padding-top: 24px;
    width: 100%;
    grid-template-columns: 100%;
  }

  .accounts button.with-icon:last-of-type {
    border-radius: 0;
    border-bottom: none;
  }

  .menu :global(a.button):active {
    color: var(--white);
    background-color: var(--mid-blue);
  }

  button.with-icon.active {
    border-radius: 0;
    border-bottom: 1px solid var(--mid-blue);
  }

  button.with-icon:hover,
  :global(a.button.with-icon):hover {
    transform: translateX(12px);
  }

  .settings-and-wallet {
    align-content: end;
  }

  .settings-and-wallet button {
    color: var(--actually-dark-grey);
    background-color: var(--very-very-light-grey);
  }
</style>
