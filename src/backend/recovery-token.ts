// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
// Causes browser to complain about 'process is not defined'
import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import { SOLANA_SEED_SIZE_BYTES } from "./constants";
import { log } from "./functions";

import * as bip39 from "bip39";
import * as base58 from "bs58";

if (!globalThis.setImmediate) {
  // Fixes 'ReferenceError: setImmediate is not defined' when running in browser
  // @ts-ignore
  globalThis.setImmediate = (func: Function) => setTimeout(func, 0);
}

// Looks like a small bug in scryptsy types
// @ts-ignore
import { async as scryptAsync } from "scryptsy";

export const seedToKeypair = (seed: Buffer) => {
  // Ugly code to avoid a warning when doing '.fromSeed(seed.slice(0, 32));'
  // Per https://solanacookbook.com/references/keypairs-and-wallets.html#how-to-restore-a-keypair-from-a-mnemonic-phrase
  return Keypair.fromSeed(Uint8Array.prototype.slice.call(seed, 0, 32));
};

// Also called the 'seed'.
export const personalPhraseToEntropy = async (
  phrase: string,
  password: string
): Promise<Buffer> => {
  log(`🌱 Converting personal phrase to seed...`);

  // scryptsy is an ascrypt implementation that works in both the browser and node

  // CPU/memory cost parameter – must be a power of 2, also called 'N'
  const numberOfIterations = 2 ** 14;
  // Values from https://www.npmjs.com/package/scryptsy#scryptkey-salt-n-r-p-keylenbytes-progresscallback
  const memory = 8;
  const parellisation = 8;
  // @ts-ignore - types are out of date I think
  let entropy = (await scryptAsync(
    phrase,
    password,
    numberOfIterations,
    memory,
    parellisation,
    SOLANA_SEED_SIZE_BYTES
  )) as Buffer;

  return entropy;
};

export const entropyToMnemonic = (entropy: Buffer) => {
  log(`👛 Making wallet with entropy...`);
  const mnemonic = bip39.entropyToMnemonic(entropy.toString("hex"));
  return mnemonic;
};

export const mnemonicToKeypairs = async (
  mnemonic: string,
  password: string
) => {
  // The seed is the parent to many wallets
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

export const checkIfSecretKeyIsValid = (suggestedSecretKey: string) => {
  try {
    const secretKey = base58.decode(suggestedSecretKey);
    Keypair.fromSecretKey(secretKey);
    return true;
  } catch (thrownObject) {
    return false;
  }
};

export const checkIfMnemonicPhraseIsValid = (
  suggestedMnemonicPhrase: string
) => {
  return bip39.validateMnemonic(suggestedMnemonicPhrase);
};
