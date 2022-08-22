import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { Account, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import {
  connect,
  convertPhraseToSeed,
  getAccountBalance,
  getKeypairfromString,
  getUSDCAccounts,
  putSolIntoWallet,
  seedToKeypairs,
} from "./vmwallet";

import { createMintAccount } from "./tokens";
import { expectedCleanedPhrase } from "./__mocks__/mocks";
import { getABetterErrorMessage } from "./errors";
import {
  DEPOSIT,
  NOT_ENOUGH_TO_MAKE_A_NEW_TOKEN,
  USDC_MAINNET_MINT_ACCOUNT,
} from "./constants";
import { getAllNftsFromAWallet } from "./identity-tokens";
import { Pda } from "@metaplex-foundation/js";
import { log, inspect, stringify } from "./functions";
import bs58 from "bs58";
import * as dotenv from "dotenv";
const firstName = `Joe`;
const lastName = `Cottoneye`;

dotenv.config();

// Quiet functions.log() during tests
jest.mock("./functions", () => ({
  ...jest.requireActual("./functions"),
  log: jest.fn(),
}));

const fullName = `${firstName} ${lastName}`;
const password = `${new Date().toString()}`;

describe(`restoration`, () => {
  let connection: Connection;
  let keypairs: Array<Keypair>;
  beforeAll(async () => {
    connection = await connect("localhost");
  });

  afterAll(async () => {
    // TODO: close connection?
  });
  test(`wallets can be created`, async () => {
    const seed = await convertPhraseToSeed(expectedCleanedPhrase, fullName);
    keypairs = await seedToKeypairs(seed, password);

    // IMPORTANT: if we don't deposit any Sol the wallet won't exist
    const firstWallet = keypairs[0];
    await putSolIntoWallet(connection, firstWallet.publicKey, DEPOSIT);

    const accountBalance = await getAccountBalance(
      connection,
      firstWallet.publicKey
    );
    expect(accountBalance).toEqual(DEPOSIT);
  });

  test(`wallets can be restored using their seed phrases`, async () => {
    const firstWallet = keypairs[0];
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

  test(`custom program error`, () => {
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
    ).rejects.toThrow("Insufficient funds");
  });
});

describe(`mainnet integration tests`, () => {
  let mainNetConnection: Connection | null = null;
  const privateKeyFromEnvFile = process.env.PRIVATE_KEY;
  if (!privateKeyFromEnvFile) {
    throw new Error(
      "Please add PRIVATE_KEY to your env file with a private key extracted from Phantom etc."
    );
  }
  // From https://yihau.github.io/solana-web3-demo/tour/create-keypair.html

  const keyPair = getKeypairfromString(privateKeyFromEnvFile);
  const actualPublicKey = keyPair.publicKey;
  const mikePublicKey = new PublicKey(actualPublicKey);
  const mikeWallet = new PublicKey(actualPublicKey);

  beforeAll(async () => {
    mainNetConnection = await connect("mainNetBeta");
  });

  test(`We can get NFTs from Mike's real-mainnet wallet`, async () => {
    if (!mainNetConnection) {
      throw new Error(`Couldn't get a connection, can't continue`);
    }
    const NFTs = await getAllNftsFromAWallet(mainNetConnection, mikeWallet);
    const NFTaddress = new PublicKey(
      "8ZLr4qQuKbkoYtU8mWJszEXF9juWMycmcysQwZRb89Pk"
    );
    const artist = new PublicKey(
      "9z8XUe1ak38Pg6MBnHgKB2riUN3sUSgyNL1Dzw179hTX"
    );
    expect(NFTs).toEqual([
      {
        model: "metadata",
        // https://solscan.io/token/8ZLr4qQuKbkoYtU8mWJszEXF9juWMycmcysQwZRb89Pk
        address: new Pda("2TQ464nFCwPs45wYsXXYpkhY7wgUyEVzpecWp1RBMeDU", 255),
        mintAddress: NFTaddress,
        updateAuthorityAddress: artist,
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
            address: artist,
            verified: true,
            share: 100,
          },
        ],
        tokenStandard: 0,
        collection: null,
        collectionDetails: null,
        uses: null,
      },
    ]);
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
                owner: actualPublicKey.toString(),
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
});
