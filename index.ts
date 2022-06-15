#!/usr/bin/env ts-node

// https://crypto.stackexchange.com/questions/24514/deterministically-generate-a-rsa-public-private-key-pair-from-a-passphrase-with

// https://solana-labs.github.io/solana-web3.js/

// import { randomBytes } from "node:crypto";
// import { privateToPublic } from "ethereumjs-util";
import * as solanaWeb3 from "@solana/web3.js";
import * as crypto from "crypto";
import * as bcrypt from "bcrypt";

const log = console.log.bind(console);

const print = (object: unknown) => {
  return JSON.stringify(object, null, 2);
};

const SOLANA_CLUSTER = "devnet";

const SOLANA_SEED_SIZE_BYTES = 32;

const phrase = `Say your prayers, little one
Don't forget, my son
To include everyone

I tuck you in, warm within
Keep you free from sin
Till the Sandman he comes
`;

const convertPhraseToSeed = async (phrase: string): Promise<Uint8Array> => {
  // bitaddress.org / ninjawallet (really oldand lots of polyfills)
  // var seedString = Crypto.SHA256(key, { asBytes: true });

  // https://keybase.io/warp/warp_1.0.9_SHA256_a2067491ab582bde779f4505055807c2479354633a2216b22cf1e92d1a6e4a87.html / warpwallet

  // const seedHashInHex = crypto
  //   .createHash("sha256")
  //   .update(phrase)
  //   .digest("hex");

  // Crypto.createHmac( 'sha256', buffer)
  // const seedHashInHex = crypto.createHmac("sha256", phrase);
  const salt = await bcrypt.genSalt(10);
  const seedHashInHex = await bcrypt.hash(phrase, salt);

  // From https://nodejs.org/api/buffer.html#buffer_buffer
  // 'The Buffer class is a subclass of JavaScript's Uint8Array class'
  const seedBytes = Buffer.from(seedHashInHex);

  if (seedBytes.length !== SOLANA_SEED_SIZE_BYTES) {
    log(`seedBytes was ${seedBytes.length} in size, truncting`);
    return seedBytes.subarray(0, SOLANA_SEED_SIZE_BYTES);
  }
  return seedBytes;
};

const seedToWallet = (seed: Uint8Array) => {
  // The keypair is the wallet!
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
    const seed = await convertPhraseToSeed(phrase);
    log(`Making wallet...`);
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
    // const Solana = new solanaWeb3.Connection(
    //   "YOUR_QUICKNODE_HTTP_PROVIDER__HERE"
    // );
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
