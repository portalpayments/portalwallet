<script>
  import avatarImageUrl from "../assets/avatar.png";
  console.log("Hello from transactions component");

  let transactions = [
    {
      image: avatarImageUrl,
      name: "John O'Hara",
      isPositive: true,
      amountMajor: 400,
      amountMinor: 0,
    },
    {
      image: avatarImageUrl,
      name: "ProteinLand",
      isPositive: false,
      amountMajor: 3,
      amountMinor: 50,
    },
    {
      image: avatarImageUrl,
      name: "Jane Taylor",
      isPositive: false,
      amountMajor: 21,
      amountMinor: 25,
    },
  ];
</script>

<div class="transactions">
  {#each transactions as transaction, index}
    <div class="transaction">
      <img src={transaction.image} alt="" />
      <div class="name">{transaction.name}</div>
      <div class="amount">
        {transaction.amountMajor}.{transaction.amountMinor}
      </div>
    </div>
  {/each}
</div>

<style>
  .transactions {
    display: grid;
    grid-auto-flow: row;
    border: 1px solid red;
    gap: 12px;
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
  }
</style>
