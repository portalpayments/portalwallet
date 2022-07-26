// See https://solanacookbook.com/references/token.html#how-to-create-a-new-token
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
} from "@solana/spl-token";
import { USD_DECIMALS } from "./constants";
import { getABetterErrorMessage } from "./errors";
import { log } from "./functions";

// Mint accounts hold information about the token such as how many decimals the token has and who can mint new tokens, and is  is later used to mint tokens to a token account and create the initial supply.
export const createMintAccount = async (
  connection: Connection,
  // The fee payer used to create the mint
  feePayer: Keypair,
  // The one account that can mint tokens for this token (this account does not hold the balance)
  mintAuthority: PublicKey
) => {
  try {
    const mintAccountPublicKey = await createMint(
      connection,
      feePayer,
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

// Get or create the associated token account for the specified `owner`
// The associated token account will hold this particular token.
export const createTokenAccount = async (
  connection: Connection,
  tokenMintAccount: PublicKey,
  signer: Keypair,
  owner: PublicKey
): Promise<Account> => {
  const associatedTokenAddress = await getOrCreateAssociatedTokenAccount(
    connection,
    signer,
    tokenMintAccount,
    owner,
    false
  );

  return associatedTokenAddress;
};

export const mintTokens = async (
  connection: Connection,
  feePayer: Keypair,
  mintAccountPublicKey: PublicKey,
  tokenAccountPublicKey: PublicKey,
  mintAuthorityPublicKey: PublicKey,
  amount: number
) => {
  let transactionHash = await mintToChecked(
    connection, // connection
    feePayer, // fee payer
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
  recipient: Keypair
) => {
  // Create Bob's token account
  const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mintAccountPublicKey,
    recipient.publicKey,
    false
  );
  return recipientTokenAccount;
};
