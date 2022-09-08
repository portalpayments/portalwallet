// Best docs https://spl.solana.com/token#example-creating-your-own-fungible-token
// OK docs: https://solanacookbook.com/references/token.html#how-to-create-a-new-token
// MUCH BETTER explanation, but with older code samples: https://github.com/jacobcreech/Token-Creator

import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  Account,
  mintToChecked,
  transfer,
} from "@solana/spl-token";

import { USD_DECIMALS } from "./constants";
import { getABetterErrorMessage } from "./errors";
import { log } from "./functions";

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

    log(`Inside sendUSDC:`, {
      sender: {
        publicKey: sender.publicKey.toBase58(),
        // TODO: remove this log
        secretKey: sender.secretKey.toString(),
      },
      senderTokenAccount: senderTokenAccount.address.toBase58(),
      recipientTokenAccount: recipientTokenAccount.address.toBase58(),
      senderPublicKey: sender.publicKey.toBase58(),
      amount,
    })
    
    const signature = await transfer(
      connection,
      sender,
      senderTokenAccount.address,
      recipientTokenAccount.address,
      sender.publicKey,
      amount,
      // We get an odd error (only in production builds)
      // when we leave this empty.
      [sender]
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
  senderTokenAccount: PublicKey,
  recipientTokenAccount: PublicKey
) => {
  try {
    const signature = await transfer(
      connection,
      sender,
      senderTokenAccount,
      recipientTokenAccount,
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
