<script lang="ts">
  import Checkmark from "../../assets/Checkmark.svg";
  import { authStore } from "../stores";
  import { Link } from "svelte-navigator";
  import { walletBalanceAccount } from "../stores";
  import usdcIconURL from "../../assets/Icons/usdc.svg";
  import solIconURL from "../../assets/Icons/solana.svg";
  import settingsIconURL from "../../assets/Icons/settings.svg";
  import helpIconURL from "../../assets/Icons/help.svg";
  import logoutIconURL from "../../assets/Icons/logout.svg";

  export let name = "anonymous";
  export let isVerified = false;

  let isMenuActive = false;

  const toggleAccount = () => {
    $walletBalanceAccount.isShowingBalanceInSol =
      !$walletBalanceAccount.isShowingBalanceInSol;
    isMenuActive = !isMenuActive;
  };

  const logout = function () {
    $authStore.isLoggedIn = false;
    location.assign("/");
  };
</script>

<div class="header">
  <button
    class={!isMenuActive ? "menu-button" : "menu-button-active "}
    on:click={() => (isMenuActive = !isMenuActive)}
  >
    {name}
    {#if isVerified}
      <img src={Checkmark} alt="Verified" />
    {/if}
  </button>
  <div class="menu {isMenuActive ? 'active' : ''}">
    <div class="common">
      <button
        type={$walletBalanceAccount.isShowingBalanceInSol ? "" : "active"}
        on:click={toggleAccount}
      >
        <img src={usdcIconURL} alt="USDC account" />USDC account</button
      >
      <button
        type="button"
        class={$walletBalanceAccount.isShowingBalanceInSol ? "active" : ""}
        on:click={toggleAccount}
      >
        <img src={solIconURL} alt="Sol account" />
        Sol account
      </button>
      <Link class="button" to="/settings">
        <img src={settingsIconURL} alt="Settings" />
        Settings
      </Link>
      <Link class="button" to="mailto:info@getportal.app">
        <img src={helpIconURL} alt="Help" />
        Help
      </Link>
    </div>
    <button type="button" on:click|preventDefault={logout} class="logout">
      <img src={logoutIconURL} alt="Log out" />
      Log out
    </button>
  </div>
</div>

<style>
  .header {
    display: grid;
    grid-auto-flow: column;
    padding: 0px 12px;
    align-items: center;
    justify-items: start;
    gap: 4px;
  }
  .menu-button {
    background: rgba(61, 101, 245, 0.2);
    padding: 5px 10px 5px 10px;
    border-radius: 21px;
    color: var(--dark-blue);
    cursor: pointer;
    font-weight: 600;
    border: 0;
  }
  .menu-button > img {
    width: 18px;
    height: 18px;
    vertical-align: middle;
  }

  /* From https://www.w3schools.com/howto/howto_js_dropdown.asp*/

  .menu-button-active {
    background: rgba(61, 101, 245, 0.2);
    padding: 5px 10px 5px 10px;
    border-radius: 14px;
    color: var(--dark-blue);
    font-weight: 600;
    border-bottom-right-radius: 0px;
    border-bottom-left-radius: 0px;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
    border: 0;
  }
  .menu-button-active > img {
    width: 18px;
    height: 18px;
    vertical-align: middle;
  }

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
    grid-auto-flow: row;
    color: var(--black);
    background-color: var(--white);
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
    z-index: 2;
    grid-template-rows: 1fr 48px;
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

  .menu :global(a.button),
  .menu button {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 12px 1fr;
    height: 48px;
    align-content: center;
    align-items: center;
    text-align: left;
    gap: 8px;
    font-weight: 600;
    font-size: 12px;
    color: var(--black);
    background-color: transparent;
    padding: 8px;
  }

  :global(a.button) img,
  button img {
    width: 12px;
  }

  .menu :global(a.button):active {
    color: var(--white);
    background-color: var(--mid-blue);
  }

  button.active {
    background-color: var(--very-light-grey);
  }

  button.logout {
    padding: 8px;
    font-size: 1rem;
    font-weight: 600;
    font-size: 12px;
    color: var(--black);
    align-content: end;
    background-color: transparent;
  }
</style>
