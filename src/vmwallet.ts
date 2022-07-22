import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  Signer,
  TransactionInstruction,
} from "@solana/web3.js";
import * as bip39 from "bip39";
import { log, scrypt } from "./functions";
import {
  SOLANA_SEED_SIZE_BYTES,
  URLS,
  USDC_SOLANA_SPL_TOKEN_ON_DEVNET,
  USD_DECIMALS,
} from "./constants";
import { derivePath } from "ed25519-hd-key";
import {
  createAssociatedTokenAccount,
  createMint,
  createTransferInstruction,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { TokenListProvider } from "@solana/spl-token-registry";
import { getABetterErrorMessage } from "./errors";

export const convertPhraseToSeed = async (
  phrase: string,
  birthday: string
): Promise<Buffer> => {
  log(`🌱 Making seed...`);
  // Use scrypt
  // See https://crypto.stackexchange.com/questions/24514/deterministically-generate-a-rsa-public-private-key-pair-from-a-passphrase-with

  // Will be a Buffer, see https://nodejs.org/docs/latest-v16.x/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback
  let seedBytes = (await scrypt(
    phrase,
    birthday,
    SOLANA_SEED_SIZE_BYTES
  )) as Buffer;

  return seedBytes;
};

export const seedToKeypairs = async (entropy: Buffer, password: string) => {
  log(`👛 Making wallet with seed...`, entropy.toString());
  const mnemonic = bip39.entropyToMnemonic(entropy.toString("hex"));
  // The keypair is the (parent) wallet!
  // See https://github.com/solana-labs/solana/blob/master/web3.js/examples/get_account_info.js
  log(`🤯 Mnemonic is:`, mnemonic);
  const seed = await bip39.mnemonicToSeed(mnemonic, password);

  log(`making keypairs from seed`);

  const keyPairs: Array<Keypair> = [];

  for (let walletIndex = 0; walletIndex < 10; walletIndex++) {
    const path = `m/44'/501'/${walletIndex}'/0'`;
    const keypair = Keypair.fromSeed(
      derivePath(path, seed.toString("hex")).key
    );
    keyPairs.push(keypair);
    log(`${path} => ${keypair.publicKey.toBase58()}`);
  }
  return keyPairs;
};

export const connect = async (networkName: string): Promise<Connection> => {
  log(`⚡ Connecting to ${networkName}`);
  const connection = new Connection(URLS[networkName], "confirmed");
  return connection;
};

// See https://github.com/Bonfida/bonfida-utils/blob/main/js
export const checkAccountExists = async (
  connection: Connection,
  publicKey: PublicKey
): Promise<boolean> => {
  const accountInfo = await connection.getAccountInfo(publicKey);
  if (!accountInfo) {
    return false;
  }
  return true;
};

export const getAccountBalance = async (
  connection: Connection,
  publicKey: PublicKey
) => {
  let accountInfo = await connection.getAccountInfo(publicKey);
  if (!accountInfo) {
    throw new Error(`Could not find account '${publicKey}'`);
  }
  log("💰 Account balance:", accountInfo.lamports);
  return accountInfo.lamports;
};

export const putSolIntoWallet = async (
  connection: Connection,
  publicKey: PublicKey,
  lamports: number
) => {
  log(`💸 Putting Sol into wallet`);
  // Generate a new wallet keypair and airdrop SOL
  var airdropSignature = await connection.requestAirdrop(publicKey, lamports);

  const latestBlockHash = await connection.getLatestBlockhash();

  //wait for airdrop confirmation
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  });
};

export const sendUSDCTokens = async (
  connection: Connection,
  source: Keypair,
  destination: Keypair,
  amount: number
) => {
  // Add token transfer instructions to transaction
  const owner = new PublicKey(USDC_SOLANA_SPL_TOKEN_ON_DEVNET);
  const multisigners: Array<Signer> = [];
  const transaction = new Transaction().add(
    createTransferInstruction(
      source.publicKey,
      destination.publicKey,
      owner,
      amount,
      multisigners,
      TOKEN_PROGRAM_ID
    )
  );

  // Sign transaction, broadcast, and confirm
  await sendAndConfirmTransaction(connection, transaction, [source]);
};

// See https://solanacookbook.com/references/token.html#how-to-create-a-new-token
// Creating tokens is done by creating what is called a "mint account". This mint account is later used to mint tokens to a token account and create the initial supply.

export const createNewToken = async (
  connection: Connection,
  // The fee payer used to create the mint
  feePayer: Keypair,
  // The one account that can mint tokens for this token (this account does not hold the balance)
  mintAuthority: PublicKey
) => {
  try {
    const mintAddress = await createMint(
      connection,
      feePayer,
      mintAuthority,
      null, // Don't both with a freeze address
      USD_DECIMALS
    );
    return mintAddress;
  } catch (thrownObject) {
    const error = thrownObject as Error;
    const fullErrorMessage = getABetterErrorMessage(error.message);
    if (fullErrorMessage) {
      throw new Error(fullErrorMessage);
    }
    throw error;
  }
};

// Get or create the associated token account for the specified `wallet`
// The associated token account will hold this particular token.
export const getOrCreateAssociatedTokenAddress = async (
  connection: Connection,
  tokenMintAccount: PublicKey,
  signer: Keypair,
  token: PublicKey,
  wallet: PublicKey
): Promise<PublicKey> => {
  const associatedTokenAddress = await getAssociatedTokenAddress(
    tokenMintAccount,
    wallet,
    false
  );

  const isExistingAddress = await checkAccountExists(
    connection,
    associatedTokenAddress
  );

  if (isExistingAddress) {
    return associatedTokenAddress;
  }

  await createAssociatedTokenAccount(connection, signer, token, wallet);

  return associatedTokenAddress;
};
