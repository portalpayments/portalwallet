<script lang="ts">
  import { Link } from "svelte-navigator";
  const log = console.log;
  const addMoney = () => {
    window.location.assign("/addMoneyToAccount");
  };

  const transferMoney = () => {
    window.location.assign("/transferMoney");
  };
</script>

<div class="MoneyUtilButtons">
  <button on:click={() => addMoney()}>add money</button>
  <button on:click={() => transferMoney()}>transfer</button>
</div>

<style>
  .MoneyUtilButtons {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 40% 40%;
    gap: 10px;
    justify-content: center;
    align-items: center;
  }

  .MoneyUtilButtons button {
    color: #2775c9;
    font-weight: 600;
    background-color: #419cfd33;
    padding: 7px 0px;
    border-radius: 8px;
    font-size: 1.1rem;
  }

  .MoneyUtilButtons button:active {
    color: #fff;
    background-color: #419cfd;
  }
</style>
