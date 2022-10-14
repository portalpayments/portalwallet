<script lang="ts">
  import Checkmark from "../../assets/Checkmark.svg";
  import Lock from "../Lock/Lock.svelte";
  import { Link } from "svelte-navigator";
  import { walletBalanceAccount } from "../stores";
  export let name = "anonymous";
  export let isVerified = false;

  let isDropdownActive = false;

  const toggleAccount = () => {
    $walletBalanceAccount.isShowingBalanceInSol =
      !$walletBalanceAccount.isShowingBalanceInSol;
    isDropdownActive = !isDropdownActive;
  };
</script>

<div class="header">
  <div class="dropdown">
    <button
      class={!isDropdownActive ? "drop-button" : "drop-button-active "}
      on:click={() => (isDropdownActive = !isDropdownActive)}
    >
      {name}
      {#if isVerified}
        <img src={Checkmark} alt="Verified" />
      {/if}
    </button>
    <div class="dropdown-content {isDropdownActive ? 'active' : ''}">
      <div class="toolbar-button">
        {#if $walletBalanceAccount.isShowingBalanceInSol}
          <button class="button" on:click={toggleAccount}>USDC account</button>
        {:else}
          <button class="button" on:click={toggleAccount}>sol account</button>
        {/if}
        <Link class="button" to="/settings">settings</Link>
      </div>
      <Lock />
    </div>
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
    color: #2d5177;
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
    color: #2d5177;
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

  /* The container <div> - needed to position the dropdown content */
  .dropdown {
    position: relative;
    display: grid;
    height: 32px;
    font-size: 10pt;
    line-height: 10pt;
  }

  .dropdown-content {
    /* Hidden by Default */
    display: none;
    /* 32px from it's nearest positioned ancestor */
    position: absolute;
    top: 32px;

    width: 100%;
    border-bottom-right-radius: 14px;
    border-bottom-left-radius: 14px;
    background-color: #fff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    font-size: 1rem;
  }
  .dropdown-content.active {
    display: grid;
  }

  .toolbar-button :global(a.button) {
    color: #2d5177;
    font-weight: 600;
    padding: 8px 0px;
    font-size: 1rem;
  }
  .toolbar-button :global(a.button):active {
    color: #fff;
    background-color: var(--mid-blue);
  }
  button {
    color: #2d5177;
    font-weight: 600;
    padding: 8px 0px;
    font-size: 1rem;
    background-color: transparent;
  }
</style>
