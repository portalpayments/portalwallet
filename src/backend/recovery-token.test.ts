// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import type { Connection, Keypair } from "@solana/web3.js";
import { base64ToString, log, stringToBase64 } from "./functions";
import { makeRecoveryTokenPayload, recoverFromToken } from "./recovery-token";
import ESSerializer from "esserializer";
import * as dotenv from "dotenv";
import * as bip39 from "bip39";
import { checkIfSecretKeyIsValid, mnemonicToKeypairs } from "./recovery";
import { dirtyPersonalPhrase } from "./test-data/transactions/test-phrases";
import { SECONDS } from "./constants";
import { connect } from "./wallet";
import { Crypto } from "@peculiar/webcrypto";
import type { CipherTextAndInitialisationVector } from "./types";
import { error } from "console";

jest.mock("./functions");

dotenv.config();

describe(`recovery token`, () => {
  let connection: Connection;
  let mnemonic: string;
  let originalWallet: Keypair;
  let restoredWallet: Keypair;
  let walletUnlockPassword: string;

  beforeAll(async () => {
    connection = await connect("localhost");
    // Enable webcrypto in node, so we can test things that use browser crypto
    if (!global.crypto) {
      global.crypto = new Crypto();
    }
  });

  test(
    `We can create encrypted data for the recovery token, and recover it`,
    async () => {
      // Make a wallet with the traditional method
      mnemonic = bip39.generateMnemonic();
      walletUnlockPassword = `bad password for unit testing`;
      const originalWalletKeyPairs = await mnemonicToKeypairs(
        mnemonic,
        walletUnlockPassword
      );
      originalWallet = originalWalletKeyPairs[0];
      // These are the bits we'll store in the token
      const { cipherText, initialisationVector } =
        await makeRecoveryTokenPayload(
          originalWallet.secretKey,
          dirtyPersonalPhrase,
          walletUnlockPassword
        );

      const serialized = ESSerializer.serialize({
        cipherText,
        initialisationVector,
      });

      const dataToShoveInsideURIField = stringToBase64(serialized);

      // A 'reasonable' length for a URL
      // TODO: actally find out what max is from Metaplex.
      expect(dataToShoveInsideURIField.length).toBeLessThan(2000);

      const toDeserialize = base64ToString(dataToShoveInsideURIField);

      const decodedDataFromURIField = ESSerializer.deserialize(toDeserialize);

      // Now decrypt them (as if we'd read them out of the token)

      // Let's try a bad personal phrase first
      let restoredWallet = await recoverFromToken(
        "an incorrect personal phrase",
        walletUnlockPassword,
        decodedDataFromURIField.cipherText,
        decodedDataFromURIField.initialisationVector
      );

      // No password, no wallet.
      expect(restoredWallet).toBeNull();

      // Let's try a bad wallet unlock phrase
      restoredWallet = await recoverFromToken(
        dirtyPersonalPhrase,
        "not the wallet unlock password",
        decodedDataFromURIField.cipherText,
        decodedDataFromURIField.initialisationVector
      );

      // No password, no wallet.
      expect(restoredWallet).toBeNull();

      // Now decrypt them using the correct personal phrase and wallet unlock password
      restoredWallet = await recoverFromToken(
        dirtyPersonalPhrase,
        walletUnlockPassword,
        decodedDataFromURIField.cipherText,
        decodedDataFromURIField.initialisationVector
      );

      const originalSecretKey = originalWallet.secretKey.toString();
      const recoveredSecretKey = restoredWallet.secretKey.toString();
      expect(originalSecretKey).toEqual(recoveredSecretKey);
    },
    // Slow test because it uses scrypt which is designed to be slow
    30 * SECONDS
  );
});
