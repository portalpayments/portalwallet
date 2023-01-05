<script lang="ts">
  import { Link } from "svelte-navigator";
  import { haveAccountsLoadedStore, hasUSDCAccountStore } from "../stores";

  let haveAccountsLoaded: boolean = false;

  let hasUSDCAccount: boolean | null = null;

  hasUSDCAccountStore.subscribe((newValue) => {
    // Distinguish between null (we don't know) and false (we know, they don't have a USDC account)
    if (newValue !== null) {
      hasUSDCAccount = newValue;
    }
  });

  haveAccountsLoadedStore.subscribe((newValue) => {
    if (newValue !== null) {
      haveAccountsLoaded = newValue;
    }
  });
</script>

<div class="add-and-send-buttons">
  {#if !haveAccountsLoaded || hasUSDCAccount === null}
    <div class="skeleton" />
    <div class="skeleton" />
  {:else}
    <Link class="button" to="/addMoneyToAccount">Add money</Link>
    <Link class="button" to="/sendMoney">Send money</Link>
  {/if}
</div>

<style type="text/scss">
  @import "../../mixins.scss";

  @keyframes shine {
    to {
      background-position: 100% 0, /* move highlight to right */ 0 0;
    }
  }

  .skeleton {
    width: 100%;
    height: 15px;
    @include skeleton-background;
  }

  .add-and-send-buttons {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 40% 40%;
    gap: 6px;
    justify-content: center;
    align-items: center;
  }

  .add-and-send-buttons .skeleton,
  .add-and-send-buttons :global(a.button) {
    padding: 7px 0px;
    width: 120px;
    height: 38px;
    border-radius: 24px;
    @include shadow;
  }

  /* global is needed for 'a' element under Link */
  .add-and-send-buttons :global(a.button) {
    color: white;
    font-weight: 600;
    padding: 7px 0px;
    font-size: 14px;
    background: var(--blue-green-gradient);
  }
  .add-and-send-buttons :global(a.button):active {
    color: #fff;
    background-color: var(--mid-blue);
  }
</style>
