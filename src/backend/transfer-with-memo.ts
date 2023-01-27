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

// Taken from the internal function getSigners()
// from spl-token/src/actions/internal.ts
// (not modified)
export function getSigners(
  signerOrMultisig: Signer | PublicKey,
  multiSigners: Signer[]
): [PublicKey, Signer[]] {
  return signerOrMultisig instanceof PublicKey
    ? [signerOrMultisig, multiSigners]
    : [signerOrMultisig.publicKey, [signerOrMultisig]];
}

// Taken from
// import { transfer } from "@solana/spl-token";
// And modified to add 'memo'
// And remove redundant options.
export async function transferWithMemo(
  connection: Connection,
  // Original code just calls these 'source' and 'destination' but let's be clearer
  sourceTokenAccount: PublicKey,
  destinationTokenAccount: PublicKey,
  ownerAndPayer: Keypair,
  amount: number | bigint,
  memo: string | null = null
): Promise<TransactionSignature> {
  // These were moved out of the original transfer since they're static

  // SPL Token program account
  const programId = TOKEN_PROGRAM_ID;

  // Payer of the transaction fees
  const payer = ownerAndPayer;

  // Signing accounts if `owner` is a multisig
  const multiSigners: Array<Signer> = [];

  // confirmOptions Options for confirming the transaction
  const confirmOptions: ConfirmOptions = {
    // https://solanacookbook.com/guides/retrying-transactions.html#facts
    maxRetries: 6,
  };

  log(`Sending tokens with memo "${memo}"`);
  const [ownerPublicKey, signers] = getSigners(ownerAndPayer, multiSigners);

  const transaction = new Transaction().add(
    createTransferInstruction(
      sourceTokenAccount,
      destinationTokenAccount,
      ownerPublicKey,
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

  return sendAndConfirmTransaction(
    connection,
    transaction,
    [payer, ...signers],
    confirmOptions
  );
}
