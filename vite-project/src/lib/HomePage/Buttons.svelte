<script lang="ts">
  import { Link } from "svelte-navigator";
</script>

<div class="add-and-transfer-buttons">
  <Link class="button" to="/addMoneyToAccount">add money</Link>
  <Link class="button" to="/transferMoney">transfer</Link>
</div>

<style>
  .add-and-transfer-buttons {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 40% 40%;
    gap: 6px;
    justify-content: center;
    align-items: center;
  }

  /* global is needed for 'a' element under Link */
  .add-and-transfer-buttons :global(a.button) {
    color: white;
    font-weight: 600;
    padding: 7px 0px;
    font-size: 1.1rem;

    border-radius: 24px;
    background: linear-gradient(45deg, var(--mid-blue), var(--bright-green));
  }
  .add-and-transfer-buttons :global(a.button):active {
    color: #fff;
    background-color: #419cfd;
  }
</style>
