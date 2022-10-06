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
  const privateKey = wallet.secretKey;
  const PASSWORD = "swag";

  beforeAll(() => {
    // Enable webcrypto in node, so we can test things that use browser crypto
    global.crypto = new Crypto();
  });

  test(`Can save settings successfully`, async () => {
    await saveSettings({ version: 1, secretKey: privateKey }, PASSWORD);
  });

  test(`Can get settings successfully`, async () => {
    const settings = await getSettings(PASSWORD);
    expect(settings.version).toEqual(1);
    expect(settings.secretKey).toEqual(wallet.secretKey);
  });
});
