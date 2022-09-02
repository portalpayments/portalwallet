<script lang="ts">
  import { Link } from "svelte-navigator";
</script>

<div class="MoneyUtilButtons">
  <Link class="button" to="/addMoneyToAccount">add money</Link>
  <Link class="button" to="/transferMoney">transfer</Link>
</div>

<style>
  .MoneyUtilButtons {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 40% 40%;
    gap: 6px;
    justify-content: center;
    align-items: center;
  }

  /* global is needed for 'a' element under Link */
  :global(a.button) {
    color: #2775c9;
    font-weight: 600;
    background-color: #419cfd33;
    padding: 7px 0px;
    border-radius: 8px;
    font-size: 1.1rem;
  }
  :global(a.button):active {
    color: #fff;
    background-color: #419cfd;
  }
</style>
