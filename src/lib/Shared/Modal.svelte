<script lang="ts">
  import Backdrop from "./Backdrop.svelte";
  import { Link } from "svelte-navigator";
  let isOpen = true;
  export let buttonType: "transfer" | "requestVerification";

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
  <div class="close-button">
    {#if buttonType === "transfer"}
      <Link to="/" on:click={onCloseButtonClicked}>×</Link>
    {:else if buttonType === "requestVerification"}
      <button on:click={onCloseButtonClicked}>×</button>
    {/if}
  </div>
  <div class="card"><slot /></div>
</div>

<style>
  .modal {
    position: fixed;
    z-index: 500;
    background-color: #fff;
    width: 250px;
    justify-self: center;
    display: grid;
    padding: 24px 6px;
    box-sizing: border-box;
    transition: all 0.3s ease-out;
    border-radius: 6px;
    display: grid;
    grid-auto-flow: row;
    gap: 6px;
    /* eyeballing */
    top: 25%;
  }

  /* TODO - close buttons generally not used on mobile amnd this is too small */
  .close-button {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 1rem;
  }

  /* global needed for 'a' element under Link */
  .close-button > :global(a) {
    height: 12px;
    width: 12px;
    align-content: center;
    justify-content: center;
    background-color: transparent;
    font-weight: 600;
    color: #9d9d9d;
    display: grid;
  }

  button {
    background-color: transparent;
    font-weight: 600;
    color: #9d9d9d;
  }

  .card {
    display: grid;
    align-self: center;
    justify-self: center;
    justify-items: center;
  }
</style>
