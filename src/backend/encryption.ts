// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import { log, sleep, stringify } from "../backend/functions";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export const getRandomValues = () => {
  return crypto.getRandomValues(new Uint8Array(16));
};

// Use a key derivation function (rather than a hashing function) to slow down
// the password -> key process and hence slow down brute-force attacks.
// Was 'getDerivation' from https://medium.com/perimeterx/fun-times-with-webcrypto-part-2-encrypting-decrypting-dfb9fadba5bc
const passwordToDerivedKey = async (password: string, salt: Uint8Array) => {
  const length = 256;
  const passwordBuffer = textEncoder.encode(password);

  const importedKey = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      hash: "SHA-256",
      iterations: 100_000,
    },
    importedKey,
    length
  );
  return derivedKey;
};

export const passwordToKey = async (password: string, salt: Uint8Array) => {
  // From https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey
  // TODO: move to https://security.stackexchange.com/questions/16354/whats-the-advantage-of-using-pbkdf2-vs-sha256-to-generate-an-aes-encryption-key
  const rawKey = await passwordToDerivedKey(password, salt);
  return crypto.subtle.importKey("raw", rawKey, "AES-GCM", true, [
    "encrypt",
    "decrypt",
  ]);
};

export const encryptWithAESGCM = async (
  payload: unknown,
  initialisationVector: Uint8Array,
  key: CryptoKey
): Promise<ArrayBuffer> => {
  // 1. To JSON
  const jsonPlainText = stringify(payload);
  // 2. Encode as Uint8Array
  const encodedText = textEncoder.encode(jsonPlainText);
  // 3. Encrypt
  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: initialisationVector,
    },
    key,
    encodedText
  );
  return encrypted;
};

export const decryptWithAESGCM = async (
  encryptedData: ArrayBuffer,
  initialisationVector: Uint8Array,
  decryptionKey: CryptoKey
): Promise<unknown> => {
  // 3. Decrypt
  let decrypted: ArrayBuffer | null;
  try {
    decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: initialisationVector,
      },
      decryptionKey,
      encryptedData
    );
  } catch (thrownObject) {
    const error = thrownObject as Error;
    // Original error is 'Unsupported state or unable to authenticate data'
    // but that's vague.
    if (error.message.includes("unable to authenticate data")) {
      log("Bad password");
      return null;
    }
    throw error;
  }
  // 2. Turn ArrayBuffer into String
  const decodedEncryptedData = textDecoder.decode(decrypted);
  // 1. Turn back into JSON
  const decryptedData = JSON.parse(decodedEncryptedData);

  return decryptedData;
};
