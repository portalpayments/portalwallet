// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import type { Connection, Keypair } from "@solana/web3.js";
import {
  base64ToString,
  getFromEnv,
  log,
  stringify,
  stringToBase64,
} from "./functions";
import {
  getRecoveryTokenFromWallet,
  makeRecoveryTokenCiphertextAndInitializationVector,
  recoverFromToken,
} from "./recovery-token";
import ESSerializer from "esserializer";
import * as dotenv from "dotenv";
import * as bip39 from "bip39";
import { checkIfSecretKeyIsValid, mnemonicToKeypairs } from "./recovery";
import { dirtyPersonalPhrase } from "./test-data/transactions/test-phrases";
import { SECONDS } from "./constants";
import { connect } from "./wallet";
import { Crypto } from "@peculiar/webcrypto";
import type {
  CipherTextAndInitializationVector,
  CipherTextAndInitializationVectorSerialized,
} from "./types";
import { getKeypairFromString } from "./solana-functions";

const SCRYPT_IS_DESIGNED_TO_BE_SLOW = 30 * SECONDS;

jest.mock("./functions");

// GitHub Actions has limits on outbound HTTP requests
// which seems to be causing recovery tests to fail
const testIfUsingOutboundHTTP = process.env.TEST_USING_OUTBOUND_HTTP
  ? test
  : test.skip;

dotenv.config();

describe(`recovery token`, () => {
  let connection: Connection;
  let mnemonic: string;
  let originalWallet: Keypair;
  let restoredWallet: Keypair;
  let walletUnlockPassword: string;
  let recoveryTokenPayload: CipherTextAndInitializationVectorSerialized;

  beforeAll(async () => {
    connection = await connect("localhost");
    // Enable webcrypto in node, so we can test things that use browser crypto
    if (!global.crypto) {
      global.crypto = new Crypto();
    }

    // Make a wallet with the traditional method
    mnemonic = bip39.generateMnemonic();
    walletUnlockPassword = `bad password for unit testing`;
    const originalWalletKeyPairs = await mnemonicToKeypairs(
      mnemonic,
      walletUnlockPassword
    );
    originalWallet = originalWalletKeyPairs[0];

    // Make a recovery token payload
    recoveryTokenPayload =
      await makeRecoveryTokenCiphertextAndInitializationVector(
        originalWallet.secretKey,
        dirtyPersonalPhrase,
        walletUnlockPassword
      );
  }, SCRYPT_IS_DESIGNED_TO_BE_SLOW);

  test(
    `We can NOT recover a wallet with a bad personal phrase`,
    async () => {
      // Now decrypt them (as if we'd read them out of the token)

      // Let's try a bad personal phrase first
      let restoredWallet = await recoverFromToken(
        "an incorrect personal phrase",
        walletUnlockPassword,
        recoveryTokenPayload
      );

      // No password, no wallet.
      expect(restoredWallet).toBeNull();
    },
    SCRYPT_IS_DESIGNED_TO_BE_SLOW
  );

  test(
    `We can NOT recover a wallet with a bad wallet unlock phrase`,
    async () => {
      // Let's try a bad wallet unlock phrase
      restoredWallet = await recoverFromToken(
        dirtyPersonalPhrase,
        "not the wallet unlock password",
        recoveryTokenPayload
      );

      // No password, no wallet.
      expect(restoredWallet).toBeNull();
    },
    SCRYPT_IS_DESIGNED_TO_BE_SLOW
  );

  test(
    `We can recover a wallet from a recovery token`,
    async () => {
      // Now decrypt them using the correct personal phrase and wallet unlock password

      restoredWallet = await recoverFromToken(
        dirtyPersonalPhrase,
        walletUnlockPassword,
        recoveryTokenPayload
      );

      const originalSecretKey = originalWallet.secretKey.toString();
      const recoveredSecretKey = restoredWallet.secretKey.toString();
      expect(originalSecretKey).toEqual(recoveredSecretKey);
    },
    SCRYPT_IS_DESIGNED_TO_BE_SLOW
  );
});

describe(`Finding recovery token in a real wallet`, () => {
  let connection: Connection;
  beforeAll(async () => {
    connection = await connect("heliusMainNet");
  });

  beforeAll(() => {
    // Enable webcrypto in node, so we can test things that use browser crypto
    if (!global.crypto) {
      global.crypto = new Crypto();
    }
  });

  // TODO: these pass locally but fail on GitHub actions
  // This may be due to HTTP restrictions on GitHub Actions
  // we should fix CI when we have a moment
  testIfUsingOutboundHTTP(`Can recover Mike's wallet`, async () => {
    const mike = getKeypairFromString(getFromEnv("MIKES_SECRET_KEY"));
    const mikesPersonalPhrase = getFromEnv("MIKES_PERSONAL_PHRASE");
    const mikesWalletUnlockPassword = getFromEnv(
      "MIKES_WALLET_UNLOCK_PASSWORD"
    );

    const recoveryTokenPayload = await getRecoveryTokenFromWallet(
      connection,
      mike.publicKey
    );

    expect(recoveryTokenPayload).toEqual({
      cipherText: expect.any(String),
      initializationVector: expect.any(String),
    });

    const restoredWallet = await recoverFromToken(
      mikesPersonalPhrase,
      mikesWalletUnlockPassword,
      recoveryTokenPayload
    );

    expect(restoredWallet.secretKey.toString()).toEqual(
      mike.secretKey.toString()
    );
  });
});
