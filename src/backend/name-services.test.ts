import {
  JOE_MCCANNS_WALLET,
  MIKES_WALLET,
  SHAQS_WALLET,
  URLS,
} from "./constants";
import {
  walletToTwitterHandle,
  closeConnection,
  twitterHandleToWallet,
} from "./name-services";
import { connect } from "./wallet";

// Also tried 'raj', 'joker', 'hge' - nobody has reverse records to match Twitter to therr identity
describe("Wallet to Twitter mapping", () => {
  test(`Says Shaq's wallet hasn't been set up for reverse Twitter`, async () => {
    expect(await walletToTwitterHandle(SHAQS_WALLET)).toBeNull();
  });

  test(`Says Joe McCann's wallet hasn't been set up for reverse Twitter`, async () => {
    expect(await walletToTwitterHandle(JOE_MCCANNS_WALLET)).toBeNull();
  });

  test(`Shows mapping to Mike's Twitter account`, async () => {
    expect(await walletToTwitterHandle(MIKES_WALLET)).toEqual("mikemaccana");
  });
});

describe(`Twitter name to wallet look up`, () => {
  test(`Finds @mikemaccana's wallet`, async () => {
    const connection = await connect("quickNodeMainNetBeta");
    const wallet = await twitterHandleToWallet(connection, "mikemaccana");
    expect(wallet).toEqual(MIKES_WALLET);
  });
});
