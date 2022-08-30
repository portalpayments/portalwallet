<script>
  import Backdrop from "./Backdrop.svelte";
  import { Circle } from "svelte-loading-spinners";
</script>

<Backdrop />
<div class="modal"><Circle color="#419cfd" /></div>

<style>
  .modal {
    position: fixed;
    z-index: 500;
    background-color: #fff;
    width: 40%;
    justify-self: center;
    display: grid;
    justify-content: center;
    align-items: center;
    padding: 50px;
    box-sizing: border-box;
    transition: all 0.3s ease-out;
    border-radius: 7px;
    overflow-x: hidden;
  }
</style>
