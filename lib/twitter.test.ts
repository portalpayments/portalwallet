import { getHandleAndRegistryKeyForWallet } from "./twitter";
// Shaq is one of the only people I know
// with a verified Twitter handle and a Solana wallet.
const SHAQS_WALLET = "gacMrsrxNisAhCfgsUAVbwmTC3w9nJB6NychLAnTQFv";
const JOE_MACCANS_WALLET = "5CJFJoKiZ14tdsjtWgKGQVuVkYW7pcWUR4LFSvDELFod";
const MIKES_WALLET = "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM";

describe("Twitter verification", () => {
  test(`Says Shaq's wallet hasn't been set up for reverse Twitter`, async () => {
    expect(getHandleAndRegistryKeyForWallet(SHAQS_WALLET)).rejects.toThrow(
      "Invalid reverse Twitter account provided"
    );
  });

  test(`Says Joe McCann's wallet hasn't been set up for reverse Twitter`, async () => {
    expect(
      getHandleAndRegistryKeyForWallet(JOE_MACCANS_WALLET)
    ).rejects.toThrow("Invalid reverse Twitter account provided");
  });

  test(`Says Mike's wallet is verified`, async () => {
    const [handle, registry] = await getHandleAndRegistryKeyForWallet(
      MIKES_WALLET
    );
    expect(handle).toEqual("mikemaccana");
    expect(registry.toString()).toEqual(
      "3NWbxL6YE2YYBeTXUXznmKRzkwqrFvhSnYwnf5nhJRSR"
    );
  });
});
