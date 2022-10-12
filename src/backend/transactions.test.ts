import {
  flip,
  getTransactionsByDays,
  transactionResponseToPortalTransactionSummary,
} from "./transactions";
import {
  MOCK_SENDER_PUBLIC_KEY,
  MOCK_RECIPIENT_PUBLIC_KEY,
  mikeSendingHimselfMoneyTransaction,
  mikeSendingJaredSomeLamportsTransaction,
} from "./__mocks__/mocks";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  type ParsedTransactionWithMeta,
} from "@solana/web3.js";
import {
  transactionResponseSenderComesFirst,
  transactionResponseSenderComesSecond,
} from "./__mocks__/mocks";
import { MIKES_WALLET, YCOMBINATOR_DEMO_WALLET_FOR_JARED } from "./constants";
import {
  Currency,
  type TransactionsByDay,
  type TransactionSummary,
} from "../lib/types";
import { Direction } from "../lib/types";
import { hexToUtf8, log, stringify } from "./functions";

// Quiet utils.log() during tests
jest.mock("./functions", () => ({
  ...jest.requireActual("./functions"),
  log: jest.fn(),
}));

describe(`transaction summaries`, () => {
  test(`We can produce a transaction summary from a pre-cooked transaction where the sender is first index`, async () => {
    const currentUserWallet = MOCK_SENDER_PUBLIC_KEY;

    const portalTransactionSummary =
      transactionResponseToPortalTransactionSummary(
        transactionResponseSenderComesFirst,
        new PublicKey(currentUserWallet)
      );

    expect(portalTransactionSummary).toEqual({
      id: "2PF9JkUYfARqWbxFv5fBNLK7VhQ9NTsSA5QYcUUNDTQZyX4JATE8TjnLBhoaMNsZ1F1ETUxmM8LUygqRUBtbhgFS",
      date: 1663119635000,
      status: true,
      networkFee: 5000,
      direction: Direction.sent,
      amount: 50,
      currency: Currency.USDC,
      from: MOCK_SENDER_PUBLIC_KEY,
      to: MOCK_RECIPIENT_PUBLIC_KEY,
    });
  });

  test(`We can produce a transaction summary from a pre-cooked transaction where the sender isn't first`, async () => {
    const currentUserWallet = MOCK_SENDER_PUBLIC_KEY;

    const portalTransactionSummary =
      transactionResponseToPortalTransactionSummary(
        // TODO: our logged transaction.message seems to be missing some properties - investigate - could just be typescript types not being up to date
        // @ts-ignore
        transactionResponseSenderComesSecond,
        new PublicKey(currentUserWallet)
      );

    expect(portalTransactionSummary).toEqual({
      id: "3VsPLbEgjT2YTGp6PWXBDDc6kMFd4UwLHNWWNzjvf1QMutAihtDYzmfUY6Wdr2MffBDmNhP1YPR681d9Y9CgXe2V",
      date: 1663120787000,
      status: true,
      networkFee: 5000,
      direction: Direction.sent,
      amount: 50,
      currency: Currency.USDC,
      from: MOCK_SENDER_PUBLIC_KEY,
      to: MOCK_RECIPIENT_PUBLIC_KEY,
    });
  });

  test(`We can produce a transaction summary from a pre-cooked transaction where the sender is first index from recipient's point of view`, async () => {
    const currentUserWallet = MOCK_RECIPIENT_PUBLIC_KEY;

    const portalTransactionSummary =
      transactionResponseToPortalTransactionSummary(
        // TODO: our logged transaction.message seems to be missing some properties - investigate - could just be typescript types not being up to date
        // @ts-ignore
        transactionResponseSenderComesFirst,
        new PublicKey(currentUserWallet)
      );

    expect(portalTransactionSummary).toEqual({
      id: "2PF9JkUYfARqWbxFv5fBNLK7VhQ9NTsSA5QYcUUNDTQZyX4JATE8TjnLBhoaMNsZ1F1ETUxmM8LUygqRUBtbhgFS",
      date: 1663119635000,
      status: true,
      networkFee: 5000,
      direction: Direction.recieved,
      amount: 50,
      currency: Currency.USDC,
      from: MOCK_SENDER_PUBLIC_KEY,
      to: MOCK_RECIPIENT_PUBLIC_KEY,
    });
  });

  test(`We ignore a transaction of Mike sending himself some money`, () => {
    const portalTransactionSummary =
      // TODO: 'as' shouldn't be necessary, we should tweak our test data
      transactionResponseToPortalTransactionSummary(
        mikeSendingHimselfMoneyTransaction as ParsedTransactionWithMeta,
        new PublicKey(MIKES_WALLET)
      );

    expect(portalTransactionSummary).toEqual(null);
  });

  test(`Mike sending Jared some lamports`, () => {
    const portalTransactionSummary =
      // TODO: 'as' shouldn't be necessary, we should tweak our test data
      transactionResponseToPortalTransactionSummary(
        mikeSendingJaredSomeLamportsTransaction as ParsedTransactionWithMeta,
        new PublicKey(MIKES_WALLET)
      );

    expect(portalTransactionSummary).toEqual({
      id: "5KKQASDKTxoViRWYzN7Rf8X9n3wiiNVztpgpNG1oyyZbkNiai1JVcD4rAV2XYzFPgRP4dXQv7A3Bku68UT4j2FZk",
      amount: 30000000,
      currency: 1,
      date: 1662733089000,
      direction: 0,
      from: MIKES_WALLET,
      networkFee: 5000,
      status: true,
      to: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
    });
  });
});

describe(`grouping transactions`, () => {
  test(`grouping transactions`, () => {
    const transactions = [
      {
        id: "1",
        date: 1662985498000,
        status: true,
        networkFee: 5000,
        direction: 0,
        amount: 1000000,
        currency: 0,
        from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
        to: "Adyu2gX2zmLmHbgAoiXe2n4egp6x8PS7EFAqcFvhqahz",
      },
      {
        id: "2",
        date: 1662741437000,
        status: true,
        networkFee: 5000,
        direction: 0,
        amount: 500000,
        currency: 0,
        from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
        to: "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG",
      },
      {
        id: "3",
        date: 1662733089000,
        status: true,
        networkFee: 5000,
        direction: 0,
        amount: 30000000,
        currency: 1,
        from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
        to: "Adyu2gX2zmLmHbgAoiXe2n4egp6x8PS7EFAqcFvhqahz",
      },
      {
        id: "4",
        date: 1662657138000,
        status: true,
        networkFee: 5000,
        direction: 0,
        amount: 70000,
        currency: 0,
        from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
        to: "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG",
      },
      {
        id: "5",
        date: 1662656099000,
        status: true,
        networkFee: 5000,
        direction: 0,
        amount: 210000,
        currency: 0,
        from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
        to: "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG",
      },
      {
        id: "6",
        date: 1662654222000,
        status: true,
        networkFee: 5000,
        direction: 0,
        amount: 230000,
        currency: 0,
        from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
        to: "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG",
      },
      {
        id: "7",
        date: 1662653886000,
        status: true,
        networkFee: 5000,
        direction: 0,
        amount: 210000,
        currency: 0,
        from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
        to: "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG",
      },
      {
        id: "8",
        date: 1662643371000,
        status: true,
        networkFee: 5000,
        direction: 0,
        amount: 70000,
        currency: 0,
        from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
        to: "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG",
      },
    ];

    const transactionsByDays = getTransactionsByDays(
      transactions,
      Currency.USDC
    );

    expect(transactionsByDays).toEqual([
      {
        isoDate: "2022-09-12",
        total: 1000000,
        transactions: [
          {
            id: "1",
            date: 1662985498000,
            status: true,
            networkFee: 5000,
            direction: 0,
            amount: 1000000,
            currency: 0,
            from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
            to: "Adyu2gX2zmLmHbgAoiXe2n4egp6x8PS7EFAqcFvhqahz",
          },
        ],
      },
      {
        isoDate: "2022-09-09",
        total: 500000,
        transactions: [
          {
            id: "2",
            date: 1662741437000,
            status: true,
            networkFee: 5000,
            direction: 0,
            amount: 500000,
            currency: 0,
            from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
            to: "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG",
          },
        ],
      },
      {
        isoDate: "2022-09-08",
        total: 790000,
        transactions: [
          {
            id: "4",
            date: 1662657138000,
            status: true,
            networkFee: 5000,
            direction: 0,
            amount: 70000,
            currency: 0,
            from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
            to: "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG",
          },
          {
            id: "5",
            date: 1662656099000,
            status: true,
            networkFee: 5000,
            direction: 0,
            amount: 210000,
            currency: 0,
            from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
            to: "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG",
          },
          {
            id: "6",
            date: 1662654222000,
            status: true,
            networkFee: 5000,
            direction: 0,
            amount: 230000,
            currency: 0,
            from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
            to: "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG",
          },
          {
            id: "7",
            date: 1662653886000,
            status: true,
            networkFee: 5000,
            direction: 0,
            amount: 210000,
            currency: 0,
            from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
            to: "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG",
          },
          {
            id: "8",
            date: 1662643371000,
            status: true,
            networkFee: 5000,
            direction: 0,
            amount: 70000,
            currency: 0,
            from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
            to: "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG",
          },
        ],
      },
    ]);
  });
});
