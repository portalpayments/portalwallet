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
  getTransactionsForAddress,
  getUSDCAccounts,
  putSolIntoWallet,
  verifyWallet,
} from "./vmwallet";
import base58 from "bs58";

import {
  AGIZA_NFT_ADDRESS,
  AGIZA_NFT_ASSOCIATED_TOKEN_ACCOUNT,
  ARTIST,
  DEPOSIT,
  JOE_MCCANNS_WALLET,
  KIMZO_NFT_ADDRESS,
  KIMZO_NFT_ASSOCIATED_TOKEN_ACCOUNT,
  MIKES_WALLET,
  NOT_ENOUGH_TO_MAKE_A_NEW_TOKEN,
  PORTAL_IDENTITY_TOKEN_ISSUER_WALLET,
  SECONDS,
  SHAQS_WALLET,
  USDC_MAINNET_MINT_ACCOUNT,
} from "./constants";
import { getAllNftMetadatasFromAWallet } from "./identity-tokens";
import { Pda } from "@metaplex-foundation/js";
import * as dotenv from "dotenv";
import { getTransactionSummariesForAddress } from "./vmwallet";
import { log, stringify } from "./functions";
import { Currency, Direction } from "../lib/types";
import { getABetterErrorMessage } from "./errors";
import { createMintAccount } from "./tokens";

dotenv.config();

const identityTokenSecretKey = process.env.IDENTITY_TOKEN_SECRET_KEY;

describe(`basic wallet functionality on local validator`, () => {
  let connection: Connection | null = null;

  beforeAll(async () => {
    connection = await connect("localhost");
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
        testUSDCAuthority.publicKey
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
  process.env.IDENTITY_TOKEN_SECRET_KEY;

  const mikeKeypair = getKeypairFromEnvFile("MIKES_SECRET_KEY");
  const mikePublicKey = mikeKeypair.publicKey;

  const identityTokenIssuerKeypair = getKeypairFromEnvFile(
    "IDENTITY_TOKEN_SECRET_KEY"
  );

  beforeAll(async () => {
    mainNetConnection = await connect("ankrMainNet");
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

  test(`We can get Mike's USDC balance`, async () => {
    if (!mainNetConnection) {
      throw new Error(`Couldn't get a connection, can't continue`);
    }

    let usdcAccounts = await getUSDCAccounts(mainNetConnection, mikePublicKey);

    expect(usdcAccounts).toEqual([
      {
        account: {
          data: {
            parsed: {
              info: {
                isNative: false,
                mint: USDC_MAINNET_MINT_ACCOUNT,
                owner: mikePublicKey.toString(),
                state: "initialized",
                tokenAmount: {
                  amount: expect.any(String),
                  decimals: 6,
                  uiAmount: expect.any(Number),
                  uiAmountString: expect.any(String),
                },
              },
              type: "account",
            },
            program: "spl-token",
            space: 165,
          },
          executable: false,
          lamports: 2039280,
          owner: TOKEN_PROGRAM_ID,
          rentEpoch: expect.any(Number),
        },
        pubkey: new PublicKey("Tig6ugKWyQqyRgs8CeDCuC3AaenQzRJ5eVpmT5bboDc"),
      },
    ]);
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
      imageUrl: "//src/assets/verifiedMikeImage.png",
      type: "INDIVIDUAL",
    });
  });

  test(`We can not verify Shaq's wallet`, async () => {
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
      new PublicKey(SHAQS_WALLET)
    );

    expect(claims).toBeNull();
  });

  test(`We can get previous transaction summaries from Mike's wallet`, async () => {
    const transactionSummaries = await getTransactionSummariesForAddress(
      mainNetConnection,
      new PublicKey(MIKES_WALLET),
      1
    );

    const lastTransaction = transactionSummaries[0];

    // We can't do expect.any(Currency)
    // - this will fail with
    // TypeError: Right-hand side of 'instanceof' is not callable'
    // So check the value is in the enum (as an Object)'s values
    const currency = lastTransaction.currency;
    const knownCurrencies = Object.values(Currency);
    expect(knownCurrencies.includes(currency));

    const direction = lastTransaction.direction;
    const knownDirections = Object.values(Direction);
    expect(knownDirections.includes(direction));

    expect(lastTransaction).toEqual({
      id: expect.any(String),
      amount: expect.any(Number),
      date: expect.any(Number),
      currency: expect.any(Number),
      direction: expect.any(Number),
      from: expect.any(String),
      networkFee: 5000,
      status: true,
      to: expect.any(String),
      // String or null are both fine
      memo: expect.anything(),
    });
  });

  test(`We can get transactions with a note attached`, async () => {
    const transactions = await getTransactionsForAddress(
      mainNetConnection,
      new PublicKey(PORTAL_IDENTITY_TOKEN_ISSUER_WALLET),
      1
    );

    const firstTransaction = transactions[0];

    expect(firstTransaction).toEqual({
      blockTime: 1665584732,
      meta: {
        err: null,
        fee: 5000,
        innerInstructions: [],
        logMessages: [
          "Program 11111111111111111111111111111111 invoke [1]",
          "Program 11111111111111111111111111111111 success",
          "Program noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93 invoke [1]",
          "Program noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93 consumed 486 of 400000 compute units",
          "Program noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93 success",
        ],
        postBalances: [364512941, 100000000, 1, 1141440],
        postTokenBalances: [],
        preBalances: [464517941, 0, 1, 1141440],
        preTokenBalances: [],
        rewards: [],
        status: {
          Ok: null,
        },
      },
      slot: 154968700,
      transaction: {
        message: {
          accountKeys: [
            {
              pubkey: new PublicKey(
                "FSVgrW58amFmH91ZKBic686qVhHayMt3wS8bCpisUph9"
              ),
              signer: true,
              source: "transaction",
              writable: true,
            },
            {
              pubkey: new PublicKey(
                "8N7ek7FydYYt7GfhM8a3PLjj1dh9fTftdVLHnbJdThe7"
              ),
              signer: false,
              source: "transaction",
              writable: true,
            },
            {
              pubkey: new PublicKey("11111111111111111111111111111111"),
              signer: false,
              source: "transaction",
              writable: false,
            },
            {
              pubkey: new PublicKey(
                "noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93"
              ),
              signer: false,
              source: "transaction",
              writable: false,
            },
          ],
          addressTableLookups: null,
          instructions: [
            {
              parsed: {
                info: {
                  destination: "8N7ek7FydYYt7GfhM8a3PLjj1dh9fTftdVLHnbJdThe7",
                  lamports: 100000000,
                  source: "FSVgrW58amFmH91ZKBic686qVhHayMt3wS8bCpisUph9",
                },
                type: "transfer",
              },
              program: "system",
              programId: new PublicKey("11111111111111111111111111111111"),
            },
            {
              accounts: [
                new PublicKey("FSVgrW58amFmH91ZKBic686qVhHayMt3wS8bCpisUph9"),
              ],
              data: "6gSyHNFjBXyEDMuyiCeg8zGC2Rm353osfgQBegM11Qe8",
              programId: new PublicKey(
                "noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93"
              ),
            },
          ],
          recentBlockhash: "2USXPRQx9uvLHByd18QqdyXHYPuogwgDRdoqyeadmSfU",
        },
        signatures: [
          "PdX96DWpeMRqjxP7tQHU7aVMkjongnQz7mmkLPmvtezvWoJzqnVfJpYu3xxmRWSTngKDQ9A7a4UP4s4Tj463jr4",
        ],
      },
    });
  });
});
