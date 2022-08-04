<script type="ts">
  console.log("Hello from transactions component");

  interface Transaction {
    image: string;
    name: string;
    isPositive: boolean;
    amountMajor: number;
    amountMinor: number;
  }

  export let transactions: Array<Transaction>;
</script>

<div class="transactions">
  {#each transactions as transaction}
    <div class="transaction">
      <img src={transaction.image} alt="wallet avatar" />
      <div class="name">{transaction.name}</div>
      <div class="amount {transaction.isPositive ? 'positive' : ''}">
        {transaction.isPositive ? "+" : ""}
        {transaction.amountMajor}.{transaction.amountMinor}
      </div>
    </div>
  {/each}
</div>

<style>
  :root {
    --bright-green: #33b275;
  }
  .transactions {
    display: grid;
    grid-auto-flow: row;
    padding: 0 12px;
  }

  .transaction {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: 42px 1fr 64px;
    align-items: center;
    gap: 4px;
  }

  .name {
    text-align: left;
  }

  .amount {
    text-align: right;
    font-weight: 600;
  }

  .positive {
    color: var(--bright-green);
  }
</style>
