import { log, stringify, hexToUtf8, instructionDataToNote } from "./functions";
import type {
  PublicKey,
  ParsedTransactionWithMeta,
  ParsedInstruction,
  PartiallyDecodedInstruction,
} from "@solana/web3.js";
import {
  Currency,
  Direction,
  type TransactionsByDay,
  type TransactionSummary,
} from "../lib/types";

import { MEMO_PROGRAM, NOTE_PROGRAM, SPL_TOKEN_PROGRAM } from "./constants";

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

export const flipZeroAndOne = (number: 0 | 1) => {
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

const checkIsCreatingTokenAccount = (instruction: ParsedInstruction) => {
  return (
    instruction.program === "spl-associated-token-account" &&
    instruction.parsed.type === "create"
  );
};

const checkIsSendingUSDC = (instruction: ParsedInstruction) => {
  return (
    instruction.programId.toBase58() === SPL_TOKEN_PROGRAM &&
    instruction.parsed.type === "transferChecked"
  );
};

const getNoteOrMemo = (
  instruction: ParsedInstruction | PartiallyDecodedInstruction
): string | null => {
  const instructionProgram = instruction.programId.toBase58();

  // The 'Note program' is exactly like the 'memo program'
  // Just run by someone else.
  if (instructionProgram === MEMO_PROGRAM) {
    // OK this is just sending Sol with a memo

    // @ts-ignore this definitely exists, see sendingLamportsWithNoteTransaction
    const memo = instruction.parsed;
    return memo;
  }

  // The 'Note program' is exactly like the 'memo program'
  // Just run by someone else.
  if (instructionProgram === NOTE_PROGRAM) {
    // OK this is just sending Sol with a note

    // @ts-ignore this definitely exists, see sendingLamportsWithNoteTransaction
    const instructionData = instruction.data;

    const noteData = instructionDataToNote(instructionData);
    return noteData;
  }
  return null;
};

const checkIsMakingUSDCAccount = (instructions: Array<ParsedInstruction>) => {
  return (
    instructions.length === 3 &&
    checkIsCreatingTokenAccount(instructions[0]) &&
    checkIsSendingUSDC(instructions[1])
  );
};

const getWalletDifference = (
  rawTransaction: ParsedTransactionWithMeta,
  wallet: string
) => {
  const ownerBefore = rawTransaction.meta.preTokenBalances.find(
    (preTokenBalance) => preTokenBalance.owner === wallet
  );

  const ownerAfter = rawTransaction.meta.postTokenBalances.find(
    (postTokenBalance) => postTokenBalance.owner === wallet
  );

  // It's possible we didn't have thi token before, so we didn't have the token account for it.
  const valueBefore = Number(ownerBefore?.uiTokenAmount?.amount || 0);
  const valueAfter = Number(ownerAfter.uiTokenAmount.amount);

  const difference = valueAfter - valueBefore;

  return difference;
};

export const summarizeTransaction = (
  rawTransaction: ParsedTransactionWithMeta,
  walletAccount: PublicKey
): TransactionSummary => {
  // https://docs.solana.com/terminology#transaction-id
  // The first signature in a transaction, which can be used to uniquely identify the transaction across the complete ledger.
  const id = rawTransaction?.transaction?.signatures?.[0];

  // ie, Sol native currency, not a token account
  const isSolTransaction = rawTransaction.meta.preTokenBalances.length === 0;

  const instructions = rawTransaction.transaction.message
    .instructions as Array<ParsedInstruction>;

  const firstInstruction = instructions[0];

  let memo: string | null = null;
  try {
    const hasMultipleInstructions = instructions.length > 1;
    if (!hasMultipleInstructions) {
      if (
        firstInstruction.parsed.info.source ===
        firstInstruction.parsed.info.destination
      ) {
        log(
          `Ignoring transaction sending money to self (probably a user mistake)`
        );
        return null;
      }
    }

    if (hasMultipleInstructions) {
      if (checkIsMakingUSDCAccount(instructions)) {
        // Typical Glow sending USDC to new account
        memo = getNoteOrMemo(instructions[2]);
      } else {
        // TODO add comment here describing the common scenario we go down this code path
        // eg what app normally sends this?

        memo = getNoteOrMemo(instructions[1]);

        if (!memo) {
          throw new Error(
            `Don't know how to summarize this transaction - second instruction isn't a memo or note`
          );
        }
      }
    }

    if (isSolTransaction) {
      log(`Handing Sol transaction`);

      const onlyInstruction = instructions[0] as ParsedInstruction;

      const direction =
        onlyInstruction.parsed.info.source === walletAccount.toBase58()
          ? Direction.sent
          : Direction.recieved;

      const amount = onlyInstruction.parsed.info.lamports;
      if (!amount) {
        // Probably a createWallet instruction, see https://explorer.solana.com/tx/3DbFFLeUbUGFiQ7oyi3uZddD8qnsvE94VVv8HpNkYozUrKE1ordD74LWXH8di5ywKbCKMBNBYYTRM5Ur8q13fvY6
        throw new Error(`Don't know how to summarize this transaction ${id}`);
      }

      const portalTransActionSummary = {
        id,
        date: solanaBlocktimeToJSTime(rawTransaction.blockTime),
        status: rawTransaction.meta.err === null,
        networkFee: rawTransaction.meta.fee,
        direction,
        amount: onlyInstruction.parsed.info.lamports,
        currency: Currency.SOL,
        from: onlyInstruction.parsed.info.source,
        to: onlyInstruction.parsed.info.destination,
        memo,
      };

      return portalTransActionSummary;
    }

    let walletDifference = getWalletDifference(
      rawTransaction,
      walletAccount.toBase58()
    );

    if (rawTransaction.meta.postTokenBalances.length > 2) {
      throw new Error(`Can't parse this transaction`);
    }

    const otherWallet = rawTransaction.meta.postTokenBalances.find(
      (postTokenBalance) => postTokenBalance.owner !== walletAccount.toBase58()
    ).owner;

    // Use postTokenBalances to work out the wallet addresses that were actually involved in the transaction
    // Note we can't use pre, as the token accounts may not exist yet

    let direction: Direction = isPositive(walletDifference)
      ? Direction.recieved
      : Direction.sent;

    let from: string;
    let to: string;
    if (direction === Direction.sent) {
      from = walletAccount.toBase58();
      to = otherWallet;
    } else {
      from = otherWallet;
      to = walletAccount.toBase58();
    }

    const currency = Currency.USDC;

    const portalTransActionSummary = {
      id,
      date: solanaBlocktimeToJSTime(rawTransaction.blockTime),
      status: rawTransaction.meta.err === null,
      networkFee: rawTransaction.meta.fee,
      direction,
      amount: removeSign(walletDifference),
      currency,
      from,
      to,
      memo,
    };

    return portalTransActionSummary;
  } catch (thrownObject) {
    const error = thrownObject as Error;
    log(error);
    log(
      `Warning: could not summarize transaction ID: ${id} - see the block explorer for more info, ${error.message}`
    );
    // TODO: throw error (once we can handle more types of transactions)
    return null;
  }
};

export const getTransactionsByDays = (
  transactions: Array<TransactionSummary>,
  // We can't add, eg, 50 cents to 130 sol. So this function is for a specific currency only
  currency: Currency
): Array<TransactionsByDay> => {
  transactions = transactions.filter(
    (transaction) => transaction.currency === currency
  );
  transactions.sort(byDateNewestToOldest);

  const transactionsByDays: Array<TransactionsByDay> = [];

  const toSpendingAmount = (transaction: TransactionSummary) => {
    if (transaction.direction === Direction.sent) {
      return transaction.amount;
    } else {
      return 0;
    }
  };

  transactions.forEach((transaction) => {
    const isoDate = dateToISODate(transaction.date);
    const lastDay = transactionsByDays.at(-1) || null;
    if (lastDay?.isoDate === isoDate) {
      // Add this transaction to the existing entry for this day
      lastDay.transactions.push(transaction);
      // And add it to the spending total for this day
      lastDay.totalSpending += toSpendingAmount(transaction);
    } else {
      // Create a new TransactionsByDay item
      const spendingAmount = toSpendingAmount(transaction);
      transactionsByDays.push({
        isoDate,
        totalSpending: spendingAmount,
        transactions: [transaction],
      });
    }
  });

  return transactionsByDays;
};
