import { log, stringify } from "./functions";
import type {
  Connection,
  Keypair,
  PublicKey,
  TransactionResponse,
  ParsedTransactionWithMeta,
  ParsedInstruction,
} from "@solana/web3.js";
import { Currency, Direction, type TransactionSummary } from "../lib/types";

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
      log(`Ignoring non-token transaction`);
      // TODO: handle native token transactions
      const instructions = transactionResponse.transaction.message.instructions;
      if (instructions.length !== 1) {
        throw new Error(`Don't know how to summarize this transaction`);
      }

      const onlyInstruction = instructions[0] as ParsedInstruction;

      const direction =
        onlyInstruction.parsed.info.source === currentWallet.toBase58()
          ? Direction.sent
          : Direction.recieved;

      const portalTransActionSummary = {
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
      `Warning: could not decode transaction:`,
      stringify(transactionResponse)
    );
    // TODO: throw error;
    return null;
  }
};
