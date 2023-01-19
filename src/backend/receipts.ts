// From https://docs.dialect.to/documentation/messaging/typescript/configuration
import type { FindThreadByIdQuery, ThreadMessage } from "@dialectlabs/sdk";
import type { Keypair } from "@solana/web3.js";
import { DECAF_APP, MINUTE, SECONDS } from "./constants";

const RECEIPT_DELAY = 15 * SECONDS;

import { log, stringify } from "./functions";
import * as http from "../lib/http-client";
import type { RawDecafReceipt } from "./types";
import type { ReceiptSummary, SimpleTransaction } from "src/backend/types";
import { receiptHTMLToObject } from "./html-extract";
import { getDialect, getMessagesForUser } from "./messaging";

const memoRegex = /[A-Za-z0-9]{20}/;

export const checkIfSimpleTransactionHasReceipt = (transactionMemo: string) => {
  if (transactionMemo.match(memoRegex)) {
    return true;
  }
  return false;
};

// In future: Decaf's dialect messages will contain the transaction ID
// Additionally the transaction doesn't contain anything we can find in the message
// (since Decaf's point of sale system uses a different Sol account)
// Right now they do not - so we can just use the time to match the purchase.
// Sol transaction: Nov 5, 2022 at 20:10:02
// Decaf Dialect message: "2022-11-05T20:10:08.957Z"
export const getDecafReceiptMessage = async (
  keyPair: Keypair,
  transactionDate: number
) => {
  const messages = await getMessagesForUser(keyPair, DECAF_APP);

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

export const getReceiptForSimpleTransaction = async (
  keyPair: Keypair,
  transactionMemo: string,
  transactionDate: number
): Promise<ReceiptSummary> => {
  if (!transactionMemo) {
    return null;
  }
  const hasReceipt = checkIfSimpleTransactionHasReceipt(transactionMemo);

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
