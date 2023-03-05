import type { Connection } from "@solana/web3.js";
import {
  JOE_MCCANNS_WALLET,
  MIKES_WALLET,
  SECONDS,
  SHAQS_WALLET,
  URLS,
} from "./constants";
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
} from "./name-services";
import { connect } from "./wallet";

jest.mock("./functions");

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

    test(`mccann.sol resolves`, async () => {
      const wallet = await dotSolDomainToWallet(connection, "mccann.sol");
      expect(wallet).toEqual(JOE_MCCANNS_WALLET);
    });

    test(`mccann.sol resolves`, async () => {
      const wallet = await dotSolDomainToWallet(
        connection,
        "dsfsdfsdfafdfdafdfadf.sol"
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
  // No sleep() won't work.
});

describe(`wallets to names`, () => {
  let connection: Connection;
  beforeAll(async () => {
    connection = await connect("quickNodeMainNetBeta");
  });

  describe(`walletToDotAbcDotBonkOrDotPoorDomain`, () => {
    test(`mikemaccana.abc resolves`, async () => {
      const domain = await walletToDotAbcDotBonkOrDotPoor(
        connection,
        MIKES_WALLET
      );
      expect(domain).toEqual("mikemaccana.abc");
    });
  });

  describe(`walletToDotGlow`, () => {
    test(`mikemaccana.glow resolves`, async () => {
      const domain = await walletToDotGlow(MIKES_WALLET);
      expect(domain).toEqual("mikemaccana.glow");
    });
  });

  describe(`walletToDotSolDomain`, () => {
    test(`mikemaccana.sol resolves`, async () => {
      const domain = await walletToDotSol(connection, MIKES_WALLET);
      expect(domain).toEqual("mikemaccana.sol");
    });
  });

  describe(`walletToDotBackpackDomain`, () => {
    // TODO:
    // - Reverse lookup of backpack domains does not yet seem to work
    // for domains other than Armani's.
    // - Reverse lookup of backpack domains needs a JWT (we can get a JWT easily
    // from the backpack app, but requiring one is silly, nobody else
    // requires one, and this hurts Backpack more than anyone else)
    const ARMANIS_WALLET = "DcpYXJsWBgkV6kck4a7cWBg6B4epPeFRCMZJjxudGKh4";
    test.skip(`armani.backpack resolves`, async () => {
      const domain = await walletToDotBackpackDomain(ARMANIS_WALLET, null);
      expect(domain).toEqual("armani.backpack");
    });
  });
});
