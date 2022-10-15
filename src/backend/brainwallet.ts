// Causes browser to complain about 'process is not defined'
import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import { SOLANA_SEED_SIZE_BYTES } from "./constants";
import { log } from "./functions";

import * as bip39 from "bip39";

// @ts-ignore
import { async as scriptAsync } from "scryptsy";

// Also called the 'seed'.
export const personalPhraseToEntopy = async (
  phrase: string,
  password: string
): Promise<Buffer> => {
  log(`🌱 Converting personal phrase to seed...`);

  // scryptsy is an ascrypt implementation that works in both the browser and node

  const numberOfInterations = 16384;
  // Values from https://www.npmjs.com/package/scryptsy#scryptkey-salt-n-r-p-keylenbytes-progresscallback
  const memory = 8;
  const parellisation = 8;
  // @ts-ignore - ypes are out of date I think
  let entropy = (await scriptAsync(
    phrase,
    password,
    numberOfInterations,
    memory,
    parellisation,
    SOLANA_SEED_SIZE_BYTES
  )) as Buffer;

  return entropy;
};

export const entropyToMnemonic = (entropy: Buffer) => {
  log(`👛 Making wallet with entropy...`, entropy.toString());
  const mnemonic = bip39.entropyToMnemonic(entropy.toString("hex"));
  return mnemonic;
};

export const mnemonicToKeypairs = async (
  mnemonic: string,
  password: string
) => {
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
