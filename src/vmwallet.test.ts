import { Connection, PublicKey } from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  connect,
  getAccountBalance,
  getKeypairFromString,
  getUSDCAccounts,
} from "./vmwallet";

import { USDC_MAINNET_MINT_ACCOUNT } from "./constants";
import { getAllNftsFromAWallet } from "./identity-tokens";
import { Pda } from "@metaplex-foundation/js";
import * as dotenv from "dotenv";
import { log, stringify } from "./functions";
import BN from "bn.js";

dotenv.config();

// Quiet functions.log() during tests
jest.mock("./functions", () => ({
  ...jest.requireActual("./functions"),
  log: jest.fn(),
}));

describe(`mainnet integration tests`, () => {
  let mainNetConnection: Connection | null = null;
  const privateKeyFromEnvFile = process.env.PRIVATE_KEY;
  if (!privateKeyFromEnvFile) {
    throw new Error(
      "Please add PRIVATE_KEY to your env file with a private key extracted from Phantom etc."
    );
  }
  // From https://yihau.github.io/solana-web3-demo/tour/create-keypair.html

  const keyPair = getKeypairFromString(privateKeyFromEnvFile);
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
    // Solscan calls this the 'SPL Token Address'
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

  test(`We can find the Associated Token Account for the Agiza girl mint`, async () => {
    if (!mainNetConnection) {
      throw new Error(`Couldn't get a connection, can't continue`);
    }

    const agizaGirlMint = "8ZLr4qQuKbkoYtU8mWJszEXF9juWMycmcysQwZRb89Pk";

    const agizaAssociatedTokenAccount = await getOrCreateAssociatedTokenAccount(
      mainNetConnection,
      keyPair,
      new PublicKey(agizaGirlMint),
      mikePublicKey
    );

    const address = agizaAssociatedTokenAccount.address.toBase58();
    const mint = agizaAssociatedTokenAccount.mint.toBase58();
    const owner = agizaAssociatedTokenAccount.owner.toBase58();

    // https://solscan.io/account/HxunVfDmoeAKmNVxt36jjcBq9p3Zy1Bmocx9sVwJNXdP
    expect(address).toEqual("HxunVfDmoeAKmNVxt36jjcBq9p3Zy1Bmocx9sVwJNXdP");
    expect(mint).toEqual(agizaGirlMint);
    expect(owner).toEqual(mikePublicKey.toBase58());
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
