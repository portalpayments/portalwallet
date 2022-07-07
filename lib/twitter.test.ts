import { getTwitterRegistry } from "@bonfida/spl-name-service";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { URLS } from "./constants";
import { getHandleAndRegistryKeyForWallet } from "./twitter";
// Shaq is one of the only people I know
// with a verified Twitter handle and a Solana wallet.
const SHAQS_WALLET = "gacMrsrxNisAhCfgsUAVbwmTC3w9nJB6NychLAnTQFv";
const JOE_MACCANNS_WALLET = "5CJFJoKiZ14tdsjtWgKGQVuVkYW7pcWUR4LFSvDELFod";
const MIKES_WALLET = "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM";

// Also tried 'raj', 'joker', 'hge' - nobody has reverse records to match Twitter to therr identity

describe("Twitter verification", () => {
  test(`Says Shaq's wallet hasn't been set up for reverse Twitter`, async () => {
    expect(getHandleAndRegistryKeyForWallet(SHAQS_WALLET)).rejects.toThrow(
      "Invalid reverse Twitter account provided"
    );
  });

  test(`Says Joe McCann's wallet hasn't been set up for reverse Twitter`, async () => {
    expect(
      getHandleAndRegistryKeyForWallet(JOE_MACCANNS_WALLET)
    ).rejects.toThrow("Invalid reverse Twitter account provided");
  });

  test(`Says Mike's wallet belongs to Mike's (unverified) twitter handle`, async () => {
    const [handle, _registry] = await getHandleAndRegistryKeyForWallet(
      MIKES_WALLET
    );
    expect(handle).toEqual("mikemaccana");
  });
});

describe(`Twitter name to wallet look up`, () => {
  test(`Finds @joemmikemaccanaccann's wallet`, async () => {
    const connection = new Connection(URLS.mainNetBeta);
    const registry = await getTwitterRegistry(connection, "mikemaccana");
    expect(registry.owner).toEqual(MIKES_WALLET);
  });
});
