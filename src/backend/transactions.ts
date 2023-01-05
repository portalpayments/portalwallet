import {
  log,
  instructionDataToNote,
  debug,
  byDateNewestToOldest,
  dateToISODate,
  isIncludedCaseInsensitive,
  isPositive,
  removeSign,
  solanaBlocktimeToJSTime,
} from "./functions";
import {
  Currency,
  Direction,
  type CurrencyDetails,
  type ReceiptSummary,
  type TransactionsByDay,
  type TransactionSummary,
} from "../lib/types";

import { MEMO_PROGRAM, mintToCurrencyMap, NOTE_PROGRAM } from "./constants";
import { getReceiptForTransactionSummary } from "./receipts";
import {
  type ParsedInstruction,
  type ParsedTransactionWithMeta,
  type PublicKey,
  Keypair,
} from "@solana/web3.js";
import { amountAndDecimalsToMajorAndMinor } from "../lib/utils";

import { recognizeDateTime } from "@microsoft/recognizers-text-date-time";

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
    debug(
      `Warning: could not summarize transaction ID: ${id} - see the block explorer for more info, ${error.message}`
    );
    return null;
  }
};

export const findContactByAddress = (
  contacts: Array<Contact>,
  walletAddress: string
) => {
  return contacts.find((contact) => contact.walletAddress === walletAddress);
};

export const getContactMatch = (contact: Contact, filterValue: string) => {
  if (!contact?.verifiedClaims) {
    return false;
  }
  return (
    isIncludedCaseInsensitive(contact.verifiedClaims.givenName, filterValue) ||
    isIncludedCaseInsensitive(contact.verifiedClaims.familyName, filterValue)
  );
};

export const getTransactionsByDays = (
  // It is assumed that all transactionSummaries are for the same currency
  transactions: Array<TransactionSummary>,
  contacts: Array<Contact>,
  filterValue: string = "",
  decimals: number
): Array<TransactionsByDay> => {
  transactions = transactions.sort(byDateNewestToOldest);

  log(
    `In getTransactionsByDays, ${transactions.length} transactions before filtering`
  );

  if (filterValue.length) {
    // TODO: this code works but library has no docs
    // See https://github.com/microsoft/Recognizers-Text/issues/3064
    // TODO: what does recognizeDateTime() actually return
    // Feels like these are the 'recognisable entities' that were found but I can't find docs.
    const recognizedDateTimeEntities = recognizeDateTime(
      filterValue,
      // This is just 'string' in the types but it seems to work.
      // TODO: find docs, check if this is valid.
      "English"
    );
    if (recognizedDateTimeEntities.length) {
      const firstEntity = recognizedDateTimeEntities[0];
      // TODO: what is a resolution?
      // Guessing this is each possible value for each recognisable item but I can't find docs.
      // eg if the user enters 'october'
      // values[0] is in the past
      // values[1] is in the future
      // we always want the past, hence picking 0.
      const firstResolution = firstEntity?.resolution?.values[0] || null;

      if (!firstResolution) {
        log(`Date recogniser didn't have a start or end`);
        return;
      }

      const start = new Date(firstResolution.start).valueOf();
      const end = new Date(firstResolution.end).valueOf();

      transactions = transactions.filter((transaction) => {
        return transaction.date >= start && transaction.date <= end;
      });

      log(`${transactions.length} transactions left after filter.`);
    } else {
      transactions = transactions.filter((transaction) => {
        // Don't bother checking SOLANA_WALLET_REGEX as the user may not enter the entire wallet
        // address, but still want results
        let isWalletAddressMatch =
          isIncludedCaseInsensitive(transaction.from, filterValue) ||
          isIncludedCaseInsensitive(transaction.to, filterValue);

        let isContactMatch = false;

        const fromContact = findContactByAddress(contacts, transaction.from);
        const toContact = findContactByAddress(contacts, transaction.to);

        isContactMatch =
          getContactMatch(fromContact, filterValue) ||
          getContactMatch(toContact, filterValue);

        let isMemoMatch = transaction?.memo
          ? isIncludedCaseInsensitive(transaction.memo, filterValue)
          : false;

        let isReceiptMatch =
          (transaction?.receipt?.items &&
            transaction.receipt.items.find((item) =>
              isIncludedCaseInsensitive(item.name, filterValue)
            )) ||
          false;

        return (
          isWalletAddressMatch ||
          isContactMatch ||
          isMemoMatch ||
          isReceiptMatch
        );
      });
    }
  }

  log(
    `In getTransactionsByDays, ${transactions.length} transactions after any filtering`
  );

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
      const totalSpending = toSpendingAmount(transaction);
      // TODO: we could neaten this to not use the join()
      const totalSpendingDisplay = amountAndDecimalsToMajorAndMinor(
        totalSpending,
        decimals
      ).join(".");
      transactionsByDays.push({
        isoDate,
        totalSpending,
        totalSpendingDisplay,
        transactions: [transaction],
      });
    }
  });

  return transactionsByDays;
};
