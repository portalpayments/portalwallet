<script lang="ts">
  import TransactionsHeading from "./TransactionsHeading.svelte";
  import Balance from "./Balance.svelte";
  import Transactions from "./Transactions.svelte";
  import MoneyUtils from "./moneyUtils.svelte";

  import type { Connection } from "@solana/web3.js";

  import proteinLand from "../../assets/ProfilePics/proteinland.svg";
  import john from "../../assets/ProfilePics/john.png";
  import jane from "../../assets/ProfilePics/jane.png";

  import { log, stringify } from "../../../../src/functions";

  log(`hello from functions`);

  import {
    connect,
    getUSDCAccounts,
    getKeypairFromString,
  } from "../../../../src/vmwallet";

  let connection: null | Connection = null;
  let major: string | null = null;
  let minor: string | null = null;
  (async () => {
    connection = await connect("mainNetBeta");

    log(`Connected`);
    const keyPair = await getKeypairFromString("A PRIVATE KEY GOES HERE");
    const usdcAccounts = await getUSDCAccounts(connection, keyPair.publicKey);

    const JUST_ONE_SUPPORTED_USDC_ACCOUNT_FOR_NOW = 0;
    const usdcAccount = usdcAccounts[JUST_ONE_SUPPORTED_USDC_ACCOUNT_FOR_NOW];

    const balanceString =
      usdcAccount.account.data.parsed.info.tokenAmount.uiAmountString;
    major = balanceString.split(".")[0];
    minor = balanceString.split(".")[1].slice(0, 2);
    log(stringify(usdcAccounts));
  })();

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

<Balance {major} {minor} />
<MoneyUtils />
<TransactionsHeading />
<Transactions {transactions} />

<style>
</style>
