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
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
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
import { log, stringify } from "./functions";

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
      date: 1663119635000,
      status: true,
      networkFee: 5000,
      direction: "sent",
      amount: 50,
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
      date: 1663120787000,
      status: true,
      networkFee: 5000,
      direction: "sent",
      amount: 50,
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
      date: 1663119635000,
      status: true,
      networkFee: 5000,
      direction: "recieved",
      amount: 50,
      from: MOCK_SENDER_PUBLIC_KEY,
      to: MOCK_RECIPIENT_PUBLIC_KEY,
    });
  });

  test(`We ignore a transaction doing of Mike sending himself some money`, () => {
    const portalTransactionSummary =
      transactionResponseToPortalTransactionSummary(
        mikeSendingHimselfMoneyTransaction,
        new PublicKey(MIKES_WALLET)
      );

    expect(portalTransactionSummary).toEqual(null);
  });

  test(`Mike sending Jared some lamports`, () => {
    const portalTransactionSummary =
      transactionResponseToPortalTransactionSummary(
        mikeSendingJaredSomeLamportsTransaction,
        new PublicKey(MIKES_WALLET)
      );

    expect(portalTransactionSummary).toEqual({
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
