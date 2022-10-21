<script lang="ts">
  import Backdrop from "./Backdrop.svelte";
  let isOpen = true;

  const onCloseButtonClicked = () => {
    return (isOpen = false);
  };
</script>

<Backdrop show={isOpen} />
<div
  class="modal"
  style="
    transform: {isOpen ? 'translateY(0)' : 'translateY(-100vh)'};
    opacity: {isOpen ? '1' : '0'};"
>
  <slot />
</div>

<style>
  .modal {
    z-index: 500;
    background-color: #fff;
    width: var(--wallet-width);
    height: var(--wallet-height);
    padding: 12px;
    grid-auto-flow: row;
    gap: 6px;
    align-content: center;
  }
</style>
