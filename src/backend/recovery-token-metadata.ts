// See https://solana.stackexchange.com/questions/5524/how-do-i-mint-an-spl-token-with-custom-metadata-using-solana-web3-js-and-solan/5526#5526
import {
  Transaction,
  type PublicKey,
  PublicKey as PublicKeyConstructor,
  Connection,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  createCreateMetadataAccountV2Instruction,
  type DataV2,
} from "@metaplex-foundation/mpl-token-metadata";
import { log } from "console";
import { Buffer } from "buffer";
import { createMint } from "@solana/spl-token";

// Use a read URL for your connection, and a real user.
const connection = new Connection("...");
const steve = new Keypair();

const METAPLEX_TOKEN_METADATA_PROGRAM_ADDRESS =
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";

const metaplexTokenMetadataProgram = new PublicKeyConstructor(
  METAPLEX_TOKEN_METADATA_PROGRAM_ADDRESS
);

const createMetadataAccount = async (
  metadataPDA: PublicKey,
  mint: PublicKey,
  payer: PublicKey,
  metadataData: any
) => {
  // https://metaplex-foundation.github.io/metaplex-program-library/docs/token-metadata/index.html#createCreateMetadataAccountV2Instruction
  const transaction = new Transaction().add(
    createCreateMetadataAccountV2Instruction(
      {
        metadata: metadataPDA,
        mint: mint,
        mintAuthority: payer,
        payer: payer,
        updateAuthority: payer,
      },
      {
        createMetadataAccountArgsV2: {
          data: metadataData,
          isMutable: true,
        },
      }
    )
  );
  return transaction;
};

const getMetadataPDA = (mint: PublicKey): PublicKeyConstructor => {
  return PublicKeyConstructor.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      metaplexTokenMetadataProgram.toBuffer(),
      mint.toBuffer(),
    ],
    metaplexTokenMetadataProgram
  )[0];
};

// Doesn't have to be DataV2.
const metadata: DataV2 = {
  name: "Portal Recovery Token",
  symbol: "Test",
  uri: "", // Arweave URI link which uses metaplex standard
  sellerFeeBasisPoints: 0,
  creators: null,
  collection: null,
  uses: null,
};

const addMetadata = async (mintAddress: PublicKey, connection: Connection) => {
  const metadataAccount = await getMetadataPDA(mintAddress);
  const transactionToSend = await createMetadataAccount(
    metadataAccount,
    mintAddress,
    steve.publicKey,
    metadata
  );
  const transactionId = await sendAndConfirmTransaction(
    connection,
    transactionToSend,
    [steve]
  );
  log(transactionId);
};

export const mintNFT = async () => {
  // Create a SPL token first with supply = 1 and decimal = 0 so the wallets can identify your asset (done, easy!)
  const mintAddress = await createMint(
    connection,
    steve,
    steve.publicKey,
    steve.publicKey,
    0
  );
  // Create another account preferably derived from the mint address of your SPL token using PDAs
  // Finally, save your custom metadata in the second account and use it in any way you need.
  // To create metadata account on any SPL token you can create using (JS version)
  const transactionId = await addMetadata(mintAddress, connection);

  return transactionId;
};
