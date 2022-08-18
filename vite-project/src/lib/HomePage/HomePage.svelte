<script lang="ts">
  import TransactionsHeading from "./TransactionsHeading.svelte";
  import Balance from "./Balance.svelte";
  import Transactions from "./Transactions.svelte";
  import MoneyUtils from "./moneyUtils.svelte";

  import proteinLand from "../../assets/ProfilePics/proteinland.svg";
  import john from "../../assets/ProfilePics/john.png";
  import jane from "../../assets/ProfilePics/jane.png";

  const transactions = [
    {
      image: john,
      name: "John O'Hara",
      isPositive: true,
      amountMajor: 400,
      amountMinor: 0,
    },
    {
      image: proteinLand,
      name: "ProteinLand",
      isPositive: false,
      amountMajor: 3,
      amountMinor: 50,
    },
    {
      image: jane,
      name: "Jane Taylor",
      isPositive: false,
      amountMajor: 21,
      amountMinor: 25,
    },
    {
      image: john,
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

<style>
</style>
