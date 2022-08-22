<script lang="ts">
  import { Link } from "svelte-navigator";
</script>

<div class="MoneyUtilButtons">
  <!-- <button on:click={() => addMoney()}>add money</button> -->
  <Link class="link" to="/addMoneyToAccount">add money</Link>
  <Link class="link" to="/transferMoney">transfer money</Link>
  <!-- <button on:click={() => transferMoney()}>transfer</button> -->
</div>

<style>
  .MoneyUtilButtons {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 43% 43%;
    gap: 6px;
    justify-content: center;
    align-items: center;
  }
</style>
