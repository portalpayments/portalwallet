<script lang="ts">
  import TransactionsHeading from "./TransactionsHeading.svelte";
  import Balance from "./Balance.svelte";
  import Transactions from "./Transactions.svelte";
  import MoneyUtils from "./moneyUtils.svelte";

  import type { Connection, Keypair } from "@solana/web3.js";

  import proteinLand from "../../assets/ProfilePics/proteinland.svg";
  import john from "../../assets/ProfilePics/john.png";
  import jane from "../../assets/ProfilePics/jane.png";

  import { log, stringify } from "../../../../src/functions";

  log(`Homepage loading...`);

  import { getUSDCAccounts } from "../../../../src/vmwallet";

  import { formatUSDCBalanceString } from "../utils";

  const updateBalance = async () => {
    if (!keyPair) {
      log(`Keypair is blank!`, keyPair);
      return;
    }
    log(`Balance has updated`);

    usdcAccounts = await getUSDCAccounts(connection, keyPair.publicKey);

    const JUST_ONE_SUPPORTED_USDC_ACCOUNT_FOR_NOW = 0;
    const usdcAccount = usdcAccounts[JUST_ONE_SUPPORTED_USDC_ACCOUNT_FOR_NOW];

    const balanceString =
      usdcAccount.account.data.parsed.info.tokenAmount.uiAmountString;
    [major, minor] = formatUSDCBalanceString(balanceString);
  };

  export let connection: Connection;
  export let keyPair: Keypair;

  // Explicitly mark these values as reactive as they depend on other data
  // being updated (they're derived from usdcAccounts)
  let major: string | null;
  $: major = null && updateBalance();
  let minor: string | null;
  $: minor = null && updateBalance();
  $: usdcAccounts = [];
  $: usdcAccount = null && updateBalance();

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
