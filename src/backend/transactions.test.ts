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
  sendingLamportsWithNoteTransaction,
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
import {
  JOHN_TESTUSER_DEMO_WALLET,
  MIKES_WALLET,
  YCOMBINATOR_DEMO_WALLET_FOR_JARED,
} from "./constants";
import {
  Currency,
  type TransactionsByDay,
  type TransactionSummary,
} from "../lib/types";
import { Direction } from "../lib/types";
import { hexToUtf8, log, stringify } from "./functions";
import { identityTokenIssuerPublicKeyString } from "../lib/constants";

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
      note: null,
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
      note: null,
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
      note: null,
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
      note: null,
    });
  });
});

describe(`grouping transactions`, () => {
  test(`grouping transactions`, () => {
    const transactionSummaries = [
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
        note: null,
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
        note: null,
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
        note: null,
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
        note: null,
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
        note: null,
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
        note: null,
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
        note: null,
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
        note: null,
      },
    ];

    const transactionsByDays = getTransactionsByDays(
      transactionSummaries,
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
            note: null,
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
            note: null,
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
            note: null,
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
            note: null,
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
            note: null,
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
            note: null,
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
            note: null,
          },
        ],
      },
    ]);
  });
});

describe(`notes`, () => {
  test(`We can read a raw note`, () => {
    // Copied from https://explorer.solana.com/tx/PdX96DWpeMRqjxP7tQHU7aVMkjongnQz7mmkLPmvtezvWoJzqnVfJpYu3xxmRWSTngKDQ9A7a4UP4s4Tj463jr4
    const note = hexToUtf8(
      `54657374206e6f746520746f20726563697069656e742066726f6d204d696b65`
    );
    expect(note).toEqual("Test note to recipient from Mike");
  });

  test(`We can extract a note out of a transaction`, async () => {
    const portalTransactionSummary =
      // TODO: 'as' shouldn't be necessary, we should tweak our test data
      transactionResponseToPortalTransactionSummary(
        sendingLamportsWithNoteTransaction as ParsedTransactionWithMeta,
        new PublicKey(JOHN_TESTUSER_DEMO_WALLET)
      );

    expect(portalTransactionSummary).toEqual({
      amount: 100000000,
      currency: 1,
      date: 1665584732000,
      direction: 1,
      from: "FSVgrW58amFmH91ZKBic686qVhHayMt3wS8bCpisUph9",
      id: "PdX96DWpeMRqjxP7tQHU7aVMkjongnQz7mmkLPmvtezvWoJzqnVfJpYu3xxmRWSTngKDQ9A7a4UP4s4Tj463jr4",
      networkFee: 5000,
      status: true,
      to: "8N7ek7FydYYt7GfhM8a3PLjj1dh9fTftdVLHnbJdThe7",
      note: "Test note to recipient from Mike",
    });
  });
});
