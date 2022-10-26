<script lang="ts">
  import { Link } from "svelte-navigator";
  import { walletBalanceAccount } from "../stores";
  import usdcIconURL from "../../assets/Icons/usdc-coin.svg";
  import solIconURL from "../../assets/Icons/solana-coin.svg";
  import closeIconURL from "../../assets/Icons/close.svg";
  import settingsIconURL from "../../assets/Icons/settings.svg";
  import type { Contact as ContactType } from "../types";
  import Contact from "../Shared/Contact.svelte";

  export let user: ContactType | null;

  export let isMenuActive: boolean;

  export let onClose: svelte.JSX.MouseEventHandler<HTMLButtonElement>;

  const toggleAccount = () => {
    $walletBalanceAccount.isShowingBalanceInSol =
      !$walletBalanceAccount.isShowingBalanceInSol;
    isMenuActive = false;
  };
</script>

<div class="menu {isMenuActive ? 'active' : ''}">
  <button class="close" on:click={onClose}
    ><img src={closeIconURL} alt="close" /></button
  >

  <div class="tokens">
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
  </div>
  <div class="accounts">
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

  .menu .tokens {
    justify-content: start;
    align-content: start;
    padding-top: 24px;
    width: 100%;
    grid-template-columns: 100%;
  }

  .tokens button.with-icon:last-of-type {
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

  .accounts {
    align-content: end;
  }

  .accounts button {
    color: var(--actually-dark-grey);
    background-color: var(--very-very-light-grey);
  }
</style>
