import {
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getAccount,
} from "@solana/spl-token";
import {
  Connection,
  sendAndConfirmTransaction,
  Transaction,
  type Signer,
  type ConfirmOptions,
  type TransactionSignature,
  Transaction as TransactionConstructor,
  Keypair,
  TransactionInstruction,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
import { log } from "./functions";
import { MEMO_PROGRAM } from "./constants";
import { signers } from "arbundles";
import transaction from "arweave/node/lib/transaction";

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

  const isLocalhost =
    connection.rpcEndpoint.includes("127.0.0.1") ||
    connection.rpcEndpoint.includes("localhost");
  if (!isLocalhost) {
    // "The value provided in microLamports will be multiplied by the CU budget to determine the Prioritization Fee in Lamports."
    log(`BIG MONEY BAG 💰💰💰💰 LAMBO MODE 🏎️🏎️🏎️🏎️🏎️🏎️🏎️🏎️`);

    // Values used are from https://twitter.com/vidor_solrise/status/1615076893614657536?s=20&t=RB1LkzcXf28yu9SzDc6RZg
    // 200000 x 5500 / 1000000 = 1100 lamports = still way less than a cent
    transaction.add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: 200_000, // compute units
      })
    );

    transaction.add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 5500, // per compute unit
      })
    );
  }

  // 1. Find out if we need to make token account for the recipient and add an instruction for that if necessary
  // https://solana.stackexchange.com/questions/5571/is-it-possible-to-make-an-ata-in-one-instruction-then-use-that-created-ata-in-t/5573#5573

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
        programId: new PublicKey(MEMO_PROGRAM),
      })
    );
  }

  // We need to add these to get an estimated fee
  let blockhashAndHeight = await connection.getLatestBlockhash("finalized");
  transaction.recentBlockhash = blockhashAndHeight.blockhash;
  transaction.feePayer = ownerAndPayer.publicKey;

  return transaction;
};
