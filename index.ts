#!/usr/bin/env ts-node

// https://solana-labs.github.io/solana-web3.js/

// Note we can't make a nemonic, as that's the seed phrase
// From nemonic -> master HD keypair -> child HD keypairs

import * as solanaWeb3 from "@solana/web3.js";
import * as bip39 from "bip39";
import { log, scrypt, print } from "./lib/utils";

const SOLANA_CLUSTER = "devnet";

// Generate a keypair from a 32 byte seed.
// https://solana-labs.github.io/solana-web3.js/classes/Keypair.html#fromSeed
const SOLANA_SEED_SIZE_BYTES = 32;

const phrase = `Say your prayers, little one
Don't forget, my son
To include everyone

I tuck you in, warm within
Keep you free from sin
Till the Sandman he comes
`;

// TODO: use a less crappy salt
const salt = "19810321";

const convertPhraseToSeed = async (
  phrase: string,
  salt: string
): Promise<Uint8Array> => {
  // Use scrypt
  // See https://crypto.stackexchange.com/questions/24514/deterministically-generate-a-rsa-public-private-key-pair-from-a-passphrase-with

  // Will be a Buffer, see https://nodejs.org/docs/latest-v16.x/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback
  const seedBytes = (await scrypt(phrase, salt, 32)) as Buffer;

  if (seedBytes.length !== SOLANA_SEED_SIZE_BYTES) {
    log(`seedBytes was ${seedBytes.length} in size, truncting`);
    return seedBytes.subarray(0, SOLANA_SEED_SIZE_BYTES);
  }
  return seedBytes;
};

const seedToWallet = (seed: Uint8Array) => {
  // The keypair is the (parent) wallet!
  // See https://github.com/solana-labs/solana/blob/master/web3.js/examples/get_account_info.js
  const wallet = solanaWeb3.Keypair.fromSeed(seed);

  return wallet;
};

const putSolIntoWallet = async (
  connection: solanaWeb3.Connection,
  publicKey: solanaWeb3.PublicKey
) => {
  log(`Putting Sol into wallet`, publicKey);
  // Generate a new wallet keypair and airdrop SOL
  var airdropSignature = await connection.requestAirdrop(
    publicKey,
    solanaWeb3.LAMPORTS_PER_SOL
  );

  const latestBlockHash = await connection.getLatestBlockhash();

  //wait for airdrop confirmation
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  });
};

(async () => {
  try {
    log(`Making seed`);
    const seed = await convertPhraseToSeed(phrase, salt);
    log(`Making wallet with seed...`, seed);
    const wallet = await seedToWallet(seed);
    log(`Wallet`, wallet);
    log(
      `Wallet keys:`,
      print({
        public: wallet.publicKey.toString(),
        private: wallet.secretKey.toString(),
      })
    );
    log(`Connecting to Solana devnet`);
    const connection = new solanaWeb3.Connection(
      solanaWeb3.clusterApiUrl(SOLANA_CLUSTER),
      "confirmed"
    );
    log(`Latest epoch:`);
    const epochInfo = await connection.getEpochInfo();
    log(print(epochInfo));
    await putSolIntoWallet(connection, wallet.publicKey);
    let account = await connection.getAccountInfo(wallet.publicKey);
    log("Account:", print(account));
    log(
      `Visit https://explorer.solana.com/address/${wallet.publicKey.toString()}?cluster=devnet`
    );
  } catch (thrownObject) {
    const error = thrownObject as Error;
    log(error.message);
  }
})();
