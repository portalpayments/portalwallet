<script type="ts">
  import Backdrop from "./Backdrop.svelte";
  import { Link } from "svelte-navigator";
  let show = true;
  export let buttonType: string;

  const clicked = () => {
    return (show = false);
  };
</script>

<Backdrop {show} />
<div
  class="modal"
  style="
    transform: {show ? 'translateY(0)' : 'translateY(-100vh)'};
    opacity: {show ? '1' : '0'};"
>
  <div class="modalContents">
    <div class="closeButton">
      {#if buttonType == "transfer"}
        <Link to="/" on:click={clicked}>x</Link>
      {:else if buttonType == "requestVerification"}
        <button on:click={clicked}>x</button>
      {/if}
    </div>
    <div class="infocard"><slot /></div>
  </div>
</div>

<style>
  .modal {
    position: fixed;
    z-index: 500;
    background-color: #fff;
    width: 250px;
    min-height: 225px;
    justify-self: center;
    display: grid;
    padding: 5px 0px 30px 0px;
    box-sizing: border-box;
    transition: all 0.3s ease-out;
    border-radius: 7px;
  }

  .closeButton {
    align-self: start;
    justify-self: end;
    font-size: 1rem;
  }

  .closeButton > :global(a) {
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
  .modalContents {
    display: grid;
    grid-auto-flow: row;
    grid-template-rows: 20px 1fr;
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .infocard {
    display: block;
    width: 85%;
    height: auto;
    align-self: center;
    justify-self: center;
  }
</style>
