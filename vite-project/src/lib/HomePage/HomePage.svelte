<script lang="ts">
  import TransactionsHeading from "./TransactionsHeading.svelte";
  import Balance from "./Balance.svelte";
  import Transactions from "./Transactions.svelte";
  import Buttons from "./Buttons.svelte";

  import { connectionStore, keyPairStore } from "../stores";
  import type { Connection, Keypair } from "@solana/web3.js";

  import { log, stringify } from "../../../../src/functions";

  log(`Homepage loading...`);

  import { getUSDCAccounts } from "../../../../src/vmwallet";

  import { formatUSDCBalanceString } from "../utils";

  let connection: Connection;
  let keypair: Keypair;

  const updateBalance = async () => {
    if (!connection) {
      return;
    }
    if (!keypair) {
      return;
    }
    log(`🔢 Keypair or connection have changed, updating balance`);

    usdcAccounts = await getUSDCAccounts(connection, keypair.publicKey);

    const JUST_ONE_SUPPORTED_USDC_ACCOUNT_FOR_NOW = 0;
    const usdcAccount = usdcAccounts[JUST_ONE_SUPPORTED_USDC_ACCOUNT_FOR_NOW];

    const balanceString =
      usdcAccount.account.data.parsed.info.tokenAmount.uiAmountString;
    [major, minor] = formatUSDCBalanceString(balanceString);
  };

  // Explicitly mark these values as reactive as they depend on other data
  // being updated (they're derived from usdcAccounts)
  let major: string | null;
  $: major = null;
  let minor: string | null;
  $: minor = null;
  $: usdcAccounts = [];

  connectionStore.subscribe((newValue) => {
    if (newValue) {
      connection = newValue;
      updateBalance();
    }
  });

  keyPairStore.subscribe((newValue) => {
    if (newValue) {
      keypair = newValue;
      updateBalance();
    }
  });
</script>

<Balance {major} {minor} />
<Buttons />
<TransactionsHeading />
<Transactions />
