<script lang="ts">
  import { Link } from "svelte-navigator";

  export let showCloseButton = false;
</script>

<div class="modal">
  <slot />
  {#if showCloseButton}
    <Link to={"/"}>Got it</Link>
  {/if}
</div>

<style lang="scss">
  @import "../../mixins.scss";
  .modal {
    z-index: 500;
    width: var(--wallet-width);
    height: var(--wallet-height);
    position: fixed;
    top: 0;

    background-color: var(--white);

    padding: 12px;
    gap: 24px;

    grid-auto-flow: row;
    align-content: center;
    justify-content: center;

    display: grid;
  }

  .modal :global(a) {
    color: white;
    font-weight: 600;
    padding: 6px 24px;
    height: 42px;
    border-radius: 24px;
    font-size: 14px;
    background: var(--blue-green-gradient);

    display: grid;

    width: auto;
    align-self: center;
    align-content: center;
    justify-self: center;

    @include shadow;
  }
</style>
