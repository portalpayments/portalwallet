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

// Looks like a small bug in scryptsy types
// @ts-ignore
import { async as scryptAsync } from "scryptsy";

if (!globalThis.setImmediate) {
  // Fixes 'ReferenceError: setImmediate is not defined' when running in browser
  // @ts-ignore
  globalThis.setImmediate = (func: Function) => setTimeout(func, 0);
}

// "Scheme described in BIP44 should use 44' as purpose."
// See https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki and
// See https://github.com/bitcoin/bips/blob/master/bip-0043.mediawiki
const PURPOSE = 44;

// See https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki and
// See https://github.com/satoshilabs/slips/blob/master/slip-0044.md
const SOLANA_COIN_TYPE = 501;

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

  for (let accountIndex = 0; accountIndex < 10; accountIndex++) {
    const path = `m/${PURPOSE}'/${SOLANA_COIN_TYPE}'/${accountIndex}'/0'`;
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
