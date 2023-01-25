// Handle encrypting and restoring settings
//
// Docs:
// One way encryption with AES-GCM
// https://github.com/mdn/dom-examples/blob/main/web-crypto/encrypt-decrypt/aes-gcm.js
// See https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey

import { log, sleep, stringify } from "../backend/functions";
import * as localforage from "localforage";
import type { Settings } from "./../backend/types";
import {
  passwordToKey,
  encrypt,
  decrypt,
  getRandomValues,
} from "../backend/encryption";

// 'Simply store the IV alongside data you encrypt.'
// https://crypto.stackexchange.com/questions/8589/is-it-safe-to-use-a-constant-iv-for-one-off-symmetric-file-encryption
export const getOrSetInitialisationVector = async () => {
  let initialisationVector: Uint8Array = await localforage.getItem(
    "PORTAL_INITIALISATION_VECTOR"
  );
  if (initialisationVector) {
    return initialisationVector;
  }
  initialisationVector = await getRandomValues();
  localforage.setItem("PORTAL_INITIALISATION_VECTOR", initialisationVector);
  return initialisationVector;
};

export const getOrSetSalt = async () => {
  let salt: Uint8Array = await localforage.getItem("PORTAL_SALT");
  if (salt) {
    return salt;
  }
  salt = await getRandomValues();
  localforage.setItem("PORTAL_SALT", salt);
  return salt;
};

export const getSettingsOrNull = async (
  suppliedPassword: string
): Promise<Settings | null> => {
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

export const saveSettings = async (
  settings: Settings,
  password: string
): Promise<unknown> => {
  const initialisationVector = await getOrSetInitialisationVector();
  const salt = await getOrSetSalt();
  const encrypted = encrypt(settings, initialisationVector, password, salt);
  await localforage.setItem("PORTAL_SETTINGS", encrypted);
  log(`Saved PORTAL_SETTINGS.`);
  return;
};

export const checkIfOnboarded = async () => {
  const settings = await localforage.getItem("PORTAL_SETTINGS");
  return Boolean(settings);
};

export const getSettings = async (password: string): Promise<Settings> => {
  const salt = await getOrSetSalt();
  const decryptionKey: CryptoKey = await passwordToKey(password, salt);
  const initialisationVector = await getOrSetInitialisationVector();
  // 4. Get from localforage
  const encryptedData: ArrayBuffer | null =
    (await localforage.getItem("PORTAL_SETTINGS")) || null;
  if (!encryptedData) {
    log(`No data is stored in 'PORTAL_SETTINGS' key`);
    return null;
  }

  let settings = (await decrypt(
    encryptedData,
    initialisationVector,
    decryptionKey
  )) as Settings;

  // Extra step: the Uint8Array gets turned into an object during save, fix the type.
  settings.secretKey = Uint8Array.from(Object.values(settings.secretKey));
  return settings;
};
