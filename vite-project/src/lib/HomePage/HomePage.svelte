<script lang="ts">
  import TransactionsHeading from "./TransactionsHeading.svelte";
  import Balance from "./Balance.svelte";
  import Transactions from "./Transactions.svelte";
  import MoneyUtils from "./moneyUtils.svelte";

  import ewan from "../../assets/ewan.png";
  import proteinLand from "../../assets/proteinland.svg";
  import john from "../../assets/john.png";
  import jane from "../../assets/jane.png";
  import anonymousImageUrl from "../../assets/anonymous.svg";

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

  let currentFeature: number | string = "";
</script>

<Balance major="2900" minor="27" />
<MoneyUtils />
<TransactionsHeading />
<Transactions {transactions} />

<style>
  h1 {
    font-size: 12px;
  }
</style>
