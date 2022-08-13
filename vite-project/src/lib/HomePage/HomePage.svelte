<script lang="ts">
  import Badge from "./Badge.svelte";
  import TransactionsHeading from "./TransactionsHeading.svelte";
  import Balance from "./Balance.svelte";
  import Transactions from "./Transactions.svelte";
  import avatarImageUrl from "../../assets/avatar.png";
  import MoneyUtils from "./moneyUtils.svelte";

  const transactions = [
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
    {
      image: avatarImageUrl,
      name: "Jane Taylor",
      isPositive: false,
      amountMajor: 21,
      amountMinor: 25,
    },
  ];
</script>

<Balance major="2900" minor="27" />
<MoneyUtils />
<TransactionsHeading />
<Transactions {transactions} />
<!-- <Badge>Badge</Badge> -->

<!-- <div class="feature contacts">contacts</div>
      <div class="feature collectibles">collectibles</div> -->
<style>
  h1 {
    font-size: 12px;
  }
</style>
