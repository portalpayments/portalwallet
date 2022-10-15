import { Keypair } from "@solana/web3.js";
import { saveSettings, getSettings } from "./settings";
import { Crypto } from "@peculiar/webcrypto";
import { stringify, log } from "../backend/functions";

const fakeLocalForageStore: Record<string, any> = {};

// localforage doesn't work in node, so simulate it
jest.mock("localforage", () => ({
  getItem: (key) => fakeLocalForageStore[key] || null,
  setItem: (key, value) => {
    fakeLocalForageStore[key] = value;
  },
}));

describe(`settings`, () => {
  const wallet = new Keypair();
  const secretKey = wallet.secretKey;
  const PASSWORD = "unit testing password";
  const INCORRECT_PASSWORD = "incorrect password";

  beforeAll(() => {
    // Enable webcrypto in node, so we can test things that use browser crypto
    global.crypto = new Crypto();
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

  test(`Throws an error when the password is bad`, async () => {
    const settingsPromise = getSettings(INCORRECT_PASSWORD);
    await expect(settingsPromise).rejects.toThrow("Bad password");
  });
});
