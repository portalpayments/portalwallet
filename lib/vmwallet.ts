import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  Signer,
} from "@solana/web3.js";
import * as bip39 from "bip39";
import { log } from "./functions";
import { scrypt } from "./functions";
import { SOLANA_SEED_SIZE_BYTES, URLS } from "./constants";
import { derivePath } from "ed25519-hd-key";
import { createTransferInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token";

// TODO:
// https://developers.circle.com/docs/usdc-on-testnet
export interface SimpleKeypair {
  path: string;
  publicKey: PublicKey;
  secretKey: Uint8Array;
}

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

  const keyPairs: Array<SimpleKeypair> = [];

  for (let walletIndex = 0; walletIndex < 10; walletIndex++) {
    const path = `m/44'/501'/${walletIndex}'/0'`;
    const keypair = Keypair.fromSeed(
      derivePath(path, seed.toString("hex")).key
    );
    keyPairs.push({
      path,
      publicKey: keypair.publicKey,
      secretKey: keypair.secretKey,
    });
    log(`${path} => ${keypair.publicKey.toBase58()}`);
  }
  return keyPairs;
};

export const connect = async (networkName: string): Promise<Connection> => {
  log(`⚡ Connecting to ${networkName}`);
  const connection = new Connection(URLS[networkName], "confirmed");
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

// https://developers.circle.com/docs/usdc-on-testnet#usdc-on-solana-testnet
const USDC_SOLANA_SPL_TOKEN_ON_DEVNET = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'

export const putTokenIntoWallet = async(connection: Connection, from: Keypair, to: Keypair, amount: number) {
  // Add token transfer instructions to transaction
  const transaction = new Transaction().add(createTransferInstruction(
    from.publicKey, 
    to.publicKey, 
    new PublicKey(USDC_SOLANA_SPL_TOKEN_ON_DEVNET), 
    amount,
    [], 
    TOKEN_PROGRAM_ID
  ))
  
  // Sign transaction, broadcast, and confirm
  await sendAndConfirmTransaction(connection, transaction, [from]);
    
}
