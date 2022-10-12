import { log, stringify } from "./functions";
import type {
  Connection,
  Keypair,
  PublicKey,
  TransactionResponse,
  ParsedTransactionWithMeta,
  ParsedInstruction,
} from "@solana/web3.js";
import {
  Currency,
  Direction,
  type TransactionsByDay,
  type TransactionSummary,
} from "../lib/types";

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

const dateToISODate = (date: number) => {
  return new Date(date).toISOString().slice(0, 10);
};

export const isoDateToFriendlyName = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

const byDateNewestToOldest = (a, b) => {
  if (a.date === b.date) {
    return 0;
  }
  if (a.date < b.date) {
    return 1;
  }
  return -1;
};

export const transactionResponseToPortalTransactionSummary = (
  transactionResponse: ParsedTransactionWithMeta,
  currentWallet: PublicKey
): TransactionSummary => {
  // https://docs.solana.com/terminology#transaction-id
  // The first signature in a transaction, which can be used to uniquely identify the transaction across the complete ledger.
  const id = transactionResponse.transaction.signatures[0];
  try {
    const instructions = transactionResponse.transaction.message.instructions;
    if (instructions.length === 1) {
      const firstInstruction = instructions[0] as ParsedInstruction;
      if (
        firstInstruction.parsed.info.source ===
        firstInstruction.parsed.info.destination
      ) {
        log(`Ignoring transaction sending money to self (probably a mistake)`);
        return null;
      }
    }

    if (transactionResponse.meta.preTokenBalances.length === 0) {
      log(`Handing Sol transaction`);
      const instructions = transactionResponse.transaction.message.instructions;
      if (instructions.length !== 1) {
        throw new Error(`Don't know how to summarize this transaction ${id}`);
      }

      const onlyInstruction = instructions[0] as ParsedInstruction;

      const direction =
        onlyInstruction.parsed.info.source === currentWallet.toBase58()
          ? Direction.sent
          : Direction.recieved;

      const amount = onlyInstruction.parsed.info.lamports;
      if (!amount) {
        // Probably a createWallet instruction, see https://explorer.solana.com/tx/3DbFFLeUbUGFiQ7oyi3uZddD8qnsvE94VVv8HpNkYozUrKE1ordD74LWXH8di5ywKbCKMBNBYYTRM5Ur8q13fvY6
        throw new Error(`Don't know how to summarize this transaction ${id}`);
      }

      const portalTransActionSummary = {
        id,
        date: solanaBlocktimeToJSTime(transactionResponse.blockTime),
        status: transactionResponse.meta.err === null,
        networkFee: transactionResponse.meta.fee,
        direction,
        amount: onlyInstruction.parsed.info.lamports,
        currency: Currency.SOL,
        from: onlyInstruction.parsed.info.source,
        to: onlyInstruction.parsed.info.destination,
      };

      return portalTransActionSummary;
    }

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

    let direction: Direction;
    if (isPositive(subjectWalletDifference)) {
      direction = Direction.recieved;
    } else {
      direction = Direction.sent;
    }

    let from: string;
    let to: string;
    if (direction === Direction.sent) {
      from = subjectOwner;
      to = otherOwner;
    } else {
      from = otherOwner;
      to = subjectOwner;
    }

    const currency = Currency.USDC;

    const portalTransActionSummary = {
      id,
      date: solanaBlocktimeToJSTime(transactionResponse.blockTime),
      status: transactionResponse.meta.err === null,
      networkFee: transactionResponse.meta.fee,
      direction,
      amount: removeSign(subjectWalletDifference),
      currency,
      from,
      to,
    };

    return portalTransActionSummary;
  } catch (thrownObject) {
    const error = thrownObject as Error;
    log(
      `Warning: could not decode transaction ID: ${id} - see the block explorer for more info.`
    );
    // TODO: throw error;
    return null;
  }
};

export const getTransactionsByDays = (
  transactions: Array<TransactionSummary>,
  // We can't add, eg, 50 cents to 130 sol. So this function is for a specific currency only
  currency: Currency
) => {
  transactions = transactions.filter(
    (transaction) => transaction.currency === currency
  );
  transactions.sort(byDateNewestToOldest);

  const transactionsByDays: Array<TransactionsByDay> = [];

  const toSpendingAmount = (transaction: TransactionSummary) => {
    if (transaction.direction === Direction.sent) {
      return transaction.amount;
    } else {
      return flip(transaction.amount);
    }
  };

  transactions.forEach((transaction) => {
    const isoDate = dateToISODate(transaction.date);
    const lastDay = transactionsByDays.at(-1) || null;
    if (lastDay?.isoDate === isoDate) {
      // Add this transaction to the existing entry for this day
      lastDay.transactions.push(transaction);
      // And add it to the spending total for this day
      lastDay.total += toSpendingAmount(transaction);
    } else {
      // Create a new TransactionsByDay item
      transactionsByDays.push({
        isoDate,
        total: toSpendingAmount(transaction),
        transactions: [transaction],
      });
    }
  });

  return transactionsByDays;
};
