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
  mnemonicToKeypairs,
  checkIfSecretKeyIsValid,
  checkIfMnemonicPhraseIsValid,
} from "./recovery";
import { DEPOSIT, SECONDS } from "./constants";
import { connect, getAccountBalance, putSolIntoWallet } from "./wallet";
import * as dotenv from "dotenv";
import base58 from "bs58";
import * as bip39 from "bip39";

jest.mock("./functions");

dotenv.config();

describe(`traditional keypair creation and restoration`, () => {
  let connection: Connection;
  let mnemonic: string;
  let originalWallet: Keypair;
  let restoredWallet: Keypair;
  let password: string;

  beforeAll(async () => {
    connection = await connect("localhost");
  });

  test(`wallets can be created from a mnemonic`, async () => {
    mnemonic = bip39.generateMnemonic();
    password = `bad password for unit testing`;
    const originalWalletKeyPairs = await mnemonicToKeypairs(mnemonic, password);

    originalWallet = originalWalletKeyPairs[0];

    // IMPORTANT: if we don't deposit any Sol the wallet won't exist
    await putSolIntoWallet(connection, originalWallet.publicKey, DEPOSIT);

    const accountBalance = await getAccountBalance(
      connection,
      originalWallet.publicKey
    );
    expect(accountBalance).toEqual(DEPOSIT);
  });

  test(`wallets can be restored using their mnemonic`, async () => {
    // Lets re-make the keypairs from the seed
    const restoredWalletKeyPairs = await mnemonicToKeypairs(mnemonic, password);

    restoredWallet = restoredWalletKeyPairs[0];
    expect(restoredWallet.secretKey).toEqual(originalWallet.secretKey);
    expect(restoredWallet.publicKey.toBase58()).toEqual(
      originalWallet.publicKey.toBase58()
    );
  });

  test(`we show a valid secret key is valid`, () => {
    const mikesSecretKey = process.env.MIKES_SECRET_KEY;
    expect(mikesSecretKey).toBeDefined();
    const result = checkIfSecretKeyIsValid(mikesSecretKey);
    expect(result).toBeTruthy();
  });

  test(`we show a bad secret key is bad`, () => {
    const result = checkIfSecretKeyIsValid("im a bad secret key");
    expect(result).toBeFalsy();
  });

  test(`We can check if mnemonics are valid`, () => {
    const mikesMnemonic = process.env.MIKES_MNEMONIC;
    expect(mikesMnemonic).toBeDefined();
    const result = checkIfMnemonicPhraseIsValid(mikesMnemonic);
    expect(result).toBeTruthy();
  });

  test(`We show a bad mnemonic key is bad`, () => {
    const result = checkIfMnemonicPhraseIsValid("i am not a vlaid mnemonic");
    expect(result).toBeFalsy();
  });

  test(`Using Mike's mnemonic generates Mike's correct secret key`, async () => {
    const mikesSecretKey = process.env.MIKES_SECRET_KEY;
    const mikesMnemonic = process.env.MIKES_MNEMONIC;
    const secretKeyOne = base58.decode(mikesSecretKey);

    const keypairs = await mnemonicToKeypairs(mikesMnemonic, null);
    const firstWallet = keypairs[0];
    const secretKeyTwo = firstWallet.secretKey;

    expect(secretKeyOne).toEqual(secretKeyTwo);
  });
});
