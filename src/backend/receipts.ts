// From https://docs.dialect.to/documentation/messaging/typescript/configuration
import {
  Dialect,
  DialectSdk,
  ThreadId,
  type DialectCloudEnvironment,
  type FindThreadByIdQuery,
  type FindThreadByOtherMemberQuery,
  type ThreadMessage,
  type ThreadSummary,
} from "@dialectlabs/sdk";
import {
  SolanaSdkFactory,
  NodeDialectSolanaWalletAdapter,
  type Solana,
} from "@dialectlabs/blockchain-sdk-solana";
import type { Keypair } from "@solana/web3.js";
import { MINUTE, SECONDS } from "./constants";

const RECEIPT_DELAY = 15 * SECONDS;

import { log, stringify } from "./functions";
import * as http from "../lib/http-client";
import type { RawDecafReceipt } from "./types";
import type { ReceiptSummary, TransactionSummary } from "src/lib/types";
import { receiptHTMLToObject } from "./html-extract";

const memoRegex = /[A-Za-z0-9]{20}/;

const DECAF_POINT_OF_SALE = "dcafKdWLATod3BLRngsqZ7CrQwcrUxrLjFWYJwYP1Fy";

let dialectSDK: DialectSdk<Solana> | null = null;

// In future: Decaf's dialect messages will contain the transaction ID
// Additionally the transaction doesn't contain anything we can find in the message
// (since Decaf's point of sale system uses a diffeent Sol account)

// Right now they do not - so we can just use the time to match the purchase.
// Sol transaction: Nov 5, 2022 at 20:10:02
// Decaf Dialect message: "2022-11-05T20:10:08.957Z"
export const getDialect = (keyPair: Keypair) => {
  if (dialectSDK) {
    return dialectSDK;
  }
  const environment: DialectCloudEnvironment = "production";
  dialectSDK = Dialect.sdk(
    {
      environment,
    },
    SolanaSdkFactory.create({
      wallet: NodeDialectSolanaWalletAdapter.create(keyPair),
    })
  );
  return dialectSDK;
};

export const checkIfTransactionSummaryHasReceipt = (
  transactionMemo: string
) => {
  if (transactionMemo.match(memoRegex)) {
    return true;
  }
  return false;
};

export const getDecafReceiptMessage = async (
  keyPair: Keypair,
  transactionDate: number
) => {
  // https://docs.dialect.to/documentation/messaging/typescript/getting-creating-and-deleting-threads
  // Call the messages() method to read messages
  const dialectSDK = getDialect(keyPair);

  const decafThread = await dialectSDK.threads.find({
    otherMembers: [DECAF_POINT_OF_SALE],
  });

  // Fetch for a single thread by its id. N.b. the ThreadId type specifies both the address of the thread *as well as* the specified backend; threads of a given id may exist in any kind of backend. See the ThreadId type.
  const query: FindThreadByIdQuery = {
    id: decafThread.id,
  };
  const thread = await dialectSDK.threads.find(query);
  // Call the messages() method to read messages
  const messages = await thread.messages();

  const receiptMessages = messages.filter((message) => {
    const hasReceipt = message.text.includes("You can find your receipt");
    const time = new Date(message.timestamp).valueOf();
    const timeIsRight = Math.abs(transactionDate - time) < RECEIPT_DELAY;
    return hasReceipt && timeIsRight;
  });

  if (receiptMessages.length < 1) {
    return null;
  }

  return receiptMessages[0];
};

export const getRawReceiptFromMessage = async (message: ThreadMessage) => {
  const url = message.text.split(": ").at(-1).trim();

  // https://www.decaf.so/receipt/XgVU1qK4i4zXKanjHZpr
  // http://localhost:8010/proxy/receipt/XgVU1qK4i4zXKanjHZpr

  const corsProxyURL = url.replace(
    `https://www.decaf.so`,
    `http://localhost:8010/proxy`
  );

  const html = await http.get(corsProxyURL, "text/html");

  let receipt = receiptHTMLToObject(html);
  return receipt;
};

export const getReceiptSummaryFromRawReceipt = (
  rawReceipt: RawDecafReceipt
): ReceiptSummary => {
  const interestingData = rawReceipt.props.pageProps;
  return {
    items: interestingData.order.items.map((item) => {
      // Our sample item looks like 'Solana | Not Financial Advice Tee' - euw.
      const cleanedProductName = item.productName.split("|").at(-1).trim();
      const quantity = item.orderQuantity;
      const price = item.unitPrice;
      return {
        quantity,
        name: cleanedProductName,
        price,
      };
    }),
    shop: interestingData.shop.name,
  };
};

export const getReceiptForTransactionSummary = async (
  keyPair: Keypair,
  transactionMemo: string,
  transactionDate: number
): Promise<ReceiptSummary> => {
  if (!transactionMemo) {
    return null;
  }
  const hasReceipt = checkIfTransactionSummaryHasReceipt(transactionMemo);

  if (!hasReceipt) {
    return null;
  }
  const decafReceiptMessage = await getDecafReceiptMessage(
    keyPair,
    transactionDate
  );
  const rawReceipt = await getRawReceiptFromMessage(decafReceiptMessage);
  const receiptSummary = getReceiptSummaryFromRawReceipt(rawReceipt);

  return receiptSummary;
};
