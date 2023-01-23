<script lang="ts">
  // Design incpiration: https://dribbble.com/shots/17444832-BoxedUP-Delivery-Driver-application/attachments/12575962?mode=media
  import { Link } from "svelte-navigator";
  import {
    activeAccountIndexStore,
    nativeAccountStore,
    tokenAccountsStore,
  } from "../stores";
  import type { AccountSummary } from "../../backend/types";
  import closeIconURL from "../../assets/Icons/close.svg";
  import settingsIconURL from "../../assets/Icons/settings-grey.svg";
  import type { Contact as ContactType } from "../../backend/types";
  import { log } from "../../backend/functions";
  import Contact from "../Shared/Contact.svelte";
  import MenuBalance from "./MenuBalance.svelte";

  export let user: ContactType | null = null;

  export let isMenuActive: boolean;

  export let onClose: Function;

  let tokenAccounts: Array<AccountSummary> = [];

  tokenAccountsStore.subscribe((newValue: Array<AccountSummary>) => {
    if (newValue?.length) {
      tokenAccounts = newValue;
    }
  });

  let nativeAccount: AccountSummary;

  nativeAccountStore.subscribe((newValue: AccountSummary) => {
    nativeAccount = newValue;
  });

  const changeAccount = (tokenAccountIndexOrNative: number | "native") => {
    log(`Setting account '${tokenAccountIndexOrNative}' as active account`);
    activeAccountIndexStore.set(tokenAccountIndexOrNative);
    onClose();
  };
</script>

<div class="menu  {isMenuActive ? 'active' : ''}">
  <button class="close" on:click={() => onClose()}
    ><img src={closeIconURL} alt="close" /></button
  >

  <button class="wallet">
    <Contact contact={user} />
  </button>

  <div class="accounts">
    {#each tokenAccounts as tokenAccount, index}
      {#if tokenAccount.balance !== 0}
        <!-- TODO: store active account index and use it to mark one of these as active -->
        <MenuBalance
          account={tokenAccount}
          changeAccount={() => changeAccount(index)}
        />
      {/if}
    {/each}

    <!-- TODO: store active account index and use it to mark one of these as active -->
    {#if nativeAccount}
      <MenuBalance
        account={nativeAccount}
        changeAccount={() => changeAccount("native")}
      />
    {/if}
  </div>

  <Link class="button with-icon settings" to="/settings">
    <img src={settingsIconURL} alt="Settings" />
    Settings
  </Link>
</div>

<style lang="scss">
  @import "../../mixins.scss";
  button.wallet {
    background-color: transparent;
    color: var(--black);
    font-size: 18px;
  }
  .menu {
    /* Off screen by Default */
    transform: translateX(-100%);
    transition: all 200ms ease-in-out;

    grid-template-rows: 120px 1fr 64px;
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
    z-index: 2;

    @include polymer;
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
    box-shadow: 1px 5px 15px 5px rgba(0, 0, 0, 0.33);
  }

  .menu .accounts {
    justify-content: start;
    align-content: start;
    padding-left: 24px;
    gap: 16px;
    width: 100%;
    grid-template-columns: 100%;
  }

  .menu :global(a.button):active {
    color: var(--white);
    background-color: var(--mid-blue);
  }
</style>
