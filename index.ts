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

const birthday = "19810321";

const password = "swag";

const convertPhraseToSeed = async (
  phrase: string,
  birthday: string
): Promise<Buffer> => {
  log(`Making seed...`);
  // Use scrypt
  // See https://crypto.stackexchange.com/questions/24514/deterministically-generate-a-rsa-public-private-key-pair-from-a-passphrase-with

  // Will be a Buffer, see https://nodejs.org/docs/latest-v16.x/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback
  let seedBytes = (await scrypt(phrase, birthday, 32)) as Buffer;

  return seedBytes;
};

const seedToWallet = async (entropy: Buffer, password: string) => {
  log(`Making wallet with seed...`, entropy.toString());
  log(`A`);
  const mnemonic = bip39.entropyToMnemonic(entropy.toString("hex"));
  // The keypair is the (parent) wallet!
  // See https://github.com/solana-labs/solana/blob/master/web3.js/examples/get_account_info.js
  log(`mnemonic`, mnemonic);
  log(`B`);
  const seed = await bip39.mnemonicToSeed(mnemonic, password);

  // TODO: what is bip44
  log(`making keypair from seed`);
  const keypair = solanaWeb3.Keypair.fromSeed(
    seed.subarray(0, SOLANA_SEED_SIZE_BYTES)
  );
  log(`D`);
  return keypair;
};

const putSolIntoWallet = async (
  connection: solanaWeb3.Connection,
  publicKey: solanaWeb3.PublicKey
) => {
  log(`Putting Sol into wallet`);
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
    const seed = await convertPhraseToSeed(phrase, birthday);
    const wallet = await seedToWallet(seed, password);
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
