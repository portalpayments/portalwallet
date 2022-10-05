import { Keypair } from "@solana/web3.js";
import { saveSettings, getSettings } from "./settings";

describe(`settings`, () => {
  const wallet = new Keypair();
  const privateKey = wallet.secretKey;
  const PASSWORD = "swag";

  test(`Can save settings sucessfully`, async () => {
    await saveSettings({ version: 1, privateKey }, PASSWORD);
  });

  test(`Can save settings sucessfully`, async () => {
    const settings = await getSettings(PASSWORD);
    expect(settings).toEqual({});
  });
});
