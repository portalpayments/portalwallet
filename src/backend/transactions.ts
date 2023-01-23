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
  stringify,
} from "./functions";
import {
  type Currency,
  Direction,
  type CurrencyDetails,
  type ReceiptSummary,
  type TransactionsByDay,
  type SimpleTransaction,
} from "../backend/types";
import { mintToCurrencyMap } from "../backend/mint-to-currency-map";
import {
  getCurrencyBySymbol,
  JUPITER,
  MEMO_PROGRAM,
  NOTE_PROGRAM,
  NOT_FOUND,
  ORCA_WHIRLPOOL_MAINNET_ACCOUNT,
} from "./constants";
import { getReceiptForSimpleTransaction } from "./receipts";
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

const getCounterParty = (direction: Direction, from: string, to: string) => {
  if (direction === Direction.sent) {
    return to;
  }
  if (direction === Direction.recieved || direction === Direction.swapped) {
    return from;
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

  // It's possible we didn't have this token before, so we didn't have the token account for it.
  const valueBefore = Number(ownerBefore?.uiTokenAmount?.amount || 0);
  const valueAfter = Number(ownerAfter.uiTokenAmount.amount);

  const difference = valueAfter - valueBefore;

  return difference;
};

const getInnerInstructionsForProgram = (
  rawTransaction: ParsedTransactionWithMeta,
  programAddress: string
) => {
  // See https://solana.stackexchange.com/questions/2825/correlate-the-instructions-of-the-innerinstructions
  const programInstructionIndex =
    rawTransaction.transaction.message.instructions.findIndex(
      (instruction) => instruction.programId.toBase58() === programAddress
    );

  if (programInstructionIndex === NOT_FOUND) {
    return null;
  }

  // Naming is a little weird in web3.js,
  // 'innerInstructions' is not an array of instructions
  // but rather an item that contains an object with a 'instructions' key inside it
  const programInnerInstructionObject =
    rawTransaction.meta.innerInstructions.find((innerInstruction) => {
      return innerInstruction.index === programInstructionIndex;
    }) || null;
  if (!programInnerInstructionObject) {
    return null;
  }
  const innerInstructions = programInnerInstructionObject.instructions;
  return innerInstructions;
};

export const summarizeTransaction = async (
  rawTransaction: ParsedTransactionWithMeta,
  walletAccount: PublicKey,
  fakeMintToCurrencyMap: Record<string, CurrencyDetails> | null = null,
  enableReceipts: boolean = false,
  // Since purchases are private we need the secret key to talk to Dialect.
  secretKeyForReceipts: Uint8Array | null = null
): Promise<SimpleTransaction> => {
  // https://docs.solana.com/terminology#transaction-id
  // The first signature in a transaction, which can be used to uniquely identify the transaction across the complete ledger.
  const id = rawTransaction?.transaction?.signatures?.[0];

  const networkFee = rawTransaction.meta.fee;

  const status = rawTransaction.meta.err === null;
  const date = solanaBlocktimeToJSTime(rawTransaction.blockTime);

  let receipt: null | ReceiptSummary = null;

  // ie, Sol native currency, not a token account
  const isSolTransaction = rawTransaction.meta.preTokenBalances.length === 0;

  const instructions = rawTransaction.transaction.message
    .instructions as Array<ParsedInstruction>;

  const firstInstruction = instructions[0];

  let memo: string | null = null;
  try {
    // Check 'parsed' exists explicitly .....
    if (firstInstruction?.parsed) {
      // ...so we don't compare undefined and undefined in this test.
      if (
        firstInstruction.parsed?.info?.source ===
        firstInstruction.parsed.info.destination
      ) {
        log(
          `Ignoring transaction sending money to self (probably a user mistake)`
        );
        return null;
      }
    }

    memo = getNoteOrMemo(rawTransaction);

    if (isSolTransaction) {
      // TODO:
      // Bad naming. Rename to firstInstruction or add check this is only instruction.
      const onlyInstruction = instructions[0];

      if (onlyInstruction?.parsed?.type === "createAccountWithSeed") {
        const simpleTransaction = {
          id,
          date,
          status,
          networkFee,
          direction: null,
          amount: onlyInstruction.parsed.info.lamports,
          currency: null,
          from: null,
          to: null,
          counterParty: null,
          memo: null,
          receipt: null,
          swapAmount: null,
          swapCurrency: null,
        };

        return simpleTransaction;
      }

      const direction =
        onlyInstruction.parsed.info.source === walletAccount.toBase58()
          ? Direction.sent
          : Direction.recieved;

      const amount = onlyInstruction.parsed.info.lamports;
      if (!amount) {
        throw new Error(
          `Ignoring transaction where no money was sent (eg, creating wallet without transferring funds) see https://explorer.solana.com/tx/${id}`
        );
      }

      if (enableReceipts && secretKeyForReceipts) {
        const keyPair = Keypair.fromSecretKey(secretKeyForReceipts);
        receipt = await getReceiptForSimpleTransaction(keyPair, memo, date);
      }

      const from = onlyInstruction.parsed.info.source;
      const to = onlyInstruction.parsed.info.destination;
      const counterParty = getCounterParty(direction, from, to);

      const simpleTransaction = {
        id,
        date,
        status,
        networkFee,
        direction,
        amount: onlyInstruction.parsed.info.lamports,
        currency: getCurrencyBySymbol("SOL").mintAddress,
        from,
        to,
        counterParty,
        memo,
        receipt,
        swapAmount: null,
        swapCurrency: null,
      };

      return simpleTransaction;
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

    const currencyId = currencyDetails.mintAddress;

    let isSwap = false;
    let swapAmount: number | null = null;
    let swapCurrency: Currency | null = null;

    // TODO: look at swaps outside Jupiter
    const innerInstructionsForJupiter = getInnerInstructionsForProgram(
      rawTransaction,
      JUPITER
    );

    let counterParty: string | null = null;

    if (innerInstructionsForJupiter) {
      const jupiterInnerInstructionForSwappedToken =
        innerInstructionsForJupiter.find((jupiterInnerInstruction) => {
          return (
            // TODO: web3.js types don't include 'parsed' keys
            // upgrade and remove once they've fixed the bug
            // @ts-ignore
            jupiterInnerInstruction?.parsed?.info?.authority ===
            walletAccount.toBase58()
          );
        }) || null;

      if (jupiterInnerInstructionForSwappedToken) {
        swapAmount = Number(
          // TODO: web3.js types don't include 'parsed' keys
          // upgrade and remove once they've fixed the bug
          // @ts-ignore
          jupiterInnerInstructionForSwappedToken?.parsed?.info?.amount
        );

        // TODO: we're currently setting currency statically
        // fix, this is a bit embarassing
        swapCurrency = getCurrencyBySymbol("SOL").mintAddress;

        isSwap = true;
        counterParty = JUPITER;
      }
    }

    if (!isSwap) {
      if (rawTransaction.meta.postTokenBalances.length > 2) {
        // TODO: we're currently limited in parsing transactions
        // with 2 or more accounts changing.
        throw new Error(`Can't parse this transaction`);
      }
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

    if (isSwap) {
      direction = Direction.swapped;
      from = walletAccount.toBase58();
      to = walletAccount.toBase58();
    }

    if (enableReceipts && secretKeyForReceipts) {
      const keyPair = Keypair.fromSecretKey(secretKeyForReceipts);

      receipt = await getReceiptForSimpleTransaction(keyPair, memo, date);
    }

    counterParty = counterParty || getCounterParty(direction, from, to);

    const simpleTransaction: SimpleTransaction = {
      id,
      date,
      status,
      networkFee,
      direction,
      amount: removeSign(walletDifference),
      currency: currencyId,
      from,
      to,
      counterParty,
      memo,
      receipt,
      swapAmount,
      swapCurrency,
    };

    return simpleTransaction;
  } catch (thrownObject) {
    const error = thrownObject as Error;
    // TODO: throw error instead of just log
    // (once we can handle more types of transactions in future)
    log(
      `Warning: could not summarize transaction ID: see https://explorer.solana.com/tx/${id} - for more info, ${error.message}`
    );
    // log(error.stack);
    // log(stringify(rawTransaction));
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
  transactions: Array<SimpleTransaction>,
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

  const toSpendingAmount = (transaction: SimpleTransaction) => {
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
