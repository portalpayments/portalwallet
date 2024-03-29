// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
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
  encryptWithAESGCM,
  decryptWithAESGCM,
  getRandomValues,
} from "../backend/encryption";

// 'Simply store the IV alongside data you encrypt.'
// https://crypto.stackexchange.com/questions/8589/is-it-safe-to-use-a-constant-iv-for-one-off-symmetric-file-encryption
export const getOrSetInitializationVector = async () => {
  let initializationVector: Uint8Array = await localforage.getItem(
    "PORTAL_INITIALIZATION_VECTOR"
  );
  if (initializationVector) {
    return initializationVector;
  }
  initializationVector = await getRandomValues();
  localforage.setItem("PORTAL_INITIALIZATION_VECTOR", initializationVector);
  return initializationVector;
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

export const saveSettings = async (
  settings: Settings,
  password: string
): Promise<unknown> => {
  const initializationVector = await getOrSetInitializationVector();
  const salt = await getOrSetSalt();

  const key: CryptoKey = await passwordToKey(password, salt);

  const encrypted = encryptWithAESGCM(settings, initializationVector, key);
  await localforage.setItem("PORTAL_SETTINGS", encrypted);
  log(`Saved PORTAL_SETTINGS.`);
  return;
};

export const checkIfOnboarded = async () => {
  const settings = await localforage.getItem("PORTAL_SETTINGS");
  return Boolean(settings);
};

export const getSettings = async (
  password: string
): Promise<Settings | null> => {
  const salt = await getOrSetSalt();
  const decryptionKey: CryptoKey = await passwordToKey(password, salt);
  const initializationVector = await getOrSetInitializationVector();
  // 4. Get from localforage
  const encryptedData: ArrayBuffer | null =
    (await localforage.getItem("PORTAL_SETTINGS")) || null;
  if (!encryptedData) {
    log(`No data is stored in 'PORTAL_SETTINGS' key`);
    return null;
  }

  let settingsOrNull = await decryptWithAESGCM(
    encryptedData,
    initializationVector,
    decryptionKey
  );

  if (!settingsOrNull) {
    return null;
  }

  const settings = settingsOrNull as Settings;

  // Extra step: the Uint8Array gets turned into an object during save, fix the type.
  settings.secretKey = Uint8Array.from(Object.values(settings.secretKey));
  return settings;
};
