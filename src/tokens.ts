// Best docs https://spl.solana.com/token#example-creating-your-own-fungible-token
// OK docs: https://solanacookbook.com/references/token.html#how-to-create-a-new-token
// MUCH BETTER explanation, but with older code samples: https://github.com/jacobcreech/Token-Creator

import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  Account,
  mintToChecked,
  createTransferInstruction,
  transfer,
} from "@solana/spl-token";
import {
  bundlrStorage,
  keypairIdentity,
  Metaplex,
} from "@metaplex-foundation/js";

import { USD_DECIMALS } from "./constants";
import { getABetterErrorMessage } from "./errors";
import { log } from "./functions";
import { amount } from "@metaplex-foundation/js";

// Mint accounts hold information about the token such as how many decimals the token has and who can mint new tokens, and is  is later used to mint tokens to a token account and create the initial supply.
export const createMintAccount = async (
  connection: Connection,
  // The fee payer used to create the mint
  payer: Keypair,
  // The one account that can mint tokens for this token (this account does not hold the balance)
  mintAuthority: PublicKey
) => {
  try {
    const mintAccountPublicKey = await createMint(
      connection,
      payer,
      mintAuthority,
      null, // Don't both with a freeze address
      USD_DECIMALS
    );
    return mintAccountPublicKey;
  } catch (thrownObject) {
    const error = thrownObject as Error;
    const fullErrorMessage = getABetterErrorMessage(error.message);
    if (fullErrorMessage) {
      throw new Error(fullErrorMessage);
    }
    throw error;
  }
};

// Get or create the associated token account for the specified `owner`, ie a user that will hold this token
export const createTokenAccount = async (
  connection: Connection,
  mintAccountPublicKey: PublicKey,
  payer: Keypair,
  owner: PublicKey
): Promise<Account> => {
  const associatedTokenAddress = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mintAccountPublicKey,
    owner,
    false
  );

  return associatedTokenAddress;
};

export const mintTokens = async (
  connection: Connection,
  payer: Keypair,
  mintAccountPublicKey: PublicKey,
  tokenAccountPublicKey: PublicKey,
  mintAuthorityPublicKey: PublicKey,
  amount: number
) => {
  let transactionHash = await mintToChecked(
    connection, // connection
    payer, // fee payer
    mintAccountPublicKey, // mint
    tokenAccountPublicKey, // receiver (sholud be a token account)
    mintAuthorityPublicKey, // mint authority
    amount,
    USD_DECIMALS
  );
  return transactionHash;
};

export const makeTokenAccount = async (
  connection: Connection,
  payer: Keypair,
  mintAccountPublicKey: PublicKey,
  recipientPublicKey: PublicKey
) => {
  // Create recipient's token account
  const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mintAccountPublicKey,
    recipientPublicKey,
    false
  );
  return recipientTokenAccount;
};

export const sendUSDC = async (
  connection: Connection,
  sender: Keypair,
  senderTokenAccount: Account,
  recipientTokenAccount: Account,
  amount: number
) => {
  try {
    const signature = await transfer(
      connection,
      sender,
      senderTokenAccount.address,
      recipientTokenAccount.address,
      sender.publicKey,
      amount,
      []
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

// See https://github.com/solana-labs/solana-program-library/blob/master/token/js/examples/createMintAndTransferTokens.ts
export const transferPortalIdentityToken = async (
  connection: Connection,
  sender: Keypair,
  senderTokenAccount: Account,
  recipientTokenAccount: Account
) => {
  try {
    const signature = await transfer(
      connection,
      sender,
      senderTokenAccount.address,
      recipientTokenAccount.address,
      sender.publicKey,
      1,
      []
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
