// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import { Keypair } from "@solana/web3.js";
import { saveSettings, getSettings } from "./settings";
import { Crypto } from "@peculiar/webcrypto";
import { stringify, log } from "../backend/functions";

jest.mock("localforage");

jest.mock("../backend/functions");

describe(`settings`, () => {
  const wallet = new Keypair();
  const secretKey = wallet.secretKey;
  const PASSWORD = "unit testing password";
  const INCORRECT_PASSWORD = "incorrect password";

  beforeAll(() => {
    // Enable webcrypto in node, so we can test things that use browser crypto
    if (!global.crypto) {
      global.crypto = new Crypto();
    }
  });

  test(`Returns null when settings don't exist`, async () => {
    const settings = await getSettings(PASSWORD);
    expect(settings).toBe(null);
  });

  test(`Can save settings successfully`, async () => {
    await saveSettings(
      {
        version: 1,
        secretKey: secretKey,
        mnemonic: null,
        personalPhrase: null,
      },
      PASSWORD
    );
  });

  test(`Can get settings successfully`, async () => {
    const settings = await getSettings(PASSWORD);
    expect(settings.version).toEqual(1);
    expect(settings.secretKey).toEqual(wallet.secretKey);
  });

  test(`Returns null when the password is bad`, async () => {
    const settings = await getSettings(INCORRECT_PASSWORD);
    await expect(settings).toBe(null);
  });
});
