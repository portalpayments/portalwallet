<script lang="ts">
  import Checkmark from "../../assets/Checkmark.svg";
  import { authStore } from "../stores";
  import { Link } from "svelte-navigator";
  import { walletBalanceAccount } from "../stores";
  import usdcSymbolURL from "../../assets/usdc.svg";
  import solSymbolURL from "../../assets/solana.svg";

  export let name = "anonymous";
  export let isVerified = false;

  let isDropdownActive = false;

  const toggleAccount = () => {
    $walletBalanceAccount.isShowingBalanceInSol =
      !$walletBalanceAccount.isShowingBalanceInSol;
    isDropdownActive = !isDropdownActive;
  };

  const logout = function () {
    $authStore.isLoggedIn = false;
    location.assign("/");
  };
</script>

<div class="header">
  <button
    class={!isDropdownActive ? "drop-button" : "drop-button-active "}
    on:click={() => (isDropdownActive = !isDropdownActive)}
  >
    {name}
    {#if isVerified}
      <img src={Checkmark} alt="Verified" />
    {/if}
  </button>
  <div class="menu {isDropdownActive ? 'active' : ''}">
    <div class="common">
      <button
        class="button {$walletBalanceAccount.isShowingBalanceInSol && 'active'}"
        on:click={toggleAccount}
      >
        <img src={usdcSymbolURL} alt="USDC logo" />USDC account</button
      >
      <button
        class="button {$walletBalanceAccount.isShowingBalanceInSol || 'active'}"
        on:click={toggleAccount}
      >
        <img src={solSymbolURL} alt="Sol logo" />
        Sol account
      </button>
      <Link class="button" to="/settings">Settings</Link>
    </div>
    <button type="button" on:click|preventDefault={logout} class="logout"
      >Log out</button
    >
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
  .drop-button {
    background: rgba(61, 101, 245, 0.2);
    padding: 5px 10px 5px 10px;
    border-radius: 21px;
    color: var(--dark-blue);
    cursor: pointer;
    font-weight: 600;
    border: 0;
  }
  .drop-button > img {
    width: 18px;
    height: 18px;
    vertical-align: middle;
  }

  /* From https://www.w3schools.com/howto/howto_js_dropdown.asp*/

  .drop-button-active {
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
  .drop-button-active > img {
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
    text-align: left;
    padding: 8px;
    font-weight: 600;
    font-size: 16px;
    color: var(--white);
    background-color: transparent;
    padding: 8px;
  }

  .menu :global(a.button):active {
    color: var(--white);
    background-color: var(--mid-blue);
  }

  button.active {
    background-color: var(--very-light-grey);
  }

  button.logout {
    padding: 24px 0px 8px 0px;
    font-size: 1rem;
  }

  button img {
    width: 12px;
  }
</style>
