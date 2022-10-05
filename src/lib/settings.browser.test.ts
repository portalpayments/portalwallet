import { Keypair } from "@solana/web3.js";
import { log } from "../backend/functions";
import { getSettings } from "./settings";

describe("Google", () => {
  beforeAll(async () => {
    await page.goto("https://google.com");
  });

  it('should be titled "Google"', async () => {
    await expect(page.title()).resolves.toMatch("Google");
  });

  it('should have correct dimensions"', async () => {
    const dimensions = await page.evaluate(() => {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        deviceScaleFactor: window.devicePixelRatio,
      };
    });
    expect(dimensions).toMatchObject({
      deviceScaleFactor: 1,
      height: 600,
      width: 800,
    });
  });

  it("should have a userAgent", async () => {
    const userAgent = await page.evaluate(() => {
      return navigator.userAgent;
    });
    expect(userAgent).toMatch(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/107.0.5296.0 Safari/537.36"
    );
  });

  test(`Can save settings sucessfully`, async () => {
    const wallet = new Keypair();
    const privateKey = wallet.secretKey;
    await page.evaluate(async () => {
      await window.saveSettings({ version: 1, secretKey }, PASSWORD);
    });
  });

  test(`Can save settings sucessfully`, async () => {
    const settings = await getSettings(PASSWORD);
    expect(settings).toEqual({});
  });
});
