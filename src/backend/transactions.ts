import { log, stringify } from "./functions";
import type {
  Connection,
  Keypair,
  PublicKey,
  TransactionResponse,
  ParsedTransactionWithMeta,
} from "@solana/web3.js";
import type { TransactionSummary } from "src/lib/types";

export const solanaBlocktimeToJSTime = (blockTime: number) => {
  return blockTime * 1000;
};

// May be unnecessary but 'absolute value' isn't necessaryilt a well known concept
export const removeSign = (number: number) => {
  return Math.abs(number);
};

export const invertNumber = (number: number) => {
  return -number;
};

export const flip = (number: number) => {
  return Number(!number);
};

export const isPositive = (number: number) => {
  return Math.sign(number) === 1;
};

export const transactionResponseToPortalTransactionSummary = (
  transactionResponse: ParsedTransactionWithMeta,
  currentWallet: PublicKey
): TransactionSummary => {
  const getDifferenceByIndex = (index: number) => {
    const accountBefore = Number(
      transactionResponse.meta.preTokenBalances[index].uiTokenAmount.amount
    );

    const accountAfter = Number(
      transactionResponse.meta.postTokenBalances[index].uiTokenAmount.amount
    );

    return accountAfter - accountBefore;
  };

  const subjectWalletIndex =
    transactionResponse.meta.preTokenBalances[0].owner ===
    currentWallet.toBase58()
      ? 0
      : 1;

  const otherWalletIndex = flip(subjectWalletIndex);

  let subjectWalletDifference = getDifferenceByIndex(subjectWalletIndex);
  const otherWalletDifference = getDifferenceByIndex(otherWalletIndex);

  const subjectOwner =
    transactionResponse.meta.preTokenBalances[subjectWalletIndex].owner;
  const otherOwner =
    transactionResponse.meta.preTokenBalances[otherWalletIndex].owner;

  let direction: "sent" | "recieved";
  if (isPositive(subjectWalletDifference)) {
    direction = "recieved";
  } else {
    direction = "sent";
  }

  let from: string;
  let to: string;
  if (direction === "sent") {
    from = subjectOwner;
    to = otherOwner;
  } else {
    from = otherOwner;
    to = subjectOwner;
  }

  const portalTransActionSummary = {
    date: solanaBlocktimeToJSTime(transactionResponse.blockTime),
    status: transactionResponse.meta.err === null,
    networkFee: transactionResponse.meta.fee,
    direction,
    amount: removeSign(subjectWalletDifference),
    from,
    to,
  };

  return portalTransActionSummary;
};
