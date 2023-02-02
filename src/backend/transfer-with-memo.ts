import { TOKEN_PROGRAM_ID, createTransferInstruction } from "@solana/spl-token";
import {
  Connection,
  sendAndConfirmTransaction,
  Transaction,
  type Signer,
  type ConfirmOptions,
  type TransactionSignature,
  TransactionInstruction,
  Keypair,
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

// Taken from
// import { transfer } from "@solana/spl-token";
// And modified to add 'memo'
// And remove redundant options.
export const makeTransaction = async (
  connection: Connection,
  // Original code just calls these 'source' and 'destination' but let's be clearer
  sourceTokenAccount: PublicKey,
  destinationTokenAccount: PublicKey,
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

  const transaction = new Transaction().add(
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
