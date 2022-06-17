import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import * as bip39 from "bip39";
import { log, scrypt, print } from "./utils";

const SOLANA_CLUSTER = "devnet";

// From https://solana-labs.github.io/solana-web3.js/classes/Keypair.html#fromSeed
// 'Generate a keypair from a 32 byte seed.'
const SOLANA_SEED_SIZE_BYTES = 32;

export const convertPhraseToSeed = async (
  phrase: string,
  birthday: string
): Promise<Buffer> => {
  log(`🌱 Making seed...`);
  // Use scrypt
  // See https://crypto.stackexchange.com/questions/24514/deterministically-generate-a-rsa-public-private-key-pair-from-a-passphrase-with

  // Will be a Buffer, see https://nodejs.org/docs/latest-v16.x/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback
  let seedBytes = (await scrypt(phrase, birthday, 32)) as Buffer;

  return seedBytes;
};

export const seedToWallet = async (entropy: Buffer, password: string) => {
  log(`👛 Making wallet with seed...`, entropy.toString());
  const mnemonic = bip39.entropyToMnemonic(entropy.toString("hex"));
  // The keypair is the (parent) wallet!
  // See https://github.com/solana-labs/solana/blob/master/web3.js/examples/get_account_info.js
  log(`🤯 Mnemonic is:`, mnemonic);
  const seed = await bip39.mnemonicToSeed(mnemonic, password);

  // TODO: what is bip44
  log(`making keypair from seed`);
  const keypair = Keypair.fromSeed(seed.subarray(0, SOLANA_SEED_SIZE_BYTES));
  log(
    `Wallet:`,
    print({
      public: keypair.publicKey.toString(),
      private: keypair.secretKey.toString(),
    })
  );
  return keypair;
};

export const connect = async (): Promise<Connection> => {
  log(`⚡ Connecting to Solana devnet`);
  const connection = new Connection(clusterApiUrl(SOLANA_CLUSTER), "confirmed");
  return connection;
};

export const getAccountBalance = async (
  connection: Connection,
  publicKey: PublicKey
) => {
  let account = await connection.getAccountInfo(publicKey);
  if (!account) {
    throw new Error(`Could not find account '${publicKey}'`);
  }
  log("💰 Account balance:", account.lamports);
  return account.lamports;
};

export const putSolIntoWallet = async (
  connection: Connection,
  publicKey: PublicKey
) => {
  log(`💸 Putting Sol into wallet`);
  // Generate a new wallet keypair and airdrop SOL
  var airdropSignature = await connection.requestAirdrop(
    publicKey,
    LAMPORTS_PER_SOL
  );

  const latestBlockHash = await connection.getLatestBlockhash();

  //wait for airdrop confirmation
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  });
};

export const makeFullWalletWithTokens = async (
  phrase: string,
  fullName: string,
  password: string
) => {
  try {
    const seed = await convertPhraseToSeed(phrase, fullName);
    const wallet = await seedToWallet(seed, password);
    const connection = await connect();
    const balanceBefore = await getAccountBalance(connection, wallet.publicKey);
    await putSolIntoWallet(connection, wallet.publicKey);
    const balanceAfter = await getAccountBalance(connection, wallet.publicKey);
    log(
      `balanceBefore ${balanceBefore}, ${balanceAfter}, Visit https://explorer.solana.com/address/${wallet.publicKey.toString()}?cluster=devnet`
    );
    return balanceAfter;
  } catch (thrownObject) {
    const error = thrownObject as Error;
    log(error.message);
    throw error;
  }
};
