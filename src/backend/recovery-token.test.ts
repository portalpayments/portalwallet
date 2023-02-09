// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import type { Connection, Keypair } from "@solana/web3.js";
import { Keypair as KeypairConstructor } from "@solana/web3.js";
import { log } from "./functions";
import {
  personalPhraseToEntropy,
  makeRecoveryTokenPayload,
  recoverFromToken,
} from "./recovery-token";
import * as dotenv from "dotenv";
import * as base58 from "bs58";
import * as bip39 from "bip39";
import { checkIfSecretKeyIsValid, mnemonicToKeypairs } from "./recovery";
import { dirtyPersonalPhrase } from "./test-data/transactions/test-phrases";
import { SECONDS } from "./constants";
import { connect } from "./wallet";
import { Crypto } from "@peculiar/webcrypto";

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

      // Now decrypt them (as if we'd read them out of the token)
      restoredWallet = await recoverFromToken(
        dirtyPersonalPhrase,
        walletUnlockPassword,
        cipherText,
        initialisationVector
      );

      const originalSecretKey = originalWallet.secretKey.toString();
      const recoveredSecretKey = restoredWallet.secretKey.toString();
      expect(originalSecretKey).toEqual(recoveredSecretKey);
    },
    // Slow test because it uses scrypt which is designed to be slow
    30 * SECONDS
  );
});
