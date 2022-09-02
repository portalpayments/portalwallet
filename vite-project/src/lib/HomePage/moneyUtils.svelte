<script lang="ts">
  import { Link } from "svelte-navigator";
</script>

<div class="MoneyUtilButtons">
  <Link class="link" to="/addMoneyToAccount">add money</Link>
  <Link class="link" to="/transferMoney">transfer</Link>
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
</style>
