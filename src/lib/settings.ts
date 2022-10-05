// Handle encrypting and restoring settings
//
// Docs:
// One way encryption with AES-GCM
// https://github.com/mdn/dom-examples/blob/main/web-crypto/encrypt-decrypt/aes-gcm.js
// See https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey

import { log, stringify } from "../backend/functions";

import localforage from "localforage";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export const getSHA256Hash = (string: string) => {
  // Get the string as arraybuffer.
  var buffer = textEncoder.encode(string);
  return crypto.subtle.digest("SHA-256", buffer);
};

// 'Simply store the IV alongside data you encrypt.'
// https://crypto.stackexchange.com/questions/8589/is-it-safe-to-use-a-constant-iv-for-one-off-symmetric-file-encryption
// Values are from crypto.getRandomValues()
const initialisationVector: Uint8Array = new Uint8Array([
  165, 135, 180, 215, 162, 208, 204, 82, 185, 89, 12, 46,
]);

interface Settings {
  privateKey: Uint8Array;
  version: number;
}

export const passwordToKey = async (password: string) => {
  // From https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey
  // TODO: move to https://security.stackexchange.com/questions/16354/whats-the-advantage-of-using-pbkdf2-vs-sha256-to-generate-an-aes-encryption-key
  const rawKey = await getSHA256Hash(password);
  return window.crypto.subtle.importKey("raw", rawKey, "AES-GCM", true, [
    "encrypt",
    "decrypt",
  ]);
};

export const saveSettings = async (settings: Settings, password: string) => {
  const key: CryptoKey = await passwordToKey(password);

  // 1. To JSON
  const jsonPlainText = stringify(settings);
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
  // 4. Save to localforage
  await localforage.setItem("PORTAL_WALLET", encrypted);
  return;
};

// Was getPrivateKey
export const getSettings = async (password: string) => {
  const decryptionKey: CryptoKey = await passwordToKey(password);
  // 4. Get from localforage
  const encryptedData: ArrayBuffer = await localforage.getItem("PORTAL_WALLET");
  // 3. Decrypt
  let decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: initialisationVector,
    },
    decryptionKey,
    encryptedData
  );
  // 2. Turn ArrayBuffer into String
  const decodedEncryptedData = textDecoder.decode(decrypted);
  // 1. Turn back into JSON
  return decodedEncryptedData;
};
