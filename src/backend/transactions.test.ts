import { transactionResponseToPortalTransactionSummary } from "./transactions";
import {
  MOCK_SENDER_PUBLIC_KEY,
  MOCK_RECIPIENT_PUBLIC_KEY,
} from "./__mocks__/mocks";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  transactionResponseSenderComesFirst,
  transactionResponseSenderComesSecond,
} from "./__mocks__/mocks";

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
});
