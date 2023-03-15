// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import { getTransactionsByDays, summarizeTransaction } from "./transactions";
import {
  MOCK_SENDER_PUBLIC_KEY,
  MOCK_RECIPIENT_PUBLIC_KEY,
} from "./test-data/transactions/mocks";
import { PublicKey, type ParsedTransactionWithMeta } from "@solana/web3.js";
import {
  sendToExistingTokenAccountSenderComesFirst,
  sendToExistingTokenAccountSenderComesSecond,
} from "./test-data/transactions/sendToExistingTokenAccount";
import {
  EMPTY,
  GREGS_WALLET,
  HELIUS,
  JOHN_TESTUSER_DEMO_WALLET,
  JUPITER,
  MIKES_USDC_ACCOUNT,
  MIKES_WALLET,
  PORTAL_IDENTITY_TOKEN_ISSUER_WALLET,
  USDC_MAINNET_MINT_ACCOUNT,
  VAHEHS_WALLET,
  YCOMBINATOR_DEMO_WALLET_FOR_JARED,
} from "./constants";
import {
  type SimpleTransaction,
  Direction,
  type Contact,
} from "../backend/types";
import { hexToUtf8, log, stringify } from "./functions";
import { sendFiveUSDC } from "./test-data/transactions/sendFiveUSDC";
import { swapSolWithUSDCOnJupiter } from "./test-data/transactions/swapSolWithUSDC";
import { sendingMoneyToSelf } from "./test-data/transactions/sendingMoneyToSelf";
import {
  sendingSol,
  sendingSolWithMemo,
  sendingSolWithNote,
} from "./test-data/transactions/sendingSol";
import { sendingUSDH } from "./test-data/transactions/sendingUSDH";
import { makingLightShieldAccount } from "./test-data/transactions/makingLightShieldAccount";
import { getCurrencyBySymbol } from "./solana-functions";
import { multiSigTransaction } from "./test-data/transactions/multisig";

jest.mock("./functions");

const contacts: Array<Contact> = [
  {
    walletAddress: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
    isNew: false,
    isPending: false,
    verifiedClaims: {
      // Silly TS, have to treat this as the type "INDIVIDUAL" not a string
      type: "INDIVIDUAL" as "INDIVIDUAL",
      givenName: "Jared",
      familyName: "Friedman",
      imageUrl:
        "https://arweave.net/wthKTNtIJezFDl3uevmGfGLiYdZ-5IN5LlfvLJNWc9U",
    },
    profilePictureURL: null,
  },
];

const transactionSummaries: Array<SimpleTransaction> = [
  {
    id: "1",
    date: 1662985498000,
    status: true,
    networkFee: 5000,
    direction: 0,
    amount: 1000000,
    currency: getCurrencyBySymbol("USDC").mintAddress,
    from: MIKES_WALLET,
    to: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
    counterParty: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
    memo: null,
    receipt: null,
    swapAmount: null,
    swapCurrency: null,
    isMultisig: false,
  },
  {
    id: "2",
    date: 1662741437000,
    status: true,
    networkFee: 5000,
    direction: 0,
    amount: 500000,
    currency: getCurrencyBySymbol("USDC").mintAddress,
    from: MIKES_WALLET,
    to: VAHEHS_WALLET,
    counterParty: VAHEHS_WALLET,
    memo: null,
    receipt: null,
    swapAmount: null,
    swapCurrency: null,
    isMultisig: false,
  },
  // Sneaky sol transaction - we don't want to see this in our USDC transaction summary!
  {
    id: "3",
    date: 1662733089000,
    status: true,
    networkFee: 5000,
    direction: 0,
    amount: 30000000,
    currency: getCurrencyBySymbol("SOL").mintAddress,
    from: MIKES_WALLET,
    to: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
    counterParty: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
    memo: null,
    receipt: null,
    swapAmount: null,
    swapCurrency: null,
    isMultisig: false,
  },
  {
    id: "4",
    date: 1662657138000,
    status: true,
    networkFee: 5000,
    direction: 0,
    amount: 70000,
    currency: getCurrencyBySymbol("USDC").mintAddress,
    from: MIKES_WALLET,
    to: VAHEHS_WALLET,
    counterParty: VAHEHS_WALLET,
    memo: null,
    receipt: null,
    swapAmount: null,
    swapCurrency: null,
    isMultisig: false,
  },
  {
    id: "5",
    date: 1662656099000,
    status: true,
    networkFee: 5000,
    direction: 0,
    amount: 210000,
    currency: getCurrencyBySymbol("USDC").mintAddress,
    from: MIKES_WALLET,
    to: VAHEHS_WALLET,
    counterParty: VAHEHS_WALLET,
    memo: null,
    receipt: null,
    swapAmount: null,
    isMultisig: false,
    swapCurrency: null,
  },
  {
    id: "6",
    date: 1662654222000,
    status: true,
    networkFee: 5000,
    direction: 0,
    amount: 230000,
    currency: getCurrencyBySymbol("USDC").mintAddress,
    from: MIKES_WALLET,
    to: VAHEHS_WALLET,
    counterParty: VAHEHS_WALLET,
    memo: null,
    receipt: null,
    swapAmount: null,
    isMultisig: false,
    swapCurrency: null,
  },
  {
    id: "7",
    date: 1662653886000,
    status: true,
    networkFee: 5000,
    direction: 0,
    amount: 210000,
    currency: getCurrencyBySymbol("USDC").mintAddress,
    from: MIKES_WALLET,
    to: VAHEHS_WALLET,
    counterParty: VAHEHS_WALLET,
    memo: null,
    receipt: null,
    swapAmount: null,
    isMultisig: false,
    swapCurrency: null,
  },
  {
    id: "8",
    date: 1662643371000,
    status: true,
    networkFee: 5000,
    direction: 0,
    amount: 70000,
    currency: getCurrencyBySymbol("USDC").mintAddress,
    from: MIKES_WALLET,
    to: VAHEHS_WALLET,
    counterParty: VAHEHS_WALLET,
    memo: null,
    receipt: null,
    swapAmount: null,
    isMultisig: false,
    swapCurrency: null,
  },
];

describe(`transaction summaries`, () => {
  // Mike using Jupiter DEX, picking Orca, swapping some Sol for USDC
  test(`We can produce a transaction summary from making a Light Shield account without transfers`, async () => {
    const portalSimpleTransaction = await summarizeTransaction(
      // TODO: fix 'transaction.message.accountKeys' (is a string, should be something else)
      // in the demo transaction below
      // @ts-ignore
      makingLightShieldAccount,
      new PublicKey(MIKES_WALLET),
      null,
      false
    );

    expect(portalSimpleTransaction).toEqual({
      amount: 1572960,
      currency: null,
      date: 1673461335000,
      direction: null,
      from: null,
      id: "5egDQUg2pvuTyvdyEnUVmQg3zXr2ZrLWAC33rS7rDxmWJGuprohY8Bj25PAfpwyN3iT6KU5eFg9AojBgC1dRxsq8",
      memo: null,
      networkFee: 5000,
      receipt: null,
      swapAmount: null,
      swapCurrency: null,
      status: true,
      to: null,
      isMultisig: false,
      counterParty: null,
    });
  });

  test(`We can produce a transaction summary from a Squads Protocol multisig address`, async () => {
    const portalSimpleTransaction = await summarizeTransaction(
      // TODO: fix 'transaction.message.accountKeys' (is a string, should be something else)
      // in the demo transaction below
      // @ts-ignore
      multiSigTransaction,
      new PublicKey(MIKES_WALLET),
      null,
      false
    );

    log(stringify(portalSimpleTransaction));

    expect(portalSimpleTransaction).toEqual({
      id: "2ctGNBdXCVtNkKtcPNZqe2QtMxkCCU9fHU6HkHwKraf2YEgK3Adfbd9pb2CifvKfys5apJSSrUP9W4LbRjUpmjc8",
      date: 1678286935000,
      status: true,
      networkFee: 5000,
      direction: 1,
      amount: 200000000,
      currency: USDC_MAINNET_MINT_ACCOUNT,
      from: HELIUS,
      to: MIKES_WALLET,
      counterParty: HELIUS,
      memo: null,
      receipt: null,
      swapAmount: null,
      isMultisig: true,
      swapCurrency: null,
    });
  });

  // Mike using Jupiter DEX, picking Orca, swapping some Sol for USDC
  test(`We can produce a transaction summary from swapping Sol for USDC on Jupiter`, async () => {
    const portalSimpleTransaction = await summarizeTransaction(
      // TODO: fix 'transaction.message.accountKeys' (is a string, should be something else)
      // in the demo transaction below
      // @ts-ignore
      swapSolWithUSDCOnJupiter,
      new PublicKey(MIKES_WALLET),
      null,
      false
    );

    expect(portalSimpleTransaction).toEqual({
      amount: 32903572,
      currency: getCurrencyBySymbol("WSOL").mintAddress,
      date: 1673260796000,
      direction: Direction.swapped,
      from: MIKES_WALLET,
      id: "4SBiyR6rrie4M78S2dLQjkcb8Ja1mFmuAL4furw5NcpKZkYjsC31EWtycLY3WdatngkiLPEqGwTPncAg41fQATFW",
      memo: null,
      networkFee: 5000,
      receipt: null,
      swapAmount: 2000000000,
      swapCurrency: getCurrencyBySymbol("SOL").mintAddress,
      status: true,
      to: MIKES_WALLET,
      isMultisig: false,
      counterParty: JUPITER,
    });
  });

  // Mike sending CnBEqiUpz9iK45GTsfu3Ckgp9jnjpoCNrRjSPSdQbqGs with glow
  test(`We can produce a transaction summary from us sending someone money with glow`, async () => {
    const portalSimpleTransaction = await summarizeTransaction(
      // TODO: fix 'transaction.message.accountKeys' (is a string, should be something else)
      // in the demo transaction below
      // @ts-ignore
      sendFiveUSDC,
      new PublicKey(MIKES_WALLET),
      null,
      false
    );

    expect(portalSimpleTransaction).toEqual({
      id: "5e9xViaBigEX6G17PvHt9AizyJwRBHPdxCEkz2eLRYsanr53567SHzULhYT6zk63vbsZ4puN3WY7i5774HS7CneZ",
      date: 1669052844000,
      status: true,
      networkFee: 5000,
      direction: 0,
      amount: 5000000,
      currency: getCurrencyBySymbol("USDC").mintAddress,
      from: MIKES_WALLET,
      to: GREGS_WALLET,
      counterParty: GREGS_WALLET,
      memo: "Hey Greg! 🙋🏻‍♂️",
      receipt: null,
      swapAmount: null,
      isMultisig: false,
      swapCurrency: null,
    });
  });

  test(`We can produce a transaction summary from Mike sending Greg money with glow, from Greg's perspective`, async () => {
    // Same transaction as before but with perspective shifted to greg
    const portalSimpleTransaction = await summarizeTransaction(
      // TODO: fix 'transaction.message.accountKeys' (is a string, should be something else)
      // in the demo transaction below
      // @ts-ignore
      sendFiveUSDC,
      new PublicKey(GREGS_WALLET)
    );

    expect(portalSimpleTransaction).toEqual({
      id: "5e9xViaBigEX6G17PvHt9AizyJwRBHPdxCEkz2eLRYsanr53567SHzULhYT6zk63vbsZ4puN3WY7i5774HS7CneZ",
      date: 1669052844000,
      status: true,
      networkFee: 5000,
      direction: 1,
      amount: 5000000,
      currency: getCurrencyBySymbol("USDC").mintAddress,
      from: MIKES_WALLET,
      to: GREGS_WALLET,
      counterParty: MIKES_WALLET,
      memo: "Hey Greg! 🙋🏻‍♂️",
      receipt: null,
      swapAmount: null,
      isMultisig: false,
      swapCurrency: null,
    });
  });

  test(`We can produce a transaction summary from someone sending us USDH`, async () => {
    // Same transaction as before but with perspective shifted to greg
    const portalSimpleTransaction = await summarizeTransaction(
      // TODO: fix 'transaction.message.accountKeys' (is a string, should be something else)
      // in the demo transaction below
      // @ts-ignore
      sendingUSDH,
      new PublicKey(MIKES_WALLET)
    );

    expect(portalSimpleTransaction).toEqual({
      id: "4gknQh12svZHqrZN9sKCHetaP87TbPns6pd83jknZPA3vEjN7jQ53sA3xpVs7ZH2oeCKnjrgHDqVMMxf3vBMoTwz",
      amount: 1000000,
      currency: getCurrencyBySymbol("USDH").mintAddress,
      date: 1667306128000,
      direction: 1,
      from: "BfkRD3gGQGLjHxUw7oqhizkaxrDrw7itHT98f9j2gh6t",
      memo: null,
      networkFee: 10000,
      receipt: null,
      swapAmount: null,
      swapCurrency: null,
      status: true,
      to: MIKES_WALLET,
      isMultisig: false,
      counterParty: "BfkRD3gGQGLjHxUw7oqhizkaxrDrw7itHT98f9j2gh6t",
    });
  });

  // 'USDC' on our local environment is just a token mint account we make
  const getFakeMintToCurrencyMapFromTestTransaction = (
    rawTransaction: ParsedTransactionWithMeta
  ) => {
    const fakeUSDCTokenAccount = rawTransaction.meta.preTokenBalances[0].mint;
    const fakeMintToCurrencyMap = {
      [fakeUSDCTokenAccount]: {
        id: getCurrencyBySymbol("USDC").mintAddress,
        name: "USDC local testing",
        decimals: 6,
        mintAddress: "fakeUSDCLocalTestAddress",
        symbol: "USDC",
        logo: "usdc.svg",
      },
    };
    return fakeMintToCurrencyMap;
  };

  test(`We can produce a transaction summary from a pre-cooked transaction where the sender is first`, async () => {
    const currentUserWallet = MOCK_SENDER_PUBLIC_KEY;

    const fakeMintToCurrencyMap = getFakeMintToCurrencyMapFromTestTransaction(
      sendToExistingTokenAccountSenderComesFirst
    );

    const portalSimpleTransaction = await summarizeTransaction(
      sendToExistingTokenAccountSenderComesFirst,
      new PublicKey(currentUserWallet),
      fakeMintToCurrencyMap
    );

    expect(portalSimpleTransaction).toEqual({
      id: "2PF9JkUYfARqWbxFv5fBNLK7VhQ9NTsSA5QYcUUNDTQZyX4JATE8TjnLBhoaMNsZ1F1ETUxmM8LUygqRUBtbhgFS",
      date: 1663119635000,
      status: true,
      networkFee: 5000,
      direction: Direction.sent,
      amount: 50,
      currency: "fakeUSDCLocalTestAddress",
      from: MOCK_SENDER_PUBLIC_KEY,
      to: MOCK_RECIPIENT_PUBLIC_KEY,
      counterParty: MOCK_RECIPIENT_PUBLIC_KEY,
      memo: null,
      receipt: null,
      swapAmount: null,
      isMultisig: false,
      swapCurrency: null,
    });
  });

  test(`We can produce a transaction summary from a pre-cooked transaction where the sender isn't first`, async () => {
    const currentUserWallet = MOCK_SENDER_PUBLIC_KEY;

    const fakeMintToCurrencyMap = getFakeMintToCurrencyMapFromTestTransaction(
      sendToExistingTokenAccountSenderComesSecond
    );
    const portalSimpleTransaction = await summarizeTransaction(
      // TODO: our logged transaction.message seems to be missing some properties - investigate - could just be typescript types not being up to date
      // @ts-ignore
      sendToExistingTokenAccountSenderComesSecond,
      new PublicKey(currentUserWallet),
      fakeMintToCurrencyMap
    );

    expect(portalSimpleTransaction).toEqual({
      id: "3VsPLbEgjT2YTGp6PWXBDDc6kMFd4UwLHNWWNzjvf1QMutAihtDYzmfUY6Wdr2MffBDmNhP1YPR681d9Y9CgXe2V",
      date: 1663120787000,
      status: true,
      networkFee: 5000,
      direction: Direction.sent,
      amount: 50,
      currency: "fakeUSDCLocalTestAddress",
      from: MOCK_SENDER_PUBLIC_KEY,
      to: MOCK_RECIPIENT_PUBLIC_KEY,
      counterParty: MOCK_RECIPIENT_PUBLIC_KEY,
      memo: null,
      receipt: null,
      swapAmount: null,
      isMultisig: false,
      swapCurrency: null,
    });
  });

  test(`We can produce a transaction summary from a pre-cooked transaction where the sender is first index from recipient's point of view`, async () => {
    const currentUserWallet = MOCK_RECIPIENT_PUBLIC_KEY;

    const fakeMintToCurrencyMap = getFakeMintToCurrencyMapFromTestTransaction(
      sendToExistingTokenAccountSenderComesFirst
    );

    const portalSimpleTransaction = await summarizeTransaction(
      // TODO: our logged transaction.message seems to be missing some properties - investigate - could just be typescript types not being up to date
      // @ts-ignore
      sendToExistingTokenAccountSenderComesFirst,
      new PublicKey(currentUserWallet),
      fakeMintToCurrencyMap
    );

    expect(portalSimpleTransaction).toEqual({
      id: "2PF9JkUYfARqWbxFv5fBNLK7VhQ9NTsSA5QYcUUNDTQZyX4JATE8TjnLBhoaMNsZ1F1ETUxmM8LUygqRUBtbhgFS",
      date: 1663119635000,
      status: true,
      networkFee: 5000,
      direction: Direction.recieved,
      amount: 50,
      currency: "fakeUSDCLocalTestAddress",
      from: MOCK_SENDER_PUBLIC_KEY,
      to: MOCK_RECIPIENT_PUBLIC_KEY,
      counterParty: MOCK_SENDER_PUBLIC_KEY,
      memo: null,
      receipt: null,
      swapAmount: null,
      isMultisig: false,
      swapCurrency: null,
    });
  });

  test(`We ignore a transaction of Mike sending himself some money`, async () => {
    const portalSimpleTransaction =
      // TODO: 'as' shouldn't be necessary, we should tweak our test data
      await summarizeTransaction(
        sendingMoneyToSelf as ParsedTransactionWithMeta,
        new PublicKey(MIKES_WALLET)
      );

    expect(portalSimpleTransaction).toEqual(null);
  });

  test(`Mike sending Jared some lamports`, async () => {
    const portalSimpleTransaction =
      // TODO: 'as' shouldn't be necessary, we should tweak our test data
      await summarizeTransaction(
        sendingSol as ParsedTransactionWithMeta,
        new PublicKey(MIKES_WALLET)
      );

    expect(portalSimpleTransaction).toEqual({
      id: "5KKQASDKTxoViRWYzN7Rf8X9n3wiiNVztpgpNG1oyyZbkNiai1JVcD4rAV2XYzFPgRP4dXQv7A3Bku68UT4j2FZk",
      amount: 30000000,
      currency: getCurrencyBySymbol("SOL").mintAddress,
      date: 1662733089000,
      direction: 0,
      from: MIKES_WALLET,
      networkFee: 5000,
      status: true,
      to: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
      counterParty: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
      memo: null,
      receipt: null,
      swapAmount: null,
      isMultisig: false,
      swapCurrency: null,
    });
  });
});

describe(`grouping transactions`, () => {
  test(`grouping transactions`, () => {
    const transactionsByDays = getTransactionsByDays(
      transactionSummaries,
      contacts,
      EMPTY,
      getCurrencyBySymbol("USDC").decimals
    );

    expect(transactionsByDays).toEqual([
      {
        isoDate: "2022-09-12",
        totalSpending: 1000000,
        totalSpendingDisplay: "1.00",
        transactions: [
          {
            id: "1",
            date: 1662985498000,
            status: true,
            networkFee: 5000,
            direction: 0,
            amount: 1000000,
            currency: getCurrencyBySymbol("USDC").mintAddress,
            from: MIKES_WALLET,
            to: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
            counterParty: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
            memo: null,
            receipt: null,
            swapAmount: null,
            isMultisig: false,
            swapCurrency: null,
          },
        ],
      },
      {
        isoDate: "2022-09-09",
        totalSpending: 30500000,
        totalSpendingDisplay: "30.50",
        transactions: [
          {
            id: "2",
            date: 1662741437000,
            status: true,
            networkFee: 5000,
            direction: 0,
            amount: 500000,
            currency: getCurrencyBySymbol("USDC").mintAddress,
            from: MIKES_WALLET,
            to: VAHEHS_WALLET,
            counterParty: VAHEHS_WALLET,
            memo: null,
            receipt: null,
            swapAmount: null,
            isMultisig: false,
            swapCurrency: null,
          },
          {
            amount: 30000000,
            currency: getCurrencyBySymbol("SOL").mintAddress,
            date: 1662733089000,
            direction: 0,
            from: MIKES_WALLET,
            id: "3",
            memo: null,
            networkFee: 5000,
            receipt: null,
            swapAmount: null,
            swapCurrency: null,
            status: true,
            to: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
            isMultisig: false,
            counterParty: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
          },
        ],
      },
      {
        isoDate: "2022-09-08",
        totalSpending: 790000,
        totalSpendingDisplay: "0.79",
        transactions: [
          {
            id: "4",
            date: 1662657138000,
            status: true,
            networkFee: 5000,
            direction: 0,
            amount: 70000,
            currency: getCurrencyBySymbol("USDC").mintAddress,
            from: MIKES_WALLET,
            to: VAHEHS_WALLET,
            counterParty: VAHEHS_WALLET,
            memo: null,
            receipt: null,
            swapAmount: null,
            isMultisig: false,
            swapCurrency: null,
          },
          {
            id: "5",
            date: 1662656099000,
            status: true,
            networkFee: 5000,
            direction: 0,
            amount: 210000,
            currency: getCurrencyBySymbol("USDC").mintAddress,
            from: MIKES_WALLET,
            to: VAHEHS_WALLET,
            counterParty: VAHEHS_WALLET,
            memo: null,
            receipt: null,
            swapAmount: null,
            isMultisig: false,
            swapCurrency: null,
          },
          {
            id: "6",
            date: 1662654222000,
            status: true,
            networkFee: 5000,
            direction: 0,
            amount: 230000,
            currency: getCurrencyBySymbol("USDC").mintAddress,
            from: MIKES_WALLET,
            to: VAHEHS_WALLET,
            counterParty: VAHEHS_WALLET,
            memo: null,
            receipt: null,
            swapAmount: null,
            isMultisig: false,
            swapCurrency: null,
          },
          {
            id: "7",
            date: 1662653886000,
            status: true,
            networkFee: 5000,
            direction: 0,
            amount: 210000,
            currency: getCurrencyBySymbol("USDC").mintAddress,
            from: MIKES_WALLET,
            to: VAHEHS_WALLET,
            counterParty: VAHEHS_WALLET,
            memo: null,
            receipt: null,
            swapAmount: null,
            isMultisig: false,
            swapCurrency: null,
          },
          {
            id: "8",
            date: 1662643371000,
            status: true,
            networkFee: 5000,
            direction: 0,
            amount: 70000,
            currency: getCurrencyBySymbol("USDC").mintAddress,
            from: MIKES_WALLET,
            to: VAHEHS_WALLET,
            counterParty: VAHEHS_WALLET,
            memo: null,
            receipt: null,
            swapAmount: null,
            isMultisig: false,
            swapCurrency: null,
          },
        ],
      },
    ]);
  });

  test(`totals for days are accurate`, () => {
    const transactionSummaries = [
      {
        id: "utb9vY1PBesmc83vbGhnMf4rkhhSfKpNV5xkYcQ4yiHzyuXtvBE93UoKGzqCtKuuxk3QYCQ8NyDG713Rc9dcF3f",
        date: 1676650317000,
        status: true,
        networkFee: 6100,
        direction: 0,
        amount: 1000000,
        currency: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
        to: "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG",
        counterParty: "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG",
        memo: "Demo for Dialect",
        receipt: null,
        swapAmount: null,
        isMultisig: false,
        swapCurrency: null,
      },
      {
        id: "2kpSZHdX8N1xkVqoTMgQk6drC8SurFrAyi9WWHuNZXH5J9jTaFzTdv9NEDbLkKrdnx1e6WziNsXCwN9hc9u9FQvV",
        date: 1676647661000,
        status: true,
        networkFee: 5000,
        direction: 0,
        amount: 2000000000,
        currency: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
        to: "6LL1j2XDC8FNWLwYfBtwG1kEViuZw2tqdPg1TPa3ZcqH",
        counterParty: "6LL1j2XDC8FNWLwYfBtwG1kEViuZw2tqdPg1TPa3ZcqH",
        memo: "",
        receipt: null,
        swapAmount: null,
        isMultisig: false,
        swapCurrency: null,
      },
    ];
    const transactionsByDays = getTransactionsByDays(
      transactionSummaries,
      contacts,
      EMPTY,
      getCurrencyBySymbol("USDC").decimals
    );
    expect(transactionsByDays).toEqual([
      {
        isoDate: "2023-02-17",
        totalSpending: 2001000000,
        totalSpendingDisplay: "2001",
        transactions: [
          {
            amount: 1000000,
            counterParty: "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG",
            currency: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            date: 1676650317000,
            direction: 0,
            from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
            id: "utb9vY1PBesmc83vbGhnMf4rkhhSfKpNV5xkYcQ4yiHzyuXtvBE93UoKGzqCtKuuxk3QYCQ8NyDG713Rc9dcF3f",
            memo: "Demo for Dialect",
            networkFee: 6100,
            receipt: null,
            status: true,
            swapAmount: null,
            swapCurrency: null,
            isMultisig: false,
            to: "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG",
          },
          {
            amount: 2000000000,
            counterParty: "6LL1j2XDC8FNWLwYfBtwG1kEViuZw2tqdPg1TPa3ZcqH",
            currency: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            date: 1676647661000,
            direction: 0,
            from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
            id: "2kpSZHdX8N1xkVqoTMgQk6drC8SurFrAyi9WWHuNZXH5J9jTaFzTdv9NEDbLkKrdnx1e6WziNsXCwN9hc9u9FQvV",
            memo: "",
            networkFee: 5000,
            receipt: null,
            status: true,
            swapAmount: null,
            swapCurrency: null,
            isMultisig: false,
            to: "6LL1j2XDC8FNWLwYfBtwG1kEViuZw2tqdPg1TPa3ZcqH",
          },
        ],
      },
    ]);
  });

  test(`grouping transactions with a filter for Mike's wallet address`, () => {
    const transactionSummariesSmall = [
      {
        id: "1",
        date: 1662985498000,
        status: true,
        networkFee: 5000,
        direction: 0,
        amount: 1000000,
        currency: getCurrencyBySymbol("USDC").mintAddress,
        from: MIKES_WALLET,
        to: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
        counterParty: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
        memo: null,
        receipt: null,
        swapAmount: null,
        isMultisig: false,
        swapCurrency: null,
      },
    ];

    const transactionsByDays = getTransactionsByDays(
      transactionSummariesSmall,
      contacts,
      MIKES_WALLET,
      getCurrencyBySymbol("USDC").decimals
    );

    expect(transactionsByDays).toEqual([
      {
        isoDate: "2022-09-12",
        totalSpending: 1000000,
        totalSpendingDisplay: "1.00",
        transactions: [
          {
            id: "1",
            date: 1662985498000,
            status: true,
            networkFee: 5000,
            direction: 0,
            amount: 1000000,
            currency: getCurrencyBySymbol("USDC").mintAddress,
            from: MIKES_WALLET,
            to: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
            counterParty: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
            memo: null,
            receipt: null,
            swapAmount: null,
            isMultisig: false,
            swapCurrency: null,
          },
        ],
      },
    ]);
  });

  test(`grouping transactions with a filter for Jared's name`, () => {
    const transactionSummariesSmall = [
      {
        id: "1",
        date: 1662985498000,
        status: true,
        networkFee: 5000,
        direction: 0,
        amount: 1000000,
        currency: getCurrencyBySymbol("USDC").mintAddress,
        from: MIKES_WALLET,
        to: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
        counterParty: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
        memo: null,
        receipt: null,
        swapAmount: null,
        isMultisig: false,
        swapCurrency: null,
      },
    ];

    const transactionsByDays = getTransactionsByDays(
      transactionSummariesSmall,
      contacts,
      "jared",
      getCurrencyBySymbol("USDC").decimals
    );

    expect(transactionsByDays).toEqual([
      {
        isoDate: "2022-09-12",
        totalSpending: 1000000,
        totalSpendingDisplay: "1.00",
        transactions: [
          {
            id: "1",
            date: 1662985498000,
            status: true,
            networkFee: 5000,
            direction: 0,
            amount: 1000000,
            currency: getCurrencyBySymbol("USDC").mintAddress,
            from: MIKES_WALLET,
            to: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
            counterParty: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
            memo: null,
            receipt: null,
            swapAmount: null,
            swapCurrency: null,
            isMultisig: false,
          },
        ],
      },
    ]);
  });
});

describe(`memos and notes`, () => {
  test(`We can read a transaction with a memo`, async () => {
    const summary = await summarizeTransaction(
      // TODO: fix 'transaction.message.accountKeys' (is a string, should be something else)
      // in the demo transaction below
      // @ts-ignore
      sendingSolWithMemo,
      new PublicKey(MIKES_WALLET)
    );
    expect(summary).toEqual({
      amount: 210000,
      currency: getCurrencyBySymbol("USDC").mintAddress,
      date: 1665683493000,
      direction: 0,
      from: MIKES_WALLET,
      id: "3JRTJXcdu17Br4wFG2RmrYWyueEjHTQXPY8kt9rzM9AM7outauUNLcxAs5yjSFsEvaXbwa4fJVwPyG5srgK8cySM",
      memo: "basketball",
      networkFee: 5000,
      status: true,
      to: VAHEHS_WALLET,
      counterParty: VAHEHS_WALLET,
      receipt: null,
      swapAmount: null,
      swapCurrency: null,
      isMultisig: false,
    });
  });

  test(`We can read a raw note`, () => {
    // Copied from https://explorer.solana.com/tx/PdX96DWpeMRqjxP7tQHU7aVMkjongnQz7mmkLPmvtezvWoJzqnVfJpYu3xxmRWSTngKDQ9A7a4UP4s4Tj463jr4
    const note = hexToUtf8(
      `54657374206e6f746520746f20726563697069656e742066726f6d204d696b65`
    );
    expect(note).toEqual("Test note to recipient from Mike");
  });

  test(`We can extract a note out of a transaction`, async () => {
    const portalSimpleTransaction =
      // TODO: 'as' shouldn't be necessary, we should tweak our test data
      await summarizeTransaction(
        sendingSolWithNote as ParsedTransactionWithMeta,
        new PublicKey(JOHN_TESTUSER_DEMO_WALLET)
      );

    expect(portalSimpleTransaction).toEqual({
      amount: 100000000,
      currency: getCurrencyBySymbol("SOL").mintAddress,
      date: 1665584732000,
      direction: 1,
      from: PORTAL_IDENTITY_TOKEN_ISSUER_WALLET,
      id: "PdX96DWpeMRqjxP7tQHU7aVMkjongnQz7mmkLPmvtezvWoJzqnVfJpYu3xxmRWSTngKDQ9A7a4UP4s4Tj463jr4",
      networkFee: 5000,
      status: true,
      to: JOHN_TESTUSER_DEMO_WALLET,
      counterParty: PORTAL_IDENTITY_TOKEN_ISSUER_WALLET,
      memo: "Test note to recipient from Mike",
      receipt: null,
      swapAmount: null,
      swapCurrency: null,
      isMultisig: false,
    });
  });
});
