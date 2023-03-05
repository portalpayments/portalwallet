import { PublicKey, type Connection } from "@solana/web3.js";
import { MIKES_WALLET, YCOMBINATOR_DEMO_WALLET_FOR_JARED } from "./constants";
import { sleep } from "./functions";
import {
  twitterHandleToWallet,
  dotSolDomainToWallet,
  dotBackpackToWallet,
  dotGlowToWallet,
  dotAbcDotBonkOrDotPoorToWallet,
  resolveWalletName,
  walletToDotAbcDotBonkOrDotPoor,
  walletToDotGlow,
  walletToDotSol,
  walletToDotBackpackDomain,
  walletToTwitterHandle,
} from "./name-services";
import { connect } from "./wallet";

jest.mock("./functions");

const mikesWallet = new PublicKey(MIKES_WALLET);

describe(`names to wallet`, () => {
  let connection: Connection;
  beforeAll(async () => {
    connection = await connect("quickNodeMainNetBeta");
  });

  describe(`dotSolDomainToWallet`, () => {
    test(`mikemaccana.sol resolves`, async () => {
      const wallet = await dotSolDomainToWallet(connection, "mikemaccana.sol");
      expect(wallet).toEqual(MIKES_WALLET);
    });

    test(`unregistered-domain-for-unit-tests.sol returns null`, async () => {
      const wallet = await dotSolDomainToWallet(
        connection,
        "unregistered-domain-for-unit-tests.sol"
      );
      expect(wallet).toEqual(null);
    });
  });

  describe(`dotBackpackToWallet`, () => {
    test(`mikemaccana.backpack resolves`, async () => {
      const wallet = await dotBackpackToWallet("mikemaccana.backpack");
      expect(wallet).toEqual(MIKES_WALLET);
    });

    test(`genry.backpack does not resolve`, async () => {
      const wallet = await dotBackpackToWallet("genry.backpack");
      expect(wallet).toEqual(null);
    });
  });

  describe(`dotGlowToWallet`, () => {
    test(`mikemaccana.glow resolves`, async () => {
      const wallet = await dotGlowToWallet("mikemaccana.glow");
      expect(wallet).toEqual(MIKES_WALLET);
    });
  });

  describe(`dotAbcDotBonkOrDotPoorDomainToWallet`, () => {
    test(`mikemaccana.abc resolves`, async () => {
      const wallet = await dotAbcDotBonkOrDotPoorToWallet(
        connection,
        "mikemaccana.abc"
      );
      expect(wallet).toEqual(MIKES_WALLET);
    });
  });

  describe(`atTwitterToWallet`, () => {
    test(`Finds @mikemaccana's wallet`, async () => {
      const wallet = await twitterHandleToWallet(connection, "mikemaccana");
      expect(wallet).toEqual(MIKES_WALLET);
    });

    test(`Finds @mikemaccana's wallet (with the @ included)`, async () => {
      const wallet = await twitterHandleToWallet(connection, "@mikemaccana");
      expect(wallet).toEqual(MIKES_WALLET);
    });

    test(`Returns null for a bad Twitter handle`, async () => {
      const wallet = await twitterHandleToWallet(
        connection,
        "jdhfkljsdghghsflkghfkljgshjfgl"
      );
      expect(wallet).toEqual(null);
    });
  });

  describe(`resolveWalletName`, () => {
    let connection: Connection;
    beforeAll(async () => {
      connection = await connect("quickNodeMainNetBeta");
    });

    test(`mikemaccana.abc`, async () => {
      const result = await resolveWalletName(connection, "mikemaccana.abc");
      expect(result).toEqual(MIKES_WALLET);
    });

    test(`mikemaccana.sol`, async () => {
      const result = await resolveWalletName(connection, "mikemaccana.sol");
      expect(result).toEqual(MIKES_WALLET);
    });

    test(`mikemaccana.glow`, async () => {
      const result = await resolveWalletName(connection, "mikemaccana.glow");
      expect(result).toEqual(MIKES_WALLET);
    });

    test(`mikemaccana.backpack`, async () => {
      const result = await resolveWalletName(
        connection,
        "mikemaccana.backpack"
      );
      expect(result).toEqual(MIKES_WALLET);
    });

    test(`@mikemaccana`, async () => {
      const result = await resolveWalletName(connection, "@mikemaccana");
      expect(result).toEqual(MIKES_WALLET);
    });
  });

  // TODO: fetch creates some open handles issues here. Fix them.
  // No, sleep() won't work.
});

describe(`wallets to names`, () => {
  let connection: Connection;
  beforeAll(async () => {
    connection = await connect("quickNodeMainNetBeta");
  });

  const WALLET_WITH_NO_NAMES = new PublicKey(YCOMBINATOR_DEMO_WALLET_FOR_JARED);

  describe(`walletToDotAbcDotBonkOrDotPoor`, () => {
    test(`mike's wallet resolves to .abc domain`, async () => {
      const domain = await walletToDotAbcDotBonkOrDotPoor(
        connection,
        mikesWallet
      );
      expect(domain).toEqual("mikemaccana.abc");
    });

    test(`wallets with no names return null`, async () => {
      const domain = await walletToDotAbcDotBonkOrDotPoor(
        connection,
        WALLET_WITH_NO_NAMES
      );
      expect(domain).toEqual(null);
    });
  });

  describe(`walletToDotGlow`, () => {
    test(`mike's wallet resolves to .glow domain`, async () => {
      const domain = await walletToDotGlow(mikesWallet);
      expect(domain).toEqual("mikemaccana.glow");
    });
  });

  describe(`walletToDotSolDomain`, () => {
    test(`mike's wallet resolves to .sol domain`, async () => {
      const domain = await walletToDotSol(connection, mikesWallet);
      expect(domain).toEqual("mikemaccana.sol");
    });
  });

  describe(`walletToDotBackpackDomain`, () => {
    // TODO:
    // - Reverse lookup of backpack domains does not yet seem to work
    // for domains other than Armani's.
    // - Reverse lookup of backpack domains needs a JWT (we can get a JWT
    // easily from the backpack app, but requiring one is silly, no
    // other naming service requires one)
    const ARMANIS_WALLET = "DcpYXJsWBgkV6kck4a7cWBg6B4epPeFRCMZJjxudGKh4";
    const armanisWallet = new PublicKey(ARMANIS_WALLET);
    test.skip(`armani's wallet resolves to .backpack domain`, async () => {
      const domain = await walletToDotBackpackDomain(armanisWallet, null);
      expect(domain).toEqual("armani.backpack");
    });
  });

  describe(`walletToTwitterHandle`, () => {
    test(`mike's wallet resolves to @mikemaccana`, async () => {
      const handle = await walletToTwitterHandle(connection, mikesWallet);
      expect(handle).toEqual("@mikemaccana");
    });
  });
});
