// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//

import { SOLANA_SEED_SIZE_BYTES } from "./constants";
import { log, toArrayBuffer } from "./functions";

// Looks like a small bug in scryptsy types
// @ts-ignore
import { async as scryptAsync } from "scryptsy";
import { buffer } from "stream/consumers";
import {
  getRandomValues,
  encryptWithAESGCM,
  decryptWithAESGCM,
} from "./encryption";
import { cleanPhrase } from "./phrase-cleaning";

if (!globalThis.setImmediate) {
  // Fixes 'ReferenceError: setImmediate is not defined' when running in browser
  // @ts-ignore
  globalThis.setImmediate = (func: Function) => setTimeout(func, 0);
}

// Also called the 'seed'.
export const personalPhraseToEntropy = async (
  phrase: string,
  password: string
): Promise<ArrayBuffer> => {
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

  // Webcrypto prefers ArrayBuffer
  // but our scrypt implementation uses Buffer
  // TODO: we could use a browser version of node crypto?
  const arrayBuffer = toArrayBuffer(entropy);
  return arrayBuffer;
};

// WebCrypto ingests secrets as CryptoKeys to stop malicious apps from say extracting keys
export const importKey = async (entropy: ArrayBuffer): Promise<CryptoKey> => {
  return crypto.subtle.importKey("raw", entropy, "AES-GCM", true, [
    "encrypt",
    "decrypt",
  ]);
};

export const makeRecoveryTokenPayload = async (
  secretKey: Uint8Array,
  personalPhrase: string,
  walletUnlockPassword: string
) => {
  // Step 0 - normalize personal phrase
  const cleanedPersonalPhrase = cleanPhrase(personalPhrase);

  // Step 1 - use personal phrase and wallet unlock to build entropy
  const entropy = await personalPhraseToEntropy(
    cleanedPersonalPhrase,
    walletUnlockPassword
  );

  const encryptionKey = await importKey(entropy);

  // Step 2 - make an IV and store it in the resulting NFT
  const initialisationVector: Uint8Array = await getRandomValues();

  // Step 3 - encrypt the secret key, using the entropy and IV we just made
  const cipherText = await encryptWithAESGCM(
    secretKey.toString(),
    initialisationVector,
    encryptionKey
  );

  return {
    cipherText,
    initialisationVector,
  };
};

export const recoverFromToken = async (
  personalPhrase: string,
  walletUnlockPassword: string,
  cipherText: ArrayBuffer,
  initialisationVector: Uint8Array
): Promise<unknown> => {
  // Step 0 - normalize personal phrase
  const cleanedPersonalPhrase = cleanPhrase(personalPhrase);

  // Step 1 - use personal phrase and wallet unlock to rebuild entropy
  const entropy = await personalPhraseToEntropy(
    cleanedPersonalPhrase,
    walletUnlockPassword
  );

  const decryptionKey = await importKey(entropy);

  // Step 3 - decrypt the AES

  const decryptedData = await decryptWithAESGCM(
    cipherText,
    initialisationVector,
    decryptionKey
  );
  return decryptedData;
};
