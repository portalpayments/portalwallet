import { log, stringify, hexToUtf8, instructionDataToNote } from "./functions";
import {
  Currency,
  Direction,
  type CurrencyDetails,
  type ReceiptSummary,
  type TransactionsByDay,
  type TransactionSummary,
} from "../lib/types";

import {
  MEMO_PROGRAM,
  mintToCurrencyMap,
  NOTE_PROGRAM,
  SPL_TOKEN_PROGRAM,
} from "./constants";
import { getReceiptForTransactionSummary } from "./receipts";
import { getKeypairFromString } from "./vmwallet";
import {
  type ParsedInstruction,
  type PartiallyDecodedInstruction,
  type ParsedTransactionWithMeta,
  type PublicKey,
  Keypair,
} from "@solana/web3.js";

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

// See constants.ts for details re: notes vs memos
const getNoteOrMemo = (
  rawTransaction: ParsedTransactionWithMeta
): string | null => {
  const instructions = rawTransaction.transaction.message.instructions;

  const memoInstruction = instructions.find((instruction) => {
    return instruction.programId.toBase58() === MEMO_PROGRAM;
  });

  if (memoInstruction) {
    // @ts-ignore this definitely exists, see sendingSolWithNote
    const memo = memoInstruction.parsed;
    return memo;
  }

  const noteInstruction = instructions.find((instruction) => {
    return instruction.programId.toBase58() === NOTE_PROGRAM;
  });

  // The 'Note program' is exactly like the 'memo program'
  // Just run by someone else.
  if (noteInstruction) {
    // @ts-ignore this definitely exists, see sendingSolWithNote
    const instructionData = noteInstruction.data;
    const noteData = instructionDataToNote(instructionData);
    return noteData;
  }
  return null;
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

// TODO - maybe just use a keyPair?
export const summarizeTransaction = async (
  rawTransaction: ParsedTransactionWithMeta,
  walletAccount: PublicKey,
  fakeMintToCurrencyMap: Record<string, CurrencyDetails> | null = null,
  enableReceipts: boolean = false,
  secretKeyForReceipts: Uint8Array | null = null
): Promise<TransactionSummary> => {
  // https://docs.solana.com/terminology#transaction-id
  // The first signature in a transaction, which can be used to uniquely identify the transaction across the complete ledger.
  const id = rawTransaction?.transaction?.signatures?.[0];

  const date = solanaBlocktimeToJSTime(rawTransaction.blockTime);

  let receipt: null | ReceiptSummary = null;

  // ie, Sol native currency, not a token account
  const isSolTransaction = rawTransaction.meta.preTokenBalances.length === 0;

  const instructions = rawTransaction.transaction.message
    .instructions as Array<ParsedInstruction>;

  const firstInstruction = instructions[0];

  let memo: string | null = null;
  try {
    if (
      firstInstruction.parsed.info.source ===
      firstInstruction.parsed.info.destination
    ) {
      log(
        `Ignoring transaction sending money to self (probably a user mistake)`
      );
      return null;
    }

    memo = getNoteOrMemo(rawTransaction);

    if (isSolTransaction) {
      const onlyInstruction = instructions[0] as ParsedInstruction;

      const direction =
        onlyInstruction.parsed.info.source === walletAccount.toBase58()
          ? Direction.sent
          : Direction.recieved;

      const amount = onlyInstruction.parsed.info.lamports;
      if (!amount) {
        // See https://explorer.solana.com/tx/3DbFFLeUbUGFiQ7oyi3uZddD8qnsvE94VVv8HpNkYozUrKE1ordD74LWXH8di5ywKbCKMBNBYYTRM5Ur8q13fvY6
        throw new Error(
          `Ignoring transaction where no money was sent (eg, creating wallet without transferring funsds ${id}`
        );
      }

      if (enableReceipts && secretKeyForReceipts) {
        const keyPair = Keypair.fromSecretKey(secretKeyForReceipts);
        receipt = await getReceiptForTransactionSummary(keyPair, memo, date);
      }

      const transactionSummary = {
        id,
        date,
        status: rawTransaction.meta.err === null,
        networkFee: rawTransaction.meta.fee,
        direction,
        amount: onlyInstruction.parsed.info.lamports,
        currency: Currency.SOL,
        from: onlyInstruction.parsed.info.source,
        to: onlyInstruction.parsed.info.destination,
        memo,
        receipt,
      };

      return transactionSummary;
    }

    let walletDifference = getWalletDifference(
      rawTransaction,
      walletAccount.toBase58()
    );

    const mintAccount = rawTransaction.meta.postTokenBalances.find(
      (postTokenBalance) => postTokenBalance.owner !== walletAccount.toBase58()
    ).mint;

    const currencyDetails = fakeMintToCurrencyMap
      ? fakeMintToCurrencyMap[mintAccount]
      : mintToCurrencyMap[mintAccount];

    if (!currencyDetails) {
      throw new Error(`Unknown currency for mint '${mintAccount}'`);
    }

    const currencyId = currencyDetails.id;
    if (currencyId !== Currency.USDC) {
      log(`Found USDH transaction:`);
      log(stringify(rawTransaction));
    }

    if (rawTransaction.meta.postTokenBalances.length > 2) {
      throw new Error(`Can't parse this transaction`);
    }

    const otherWallet = rawTransaction.meta.postTokenBalances.find(
      (postTokenBalance) => postTokenBalance.owner !== walletAccount.toBase58()
    ).owner;

    // Use postTokenBalances to work out the wallet addresses that were actually involved in the transaction
    // Note we can't use preTokenBalances, as the token accounts may not exist yet

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

    if (enableReceipts && secretKeyForReceipts) {
      const keyPair = Keypair.fromSecretKey(secretKeyForReceipts);

      receipt = await getReceiptForTransactionSummary(keyPair, memo, date);
    }
    const transactionSummary: TransactionSummary = {
      id,
      date,
      status: rawTransaction.meta.err === null,
      networkFee: rawTransaction.meta.fee,
      direction,
      amount: removeSign(walletDifference),
      currency: currencyId,
      from,
      to,
      memo,
      receipt,
    };

    return transactionSummary;
  } catch (thrownObject) {
    const error = thrownObject as Error;
    // TODO: throw error instead of just log
    // (once we can handle more types of transactions in future)
    log(
      `Warning: could not summarize transaction ID: ${id} - see the block explorer for more info, ${error.message}`
    );
    return null;
  }
};

export const getTransactionsByDays = (
  // It is assumed that all transactionSummaries are for the same currency
  transactions: Array<TransactionSummary>,
  currency: Currency
): Array<TransactionsByDay> => {
  transactions = transactions
    .sort(byDateNewestToOldest)
    .filter((transaction) => transaction.currency === currency);

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
