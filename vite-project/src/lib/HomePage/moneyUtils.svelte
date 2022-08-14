<script lang="ts">
  import { Link } from "svelte-navigator";
</script>

<div class="MoneyUtilButtons">
  <!-- <button on:click={() => addMoney()}>add money</button> -->
  <Link class="Link" to="/addMoneyToAccount">add money</Link>
  <Link to="/transferMoney">transfer money</Link>
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

  .Link > :global(a) {
    text-decoration: none;
  }
  :global(a) {
    color: #2775c9;
    font-weight: 600;
    background-color: #419cfd33;
    padding: 7px 0px;
    border-radius: 8px;
    font-size: 0.97rem;
  }

  :global(a):link {
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
