<script lang="ts">
  import { Link } from "svelte-navigator";
  import { walletBalanceAccount } from "../stores";
  import usdcIconURL from "../../assets/Icons/usdc.svg";
  import solIconURL from "../../assets/Icons/solana.svg";
  import settingsIconURL from "../../assets/Icons/settings.svg";
  import helpIconURL from "../../assets/Icons/help.svg";
  import logoutIconURL from "../../assets/Icons/logout.svg";

  import type { Contact as ContactType } from "../types";

  import Contact from "../Shared/Contact.svelte";

  import { authStore } from "../../lib/stores";

  export let user: ContactType | null;

  export let isMenuActive: boolean;

  export let onClose: svelte.JSX.MouseEventHandler<HTMLButtonElement>;

  const toggleAccount = () => {
    $walletBalanceAccount.isShowingBalanceInSol =
      !$walletBalanceAccount.isShowingBalanceInSol;
    isMenuActive = false;
  };

  const logout = function () {
    $authStore.isLoggedIn = false;
    location.assign("/");
  };
</script>

<div class="menu {isMenuActive ? 'active' : ''}">
  <button class="close" on:click={onClose}>×</button>

  <Contact contact={user} />

  <div class="common">
    <button
      type="button"
      class="with-icon {$walletBalanceAccount.isShowingBalanceInSol
        ? ''
        : 'active'}"
      on:click={toggleAccount}
    >
      <img src={usdcIconURL} alt="USDC account" />USDC account</button
    >
    <button
      type="button"
      class="with-icon {$walletBalanceAccount.isShowingBalanceInSol
        ? 'active'
        : ''}"
      on:click={toggleAccount}
    >
      <img src={solIconURL} alt="Sol account" />
      Sol account
    </button>
    <Link class="button with-icon" to="/settings">
      <img src={settingsIconURL} alt="Settings" />
      Settings
    </Link>
    <Link class="button with-icon" to="mailto:info@getportal.app">
      <img src={helpIconURL} alt="Help" />
      Help
    </Link>
  </div>
  <button
    type="button"
    class="logout with-icon"
    on:click|preventDefault={logout}
  >
    <img src={logoutIconURL} alt="Log out" />
    Log out
  </button>
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

    padding: 6px;
    grid-auto-flow: row;
    color: var(--black);
    background-color: var(--white);
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
    z-index: 2;
    grid-template-rows: 96px 1fr 48px;
  }

  .menu button.close {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 24px;
    background: transparent;
    color: var(--black);
  }

  /* On screen when active */
  .menu.active {
    transform: translateX(0);
  }

  .menu .common {
    justify-content: start;
    align-content: start;
    padding: 8px;
    width: 100%;
    gap: 8px;
  }

  button.with-icon,
  :global(a.button.with-icon) {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 16px 1fr;
    height: 48px;
    align-content: center;
    align-items: center;
    text-align: left;
    gap: 12px;
    font-weight: 600;
    font-size: 16px;
    color: var(--black);
    background-color: transparent;
    padding: 8px;
  }

  button.with-icon img,
  :global(a.button.with-icon) img {
    width: 16px;
  }

  .menu :global(a.button):active {
    color: var(--white);
    background-color: var(--mid-blue);
  }

  button.active {
    background-color: var(--very-light-grey);
  }
</style>
