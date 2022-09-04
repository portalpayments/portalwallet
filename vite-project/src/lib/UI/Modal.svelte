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
  <div class="modal-contents">
    <div class="close-button">
      {#if buttonType === "transfer"}
        <Link to="/" on:click={onCloseButtonClicked}>×</Link>
      {:else if buttonType === "requestVerification"}
        <button on:click={onCloseButtonClicked}>×</button>
      {/if}
    </div>
    <div class="card"><slot /></div>
  </div>
</div>

<style>
  .modal {
    position: fixed;
    top: 200px;
    z-index: 500;
    background-color: #fff;
    width: 250px;
    min-height: 225px;
    max-height: 250px;
    justify-self: center;
    display: grid;
    padding: 5px 0px 30px 0px;
    box-sizing: border-box;
    transition: all 0.3s ease-out;
    border-radius: 7px;
  }

  .close-button {
    align-self: start;
    justify-self: end;
    font-size: 1rem;
  }

  /* global needed for 'a' element under Link */
  .close-button > :global(a) {
    background-color: transparent;
    font-weight: 600;
    color: #9d9d9d;
    padding-right: 5px;
  }

  button {
    background-color: transparent;
    font-weight: 600;
    color: #9d9d9d;
  }

  .modal-contents {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 20px 1fr;
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .card {
    display: block;
    width: 85%;
    height: auto;
    align-self: center;
    justify-self: center;
  }
</style>
