// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
// Best docs https://spl.solana.com/token#example-creating-your-own-fungible-token
// OK docs: https://solanacookbook.com/references/token.html#how-to-create-a-new-token
// MUCH BETTER explanation, but with older code samples: https://github.com/jacobcreech/Token-Creator

import {
  sendAndConfirmTransaction,
  type Connection,
  type Keypair,
  type PublicKey,
  Transaction as TransactionConstructor,
  ComputeBudgetProgram,
  Transaction,
  TransactionInstruction,
  type Signer,
} from "@solana/web3.js";
import { PublicKey as PublicKeyConstructor } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getAccount,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintToChecked,
  type Account,
} from "@solana/spl-token";
import { log } from "./functions";
import { getCurrencyBySymbol, MEMO_PROGRAM } from "./constants";
import { getABetterErrorMessage } from "./errors";
import type { BasicTokenAccount, CurrencyDetails } from "./types";
import { checkIsLocalhost } from "./check-localhost";

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

export const makeAccountsAndDoTransfer = async (
  connection: Connection,
  sender: Keypair,
  transferAmountInMinorUnits: number,
  currency: CurrencyDetails,
  recipient: PublicKey,
  memo: string
) => {
  log(`Doing transfer, will send ${transferAmountInMinorUnits} cents`);

  const mintAccount = new PublicKeyConstructor(currency.mintAddress);

  const senderTokenAccount = await makeTokenAccount(
    connection,
    sender,
    mintAccount,
    sender.publicKey
  );

  log(
    `Made / found our USDC token account`,
    senderTokenAccount.address.toBase58()
  );

  console.time(`making transaction`);
  const transaction = await makeTransaction(
    connection,
    senderTokenAccount.address,
    recipient,
    sender,
    transferAmountInMinorUnits,
    new PublicKeyConstructor(currency.mintAddress),
    memo
  );
  console.timeEnd(`making transaction`);

  console.time(`sending and confirming transaction`);
  const signature = sendAndConfirmTransaction(
    connection,
    transaction,
    [sender],
    {
      // https://solanacookbook.com/guides/retrying-transactions.html#facts
      maxRetries: 6,
      // We're sending tokens, we don't have anything to do afterwards (eg like do something with the moved tokens etc) so let's have less confirmation.
      commitment: "confirmed",
    }
  );
  console.time(`sending and confirming transaction`);

  return signature;
};

export const getFeeForTransaction = async (
  connection: Connection,
  transaction: Transaction
): Promise<number> => {
  const fee = await transaction.getEstimatedFee(connection);
  return fee;
};

export const checkTokenAccountCreated = async (
  connection,
  receiverTokenAccountAddress
) => {
  // Check if the receiver's token account exists
  try {
    await getAccount(
      connection,
      receiverTokenAccountAddress,
      "confirmed",
      TOKEN_PROGRAM_ID
    );
    return true;
  } catch {
    return false;
  }
};

// Taken from
// import { transfer } from "@solana/spl-token";
// And modified to add 'memo'
// And remove redundant options.
//
// Note this creates the transaction object, and doesn't actually execute the transaction.
export const makeTransaction = async (
  connection: Connection,
  // Original code just calls these 'source' and 'destination' but let's be clearer
  sourceTokenAccount: PublicKey,
  recipientWalletAddress: PublicKey,
  ownerAndPayer: Keypair,
  amount: number | bigint,
  mintAddress: PublicKey,
  memo: string | null = null
): Promise<Transaction> => {
  // These were moved out of the original transfer since they're static

  // SPL Token program account
  const programId = TOKEN_PROGRAM_ID;

  // Signing accounts if `owner` is a multisig
  const multiSigners: Array<Signer> = [];

  log(`TODO: make recipient account for `, mintAddress);

  log(`Sending tokens with memo "${memo}"`);

  const transaction = new TransactionConstructor();

  // 1M microlamports = 1 lamport
  // computeUnitLimit of 1Million units * computeUnitPrice of one microlamport = 1 lamport
  // Transaction now costs 5000 (normal price) + 1 lamport
  // See https://solanacookbook.com/references/basic-transactions.html#how-to-change-compute-budget-fee-priority-for-a-transaction

  // Normal transaction price is 5000 lamports per signature
  // TODO: remove when
  // https://solana.stackexchange.com/questions/5600/error-downloading-the-computebudget-program-to-use-on-local-validator
  // is resolved

  if (!checkIsLocalhost(connection.rpcEndpoint)) {
    // "The value provided in microLamports will be multiplied by the CU budget to determine the Prioritization Fee in Lamports."
    log(`Adding priority fee`);

    transaction.add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 200_000, // compute units
      })
    );

    transaction.add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 5500, // lamports per compute unit
      })
    );
  }

  // Find out if we need to make token account for the recipient and add an instruction for that if necessary

  // Get the reciever token account address (even if it doesn't exist yet)
  let destinationTokenAccount = await getAssociatedTokenAddress(
    mintAddress,
    recipientWalletAddress
  );

  if (checkTokenAccountCreated(connection, destinationTokenAccount)) {
    log(`Token account already exists, no need to make it`);
  } else {
    log(`Token account does not exist, adding instruction to make it`);
    // If the account does not exist, add the create account instruction to the transaction
    // Logic from node_modules/@solana/spl-token/src/actions/getOrCreateAssociatedTokenAccount.ts
    transaction.add(
      createAssociatedTokenAccountInstruction(
        ownerAndPayer.publicKey,
        destinationTokenAccount,
        recipientWalletAddress,
        mintAddress,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );
  }

  transaction.add(
    createTransferInstruction(
      sourceTokenAccount,
      destinationTokenAccount,
      ownerAndPayer.publicKey,
      amount,
      multiSigners,
      programId
    )
  );

  // 'memo' is added by us
  // See https://solana.stackexchange.com/questions/3789/how-do-i-add-a-note-memo-to-my-solana-transactions-using-web3-js
  // Don't bother adding if memo is an empty string
  if (memo && memo.length) {
    await transaction.add(
      new TransactionInstruction({
        keys: [
          { pubkey: ownerAndPayer.publicKey, isSigner: true, isWritable: true },
        ],
        data: Buffer.from(memo, "utf-8"),
        programId: new PublicKeyConstructor(MEMO_PROGRAM),
      })
    );
  }

  // We need to add these to get an estimated fee
  let blockhashAndHeight = await connection.getLatestBlockhash("finalized");
  transaction.recentBlockhash = blockhashAndHeight.blockhash;
  transaction.feePayer = ownerAndPayer.publicKey;

  return transaction;
};
