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

  /* TODO: fix global CSS styles */
  .link > :global(a) {
    text-decoration: none;
  }
  :global(a) {
    color: #2775c9;
    font-weight: 600;
    background-color: #419cfd33;
    padding: 7px 0px;
    border-radius: 8px;
    font-size: 1.1rem;
  }

  :global(a) {
    text-decoration: none;
  }
  :global(a):visited {
    text-decoration: none;
  }
  :global(a):hover {
    text-decoration: none;
  }
  :global(a):active {
    text-decoration: none;
    color: #fff;
    background-color: #419cfd;
  }
</style>
