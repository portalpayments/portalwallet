// Best docs https://spl.solana.com/token#example-creating-your-own-fungible-token
// OK docs: https://solanacookbook.com/references/token.html#how-to-create-a-new-token
// MUCH BETTER explanation, but with older code samples: https://github.com/jacobcreech/Token-Creator

import type { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { PublicKey as PublicKeyConstructor } from "@solana/web3.js";

import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintToChecked,
  transfer,
} from "@solana/spl-token";
import type { Account } from "@solana/spl-token";

import { USDC_MAINNET_MINT_ACCOUNT, USD_DECIMALS } from "./constants";
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
      senderTokenAccount: senderTokenAccount.address.toBase58(),
      recipientTokenAccount: recipientTokenAccount.address.toBase58(),
      senderPublicKey: sender.publicKey.toBase58(),
      amount,
    });

    const signature = await transfer(
      connection,
      sender,
      senderTokenAccount.address,
      recipientTokenAccount.address,
      sender.publicKey,
      amount,
      [],
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

export const makeAccountsAndDoTransfer = async (
  connection: Connection,
  senderKeyPair: Keypair,
  transferAmountInMinorUnits: number,
  recipient: PublicKey,
  isProduction: boolean
) => {
  log(`Doing transfer, will send ${transferAmountInMinorUnits} cents`);

  if (!isProduction) {
    throw new Error(`TODO: implement support for other networks`);
  }

  const usdcMintAccount = new PublicKeyConstructor(USDC_MAINNET_MINT_ACCOUNT);

  const senderTokenAccount = await makeTokenAccount(
    connection,
    senderKeyPair,
    usdcMintAccount,
    senderKeyPair.publicKey
  );

  log(
    `Made / found our USDC token account`,
    senderTokenAccount.address.toBase58()
  );

  const recipientTokenAccount = await makeTokenAccount(
    connection,
    senderKeyPair,
    usdcMintAccount,
    recipient
  );

  log(
    `Made / found recipient's USDC token account`,
    recipientTokenAccount.address.toBase58()
  );

  const signature = await sendUSDC(
    connection,
    senderKeyPair,
    senderTokenAccount,
    recipientTokenAccount,
    transferAmountInMinorUnits
  );

  return signature;
};
