// Handle encrypting and restoring settings
//
// Docs:
// One way encryption with AES-GCM
// https://github.com/mdn/dom-examples/blob/main/web-crypto/encrypt-decrypt/aes-gcm.js
// See https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey

import { log, sleep, stringify } from "../backend/functions";
import { Keypair } from "@solana/web3.js";
import base58 from "bs58";
import localforage from "localforage";
import type { Settings } from "./types";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export const getOrSetSalt = async () => {
  let salt: Uint8Array = await localforage.getItem("PORTAL_SALT");
  if (salt) {
    return salt;
  }
  salt = await crypto.getRandomValues(new Uint8Array(16));
  localforage.setItem("PORTAL_SALT", salt);
  return salt;
};

// 'Simply store the IV alongside data you encrypt.'
// https://crypto.stackexchange.com/questions/8589/is-it-safe-to-use-a-constant-iv-for-one-off-symmetric-file-encryption
export const getOrSetInitialisationVector = async () => {
  let initialisationVector: Uint8Array = await localforage.getItem(
    "PORTAL_INITIALISATION_VECTOR"
  );
  if (initialisationVector) {
    return initialisationVector;
  }
  initialisationVector = await crypto.getRandomValues(new Uint8Array(16));
  localforage.setItem("PORTAL_INITIALISATION_VECTOR", initialisationVector);
  return initialisationVector;
};

export const getSHA256Hash = (string: string) => {
  // Get the string as arraybuffer.
  var buffer = textEncoder.encode(string);
  return crypto.subtle.digest("SHA-256", buffer);
};

export const getSettingsOrNull = async (suppliedPassword: string) => {
  try {
    const settings = await getSettings(suppliedPassword);
    return settings;
  } catch (thrownObject) {
    // TODO: we're assuming all getSettings() failures are a bad password
    // The other possibility is: we simply don't have settings get
    // We should check localforage for PORTAL_SETTINGS and show the onboarding UI
    // if it doesn't exist.
    return null;
  }
};

// Use a key derivation function (rather than a hashing function) to slow down the password -> key process
// and hence slow down brute-force attacks.
// Was 'getDerivation' from https://medium.com/perimeterx/fun-times-with-webcrypto-part-2-encrypting-decrypting-dfb9fadba5bc
const passwordToDerivedKey = async (password: string) => {
  const length = 256;
  const passwordBuffer = textEncoder.encode(password);
  const salt = await getOrSetSalt();

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

export const passwordToKey = async (password: string) => {
  // From https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey
  // TODO: move to https://security.stackexchange.com/questions/16354/whats-the-advantage-of-using-pbkdf2-vs-sha256-to-generate-an-aes-encryption-key
  const rawKey = await passwordToDerivedKey(password);
  return crypto.subtle.importKey("raw", rawKey, "AES-GCM", true, [
    "encrypt",
    "decrypt",
  ]);
};

export const saveSettings = async (
  settings: Settings,
  password: string
): Promise<Settings> => {
  log(`Setting PORTAL_SETTINGS`);
  const key: CryptoKey = await passwordToKey(password);
  const initialisationVector = await getOrSetInitialisationVector();

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
  const result = await localforage.setItem("PORTAL_SETTINGS", encrypted);
  log(`Saved PORTAL_SETTINGS result is`, result);
  return;
};

export const checkIfOnboarded = async () => {
  const settings = await localforage.getItem("PORTAL_SETTINGS");
  return Boolean(settings);
};

// Was getSecretKey
export const getSettings = async (password: string): Promise<Settings> => {
  const decryptionKey: CryptoKey = await passwordToKey(password);
  const initialisationVector = await getOrSetInitialisationVector();
  // 4. Get from localforage
  const encryptedData: ArrayBuffer | null =
    (await localforage.getItem("PORTAL_SETTINGS")) || null;
  if (!encryptedData) {
    log(`No data is stored in 'PORTAL_SETTINGS' key`);
    return null;
  }
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
    log(error.message);
    throw new Error("Bad password");
  }
  // 2. Turn ArrayBuffer into String
  const decodedEncryptedData = textDecoder.decode(decrypted);
  // 1. Turn back into JSON
  const settings = JSON.parse(decodedEncryptedData);

  // Extra step: the Uint8Array gets turned into an object during save, fix the type.
  settings.secretKey = Uint8Array.from(Object.values(settings.secretKey));
  return settings;
};
