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

<div class="heading">
  {#if !haveAccountsLoaded || hasUSDCAccount === null}
    <div class="skeleton" />
  {:else}
    <Link to="/transactions">See all</Link>
  {/if}
</div>

<style lang="scss">
  @import "../../mixins.scss";

  .skeleton {
    width: 46px;
    height: 24px;
    @include skeleton-background;
  }

  .heading {
    justify-items: right;
    padding: 0 12px;
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    font-size: 0.9rem;
    text-transform: uppercase;
    font-weight: 600;
    color: #7d7d7d;
  }

  /* global is needed for 'a' element under .heading */
  .heading > :global(a) {
    text-align: right;
    justify-self: end;
    padding: 0;
    border: 0;
    width: fit-content;
    background-color: transparent;
    color: var(--mid-blue);
    font-weight: 600;
    text-transform: none;
    font-size: 0.9rem;
  }

  .heading :global(a):hover {
    color: var(--mid-blue);
  }
  .heading :global(a):active {
    color: var(--chalk-white);
  }
</style>
