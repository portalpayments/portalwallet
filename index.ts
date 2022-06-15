#!/usr/bin/env ts-node

// https://solana-labs.github.io/solana-web3.js/

import * as solanaWeb3 from "@solana/web3.js";
import { promisify } from "util";

// Convert `fs.readFile()` into a function that takes the
// same parameters but returns a promise.
import { scrypt as scryptCallback, scryptSync } from "crypto";

const scrypt = promisify(scryptCallback);

const log = console.log.bind(console);

const print = (object: unknown) => {
  return JSON.stringify(object, null, 2);
};

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

const birthday = "19810321";

const convertPhraseToSeed = async (
  phrase: string,
  birthday: string
): Promise<Uint8Array> => {
  // Use scrypt
  // See https://crypto.stackexchange.com/questions/24514/deterministically-generate-a-rsa-public-private-key-pair-from-a-passphrase-with

  // Will be a Buffer, see https://nodejs.org/docs/latest-v16.x/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback
  // We could also just do:
  // const seedBytes = scryptSync(phrase, birthday, 32);
  const seedBytes = (await scrypt(phrase, birthday, 32)) as Buffer;

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
    const seed = await convertPhraseToSeed(phrase, birthday);
    log(`Making wallet with seed...`, seed);
    const wallet = await seedToWallet(seed);
    log(
      `Wallet:`,
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
    log(`Putting Sol into wallet`);
    await putSolIntoWallet(connection, wallet.publicKey);
    let account = await connection.getAccountInfo(wallet.publicKey);
    log("Account:", print(account));
  } catch (thrownObject) {
    const error = thrownObject as Error;
    log(error.message);
  }
})();
