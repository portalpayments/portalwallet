import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  connect,
  getAccountBalance,
  getKeypairFromEnvFile,
  getKeypairFromString,
  putSolIntoWallet,
  verifyWallet,
  getTokenAccountSummaries,
} from "./vmwallet";
import base58 from "bs58";

import {
  AGIZA_NFT_ADDRESS,
  AGIZA_NFT_ASSOCIATED_TOKEN_ACCOUNT,
  ARTIST,
  DEPOSIT,
  KIMZO_NFT_ADDRESS,
  KIMZO_NFT_ASSOCIATED_TOKEN_ACCOUNT,
  MIKES_WALLET,
  NOT_ENOUGH_TO_MAKE_A_NEW_TOKEN,
  SECONDS,
  KEVIN_ROSES_WALLET,
  PORTAL_IDENTITY_TOKEN_ISSUER_WALLET,
  VAHEHS_WALLET,
  MIKES_USDC_ACCOUNT,
  MINUTE,
  MIKES_USDH_ACCOUNT,
  MIKES_USDT_ACCOUNT,
  getCurrencyByName,
} from "./constants";
import {
  getAllNftMetadatasFromAWallet,
  getIdentityTokensFromWallet,
} from "./identity-tokens";
import { Pda } from "@metaplex-foundation/js";
import * as dotenv from "dotenv";
import { getTransactionSummariesForAddress } from "./vmwallet";
import { log, stringify } from "./functions";
import { Currency, Direction } from "../lib/types";
import { getABetterErrorMessage } from "./errors";
import { createMintAccount } from "./tokens";

jest.mock("./functions");

dotenv.config();

const identityTokenSecretKey = process.env.IDENTITY_TOKEN_SECRET_KEY;
const mikesSecretKey = process.env.MIKES_SECRET_KEY;

describe(`basic wallet functionality on local validator`, () => {
  let connection: Connection | null = null;

  beforeAll(async () => {
    connection = await connect("localhost");
  });

  test(`getCurrencyByName works`, () => {
    expect(getCurrencyByName("USDC")).toMatchObject({
      decimals: 6,
      id: 0,
      name: "USDC",
    });
  });

  test(`wallets can be deposited into`, async () => {
    const firstWallet = new Keypair();
    await putSolIntoWallet(connection, firstWallet.publicKey, DEPOSIT);
    const balanceBefore = await getAccountBalance(
      connection,
      firstWallet.publicKey
    );

    await putSolIntoWallet(connection, firstWallet.publicKey, DEPOSIT);
    const balanceAfter = await getAccountBalance(
      connection,
      firstWallet.publicKey
    );

    const difference = balanceAfter - balanceBefore;

    expect(difference).toEqual(DEPOSIT);
  });

  test(`We turn program errors into more readable errors`, () => {
    const errorMessage = getABetterErrorMessage(
      "failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x1"
    );
    expect(errorMessage).toEqual("Insufficient funds");
  });

  test(`produces a good error when not enough funds to make a new token`, async () => {
    const testUSDCAuthority = new Keypair();
    await putSolIntoWallet(
      connection,
      testUSDCAuthority.publicKey,
      NOT_ENOUGH_TO_MAKE_A_NEW_TOKEN
    );

    expect(
      createMintAccount(
        connection,
        testUSDCAuthority,
        testUSDCAuthority.publicKey,
        getCurrencyByName("USDC").decimals
      )
    ).rejects.toThrow(
      "failed to send transaction: Transaction simulation failed: Attempt to debit an account but found no record of a prior credit."
    );
  });

  // Yes it varies, run the test 10 x it will go between 87-88 characters
  test(`We can show a secretKey as an 87-88 character string`, () => {
    const wallet = new Keypair();
    const secretKeyString = base58.encode(wallet.secretKey);
    expect(secretKeyString.length).toBeGreaterThan(86);
    expect(secretKeyString.length).toBeLessThan(89);
  });
});

describe(`mainnet integration tests`, () => {
  let mainNetConnection: Connection | null = null;

  const mikeKeypair = getKeypairFromEnvFile("MIKES_SECRET_KEY");
  const mikePublicKey = mikeKeypair.publicKey;

  const identityTokenIssuerKeypair = getKeypairFromEnvFile(
    "IDENTITY_TOKEN_SECRET_KEY"
  );

  beforeAll(async () => {
    mainNetConnection = await connect("quickNodeMainNetBeta");
  });

  test(`We can get Vaheh's identity tokens from his wallet`, async () => {
    const identityTokens = await getIdentityTokensFromWallet(
      mainNetConnection,
      // Connect to Metaplex as Mike
      mikeKeypair,
      new PublicKey(PORTAL_IDENTITY_TOKEN_ISSUER_WALLET),
      new PublicKey(VAHEHS_WALLET)
    );
    expect(identityTokens.length).toBeGreaterThan(0);
  });

  test(`We can verify Vaheh`, async () => {
    const claims = await verifyWallet(
      mainNetConnection,
      // Connect to Metaplex as Mike
      mikeKeypair,
      new PublicKey(PORTAL_IDENTITY_TOKEN_ISSUER_WALLET),
      new PublicKey(VAHEHS_WALLET)
    );
    expect(claims).toEqual({
      familyName: "Hatami",
      givenName: "Vaheh",
      imageUrl: expect.stringMatching(/https:\/\/arweave.net\/.*/),
      type: "INDIVIDUAL",
    });
  });

  test(
    `We can get NFTs from Mike's real-mainnet wallet`,
    async () => {
      if (!mainNetConnection) {
        throw new Error(`Couldn't get a connection, can't continue`);
      }
      const nfts = await getAllNftMetadatasFromAWallet(
        mainNetConnection,
        identityTokenIssuerKeypair,
        mikePublicKey
      );

      const kimzo = nfts.find((nft) => nft.name === "Kimzo");
      const agiza = nfts.find((nft) => nft.name === "Agiza");

      expect(kimzo).toMatchObject({
        model: "metadata",
        address: new Pda("57Xq2KebNs2UdpMhekf2JJjjzHv3ijV7H9DiG5UD2FEU", 255),
        mintAddress: KIMZO_NFT_ADDRESS,
        updateAuthorityAddress: ARTIST,
        json: null,
        jsonLoaded: false,
        name: "Kimzo",
        symbol: "",
        uri: "https://arweave.net/wkFGaLHMKsAZ7he_XvK3uQXTy3j0kUYiwng1mELmNVk",
        isMutable: true,
        primarySaleHappened: true,
        sellerFeeBasisPoints: 1000,
        editionNonce: 255,
        creators: [
          {
            address: ARTIST,
            verified: true,
            share: 100,
          },
        ],
        tokenStandard: 0,
        collection: null,
        collectionDetails: null,
        uses: null,
      });

      expect(agiza).toMatchObject({
        model: "metadata",
        // https://solscan.io/token/8ZLr4qQuKbkoYtU8mWJszEXF9juWMycmcysQwZRb89Pk
        address: new Pda("2TQ464nFCwPs45wYsXXYpkhY7wgUyEVzpecWp1RBMeDU", 255),
        mintAddress: AGIZA_NFT_ADDRESS,
        updateAuthorityAddress: ARTIST,
        json: null,
        jsonLoaded: false,
        name: "Agiza",
        symbol: "",
        // JSON containing the NFT
        uri: "https://arweave.net/buMXtKDU0stCY8fM8qyENwLlTgqpXyypdojPQ3mWWhU",
        isMutable: true,
        primarySaleHappened: true,
        sellerFeeBasisPoints: 1000,
        editionNonce: 254,
        creators: [
          {
            address: ARTIST,
            verified: true,
            share: 100,
          },
        ],
        tokenStandard: 0,
        collection: null,
        collectionDetails: null,
        uses: null,
      });
    },
    10 * SECONDS
  );

  test(`We can find the Associated Token Account for the Agiza girl mint`, async () => {
    if (!mainNetConnection) {
      throw new Error(`Couldn't get a connection, can't continue`);
    }

    const agizaAssociatedTokenAccount = await getOrCreateAssociatedTokenAccount(
      mainNetConnection,
      mikeKeypair,
      new PublicKey(AGIZA_NFT_ADDRESS),
      mikePublicKey
    );

    const firstNFTAddress = agizaAssociatedTokenAccount.address.toBase58();
    const firstNFTMint = agizaAssociatedTokenAccount.mint.toBase58();
    const firstNFTOwner = agizaAssociatedTokenAccount.owner.toBase58();

    expect(firstNFTAddress).toEqual(AGIZA_NFT_ASSOCIATED_TOKEN_ACCOUNT);
    expect(firstNFTMint).toEqual(AGIZA_NFT_ADDRESS.toBase58());
    expect(firstNFTOwner).toEqual(mikePublicKey.toBase58());

    const kimzoAssociatedTokenAccount = await getOrCreateAssociatedTokenAccount(
      mainNetConnection,
      mikeKeypair,
      new PublicKey(KIMZO_NFT_ADDRESS),
      mikePublicKey
    );

    const secondNFTAddress = kimzoAssociatedTokenAccount.address.toBase58();
    const secondNFTMint = kimzoAssociatedTokenAccount.mint.toBase58();
    const secondNFTOwner = kimzoAssociatedTokenAccount.owner.toBase58();

    expect(secondNFTAddress).toEqual(KIMZO_NFT_ASSOCIATED_TOKEN_ACCOUNT);
    expect(secondNFTMint).toEqual(KIMZO_NFT_ADDRESS.toBase58());
    expect(secondNFTOwner).toEqual(mikePublicKey.toBase58());
  });

  test(`We can get Mike's SOL balance`, async () => {
    if (!mainNetConnection) {
      throw new Error(`Couldn't get a connection, can't continue`);
    }
    const accountBalance = await getAccountBalance(
      mainNetConnection,
      mikePublicKey
    );
    expect(accountBalance).toEqual(expect.any(Number));
  });

  test(`We can verify Mike's wallet belongs to Mike`, async () => {
    if (!mainNetConnection) {
      throw new Error(`Couldn't get a connection, can't continue`);
    }
    if (!identityTokenSecretKey) {
      throw new Error(`IDENTITY_TOKEN_SECRET_KEY isn't  set in .env file`);
    }

    const identityTokenIssuer = getKeypairFromString(identityTokenSecretKey);

    const claims = await verifyWallet(
      mainNetConnection,
      identityTokenIssuer,
      identityTokenIssuer.publicKey,
      new PublicKey(MIKES_WALLET)
    );

    expect(claims).toEqual({
      familyName: "MacCana",
      givenName: "Micheal-Sean",
      imageUrl: expect.stringMatching(/https:\/\/arweave.net\/.*/),
      type: "INDIVIDUAL",
    });
  });

  test(`We can not verify Kevin Rose's wallet`, async () => {
    if (!mainNetConnection) {
      throw new Error(`Couldn't get a connection, can't continue`);
    }
    if (!identityTokenSecretKey) {
      throw new Error(`IDENTITY_TOKEN_SECRET_KEY isn't set in .env file`);
    }

    const identityTokenIssuer = getKeypairFromString(identityTokenSecretKey);

    const claims = await verifyWallet(
      mainNetConnection,
      identityTokenIssuer,
      identityTokenIssuer.publicKey,
      new PublicKey(KEVIN_ROSES_WALLET)
    );

    expect(claims).toBeNull();
  });

  test(
    `We can get previous transaction summaries from Mike's USDC account`,
    async () => {
      const transactionSummaries = await getTransactionSummariesForAddress(
        mainNetConnection,
        new PublicKey(MIKES_WALLET),
        new PublicKey(MIKES_USDC_ACCOUNT),
        1
      );

      const lastTransaction = transactionSummaries[0];

      // We can't do expect.any(Currency)
      // - this will fail with
      // TypeError: Right-hand side of 'instanceof' is not callable'
      // So check the currency is in the Currency enum's values
      const currency = lastTransaction.currency;
      const knownCurrencies = Object.values(Currency);
      expect(knownCurrencies.includes(currency));

      const direction = lastTransaction.direction;
      const knownDirections = Object.values(Direction);
      expect(knownDirections.includes(direction));

      // For 'memo' string or null are both fine
      // we should check for either using toBeOneOf()
      // but jest-extended does not fucking work after an hour
      // of fucking round with it.
      // We've replaced toEqual() to toMatchObject() below
      // as a temporary fix
      // TODO: use toBeOneOf()
      expect(lastTransaction).toMatchObject({
        id: expect.any(String),
        amount: expect.any(Number),
        date: expect.any(Number),
        currency: expect.any(Number),
        direction: expect.any(Number),
        from: expect.any(String),
        networkFee: 5000,
        status: true,
        to: expect.any(String),

        receipt: null,
      });
    },
    15 * SECONDS
  );

  test(
    `We can get account summaries`,
    async () => {
      const accountSummaries = await getTokenAccountSummaries(
        mainNetConnection,
        getKeypairFromString(mikesSecretKey)
      );

      // Doesn't consistently return in order so let's sort() it
      const byCurrency = (a, b) => {
        if (a.currency > b.currency) {
          return 1;
        }
        if (a.currency < b.currency) {
          return -1;
        }
        return 0;
      };

      expect(accountSummaries.sort(byCurrency)).toEqual([
        {
          address: new PublicKey(MIKES_USDC_ACCOUNT),
          currency: Currency.USDC,
          balance: expect.any(Number),
          decimals: 6,
          transactionSummaries: expect.any(Array),
        },
        {
          address: new PublicKey(MIKES_USDH_ACCOUNT),
          currency: Currency.USDH,
          balance: expect.any(Number),
          decimals: 6,
          transactionSummaries: expect.any(Array),
        },
        {
          address: new PublicKey(MIKES_USDT_ACCOUNT),
          currency: Currency.USDT,
          balance: expect.any(Number),
          decimals: 6,
          transactionSummaries: expect.any(Array),
        },
      ]);
    },
    1 * MINUTE
  );
});
