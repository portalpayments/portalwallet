// Best docs https://spl.solana.com/token#example-creating-your-own-fungible-token
// OK docs: https://solanacookbook.com/references/token.html#how-to-create-a-new-token
// MUCH BETTER explanation, but with older code samples: https://github.com/jacobcreech/Token-Creator

import {
  sendAndConfirmTransaction,
  type Connection,
  type Keypair,
  type PublicKey,
} from "@solana/web3.js";
import { PublicKey as PublicKeyConstructor } from "@solana/web3.js";

import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintToChecked,
  transfer,
} from "@solana/spl-token";
import type { Account } from "@solana/spl-token";

import { getCurrencyBySymbol, USDC_MAINNET_MINT_ACCOUNT } from "./constants";
import { getABetterErrorMessage } from "./errors";
import { log, stringify } from "./functions";
import { getFeeForTransaction, transferWithMemo } from "./transfer-with-memo";
import type { BasicTokenAccount } from "./types";
import type { Currency as CurrencyType } from "../backend/types";

// Mint accounts hold information about the token such as how many decimals the token has and who can mint new tokens, and the mint account is later used to mint tokens to a token account and create the initial supply.
export const createMintAccount = async (
  connection: Connection,
  // The fee payer used to create the mint
  payer: Keypair,
  // The one account that can mint tokens for this token (this account does not hold the balance)
  mintAuthority: PublicKey,
  decimals: number
) => {
  try {
    const mintAccountPublicKey = await createMint(
      connection,
      payer,
      mintAuthority,
      null, // Don't bother with a freeze address
      decimals
    );
    return mintAccountPublicKey;
  } catch (thrownObject) {
    const error = thrownObject as Error;
    const fullErrorMessage = getABetterErrorMessage(error.message);
    if (fullErrorMessage) {
      error.message = fullErrorMessage;
    }
    throw error;
  }
};

export const mintTokens = async (
  connection: Connection,
  payer: Keypair,
  mintAccountPublicKey: PublicKey,
  tokenAccountPublicKey: PublicKey,
  mintAuthorityPublicKey: PublicKey,
  amount: number,
  decimals: number
) => {
  let transactionHash = await mintToChecked(
    connection, // connection
    payer, // fee payer
    mintAccountPublicKey, // mint
    tokenAccountPublicKey, // receiver (sholud be a token account)
    mintAuthorityPublicKey, // mint authority
    amount,
    decimals
  );
  return transactionHash;
};

export const makeTokenAccount = async (
  connection: Connection,
  payer: Keypair,
  mintAccountPublicKey: PublicKey,
  recipientPublicKey: PublicKey
): Promise<BasicTokenAccount> => {
  // Create recipient's token account
  log(`DEBUGGING - inside makeTokenAccount...`);
  // Will occasionally throw TokenAccountNotFoundError for other, different errors
  // See https://github.com/solana-labs/solana-program-library/issues/3326
  // TODO: fix when issue above is resolved
  let recipientTokenAccount: Account | null = null;

  try {
    recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mintAccountPublicKey,
      recipientPublicKey,
      false,
      // Don't specify a commitment, just use the default
      // (which is as conservative as we can, see connect() )
      null,
      {
        maxRetries: 5,
      }
    );
  } catch (thrownObject) {
    const error = thrownObject as Error;
    log(`TODO: check for specific error`, error.message);
    const accounts = await connection.getTokenAccountsByOwner(
      recipientPublicKey,
      { mint: mintAccountPublicKey }
    );

    recipientTokenAccount = accounts[0];
  }

  if (!recipientTokenAccount) {
    throw new Error(
      `Error in getOrCreateAssociatedTokenAccount see https://github.com/solana-labs/solana-program-library/issues/3326`
    );
  }

  return {
    address: recipientTokenAccount.address,
    amount: recipientTokenAccount.amount,
    mint: recipientTokenAccount.mint,
  };
};

// See https://github.com/solana-labs/solana-program-library/blob/master/token/js/examples/createMintAndTransferTokens.ts

// TODO: DEPRECATED
// Replace with makeTransactionObject and sendTransaction
export const sendTokens = async (
  connection: Connection,
  sender: Keypair,
  senderTokenAccountAddress: PublicKey,
  recipientTokenAccountAddress: PublicKey,
  amount: number,
  mintAddress: PublicKey,
  memo: null | string = null
) => {
  try {
    const transaction = await transferWithMemo(
      connection,
      senderTokenAccountAddress,
      recipientTokenAccountAddress,
      sender,
      amount,
      mintAddress,
      memo
    );

    const fee = await getFeeForTransaction(connection, transaction);

    const signature = sendAndConfirmTransaction(
      connection,
      transaction,
      [sender],
      {
        // https://solanacookbook.com/guides/retrying-transactions.html#facts
        maxRetries: 6,
      }
    );

    return signature;
  } catch (thrownObject) {
    const error = thrownObject as Error;
    const fullErrorMessage = getABetterErrorMessage(error.message);
    if (fullErrorMessage) {
      throw new Error(fullErrorMessage);
    }
    throw error;
  }
};

// TODO: DEPRECATED
// Replace with makeTransactionObject and sendTransaction
export const makeAccountsAndDoTransfer = async (
  connection: Connection,
  senderKeyPair: Keypair,
  transferAmountInMinorUnits: number,
  recipient: PublicKey,
  memo: string,
  isProduction: boolean
) => {
  log(`Doing transfer, will send ${transferAmountInMinorUnits} cents`);

  if (!isProduction) {
    throw new Error(`TODO: implement support for other networks`);
  }

  // TODO: support more than USDC (mainly changing functions that use this to provide currency)
  const currency = getCurrencyBySymbol("USDC").mintAddress;

  const mintAccount = new PublicKeyConstructor(currency);

  const senderTokenAccount = await makeTokenAccount(
    connection,
    senderKeyPair,
    mintAccount,
    senderKeyPair.publicKey
  );

  log(
    `Made / found our USDC token account`,
    senderTokenAccount.address.toBase58()
  );

  const recipientTokenAccount = await makeTokenAccount(
    connection,
    senderKeyPair,
    mintAccount,
    recipient
  );

  log(
    `Made / found recipient's USDC token account`,
    recipientTokenAccount.address.toBase58()
  );

  const signature = await sendTokens(
    connection,
    senderKeyPair,
    senderTokenAccount.address,
    recipientTokenAccount.address,
    transferAmountInMinorUnits,
    new PublicKeyConstructor(currency),
    memo
  );

  return signature;
};
