<script type="ts">
  console.log("Hello from transactions component");

  interface Transaction {
    image: string;
    name: string;
    isPositive: boolean;
    amountMajor: number;
    amountMinor: number;
  }

  // Promise<Array<Transactions>>

  export let transactions: Array<Transaction>;
</script>

<div class="transactions">
  {#each transactions as transaction, index}
    <div class="transaction">
      <img src={transaction.image} alt="" />
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
    gap: 0;
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
