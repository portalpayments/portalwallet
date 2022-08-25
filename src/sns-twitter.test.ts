import { getTwitterRegistry } from "@bonfida/spl-name-service";
import { Connection } from "@solana/web3.js";
import {
  JOE_MACCANNS_WALLET,
  MIKES_WALLET,
  SHAQS_WALLET,
  URLS,
} from "./constants";
import {
  getHandleForWallet,
  checkIsVerified,
  checkIsWalletVerifiedViaTwitter,
  closeConnection,
} from "./sns-twitter";

// Also tried 'raj', 'joker', 'hge' - nobody has reverse records to match Twitter to therr identity

describe("Wallet to Twitter mapping", () => {
  test(`Says Shaq's wallet hasn't been set up for reverse Twitter`, async () => {
    expect(await getHandleForWallet(SHAQS_WALLET)).toBeNull();
  });

  test(`Says Joe McCann's wallet hasn't been set up for reverse Twitter`, async () => {
    expect(await getHandleForWallet(JOE_MACCANNS_WALLET)).toBeNull();
  });

  test(`Shows mapping to Mike's Twitter account`, async () => {
    expect(await getHandleForWallet(MIKES_WALLET)).toEqual("mikemaccana");
  });
});

// Skip to ignore TLS errors
// https://github.com/PLhery/node-twitter-api-v2/issues/326
describe.skip(`Twitter verification`, () => {
  afterAll(() => {
    closeConnection();
  });

  test(`Says @mikemaccana's is not verified`, async () => {
    expect(await checkIsVerified("mikemaccana")).toBeFalsy();
  });

  test(`Says @joemccann's is verified`, async () => {
    expect(await checkIsVerified("joemccann")).toBeTruthy();
  });
});

describe(`Twitter name to wallet look up`, () => {
  test(`Finds @mikemaccana's wallet`, async () => {
    const connection = new Connection(URLS.mainNetBeta);
    const registry = await getTwitterRegistry(connection, "mikemaccana");
    expect(registry.owner.toString()).toEqual(MIKES_WALLET);
  });
});

describe(`Wallet => Twitter verification`, () => {
  afterAll(() => {
    closeConnection();
  });
  // See link above re: TLS error
  test.skip(`Mike isn't verified`, async () => {
    expect(await checkIsWalletVerifiedViaTwitter(MIKES_WALLET)).toBeFalsy();
  });
  test(`Joe doesn't have wallet to Twitter mappings set up`, async () => {
    expect(
      await checkIsWalletVerifiedViaTwitter(JOE_MACCANNS_WALLET)
    ).toBeFalsy();
  });
});
