import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as bip39 from "bip39";
import { log } from "./functions";
import { scrypt } from "./node-functions";
import {
  SOLANA_SEED_SIZE_BYTES,
  URLS,
  USDC_MAINNET_MINT_ACCOUNT,
} from "./constants";
import { derivePath } from "ed25519-hd-key";
import bs58 from "bs58";

// Causes browser to complain about 'process is not defined'
// TODO: use browser version of scrypt
// export const convertPhraseToSeed = async (
//   phrase: string,
//   birthday: string
// ): Promise<Buffer> => {
//   log(`🌱 Making seed...`);
//   // Use scrypt
//   // See https://crypto.stackexchange.com/questions/24514/deterministically-generate-a-rsa-public-private-key-pair-from-a-passphrase-with

//   // Will be a Buffer, see https://nodejs.org/docs/latest-v16.x/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback
//   let seedBytes = (await scrypt(
//     phrase,
//     birthday,
//     SOLANA_SEED_SIZE_BYTES
//   )) as Buffer;

//   return seedBytes;
// };

export const getKeypairFromString = (privateKeyString: string) => {
  return Keypair.fromSecretKey(bs58.decode(privateKeyString));
};

export const getUSDCAccounts = async (
  connection: Connection,
  publicKey: PublicKey,
  usdcMintAccount = USDC_MAINNET_MINT_ACCOUNT
) => {
  let parsedTokenAccountsByOwner =
    await connection.getParsedTokenAccountsByOwner(publicKey, {
      mint: new PublicKey(usdcMintAccount),
    });
  return parsedTokenAccountsByOwner.value;
};

// Causes browser to complain about 'Error: Module "events" has been externalized for browser compatibility.'
// TODO: use events polyfill
// export const seedToKeypairs = async (entropy: Buffer, password: string) => {
//   log(`👛 Making wallet with seed...`, entropy.toString());
//   const mnemonic = bip39.entropyToMnemonic(entropy.toString("hex"));
//   // The keypair is the (parent) wallet!
//   // See https://github.com/solana-labs/solana/blob/master/web3.js/examples/get_account_info.js
//   log(`🤯 Mnemonic is:`, mnemonic);
//   const seed = await bip39.mnemonicToSeed(mnemonic, password);

//   log(`making keypairs from seed`);

//   const keyPairs: Array<Keypair> = [];

//   for (let walletIndex = 0; walletIndex < 10; walletIndex++) {
//     const path = `m/44'/501'/${walletIndex}'/0'`;
//     const keypair = Keypair.fromSeed(
//       derivePath(path, seed.toString("hex")).key
//     );
//     keyPairs.push(keypair);
//     log(`${path} => ${keypair.publicKey.toBase58()}`);
//   }
//   return keyPairs;
// };

export const connect = async (
  networkName: keyof typeof URLS
): Promise<Connection> => {
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
