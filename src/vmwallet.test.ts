import { Connection, PublicKey } from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  connect,
  getAccountBalance,
  getKeypairFromEnvFile,
  getKeypairFromString,
  getUSDCAccounts,
  verifyWallet,
} from "./vmwallet";

import {
  AGIZA_NFT_ADDRESS,
  AGIZA_NFT_ASSOCIATED_TOKEN_ACCOUNT,
  ARTIST,
  JOE_MCCANNS_WALLET,
  KIMZO_NFT_ADDRESS,
  KIMZO_NFT_ASSOCIATED_TOKEN_ACCOUNT,
  MIKES_WALLET,
  USDC_MAINNET_MINT_ACCOUNT,
} from "./constants";
import { getAllNftMetadatasFromAWallet } from "./identity-tokens";
import { Pda } from "@metaplex-foundation/js";
import * as dotenv from "dotenv";

dotenv.config();

// Quiet functions.log() during tests
jest.mock("./functions", () => ({
  ...jest.requireActual("./functions"),
  log: jest.fn(),
}));

const identityTokenPrivateKey = process.env.IDENTITY_TOKEN_PRIVATE_KEY;

describe(`mainnet integration tests`, () => {
  let mainNetConnection: Connection | null = null;
  process.env.IDENTITY_TOKEN_PRIVATE_KEY;

  const mikeKeypair = getKeypairFromEnvFile("MIKES_PRIVATE_KEY");
  const mikePublicKey = mikeKeypair.publicKey;

  const identityTokenIssuerKeypair = getKeypairFromEnvFile(
    "IDENTITY_TOKEN_PRIVATE_KEY"
  );

  beforeAll(async () => {
    mainNetConnection = await connect("mainNetBeta");
  });

  test(`We can get NFTs from Mike's real-mainnet wallet`, async () => {
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
  });

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
    if (!identityTokenPrivateKey) {
      throw new Error(`IDENTITY_TOKEN_PRIVATE_KEY isn't  set in .env file`);
    }

    const identityTokenIssuer = getKeypairFromString(identityTokenPrivateKey);

    const claims = await verifyWallet(
      mainNetConnection,
      identityTokenIssuer,
      identityTokenIssuer.publicKey,
      new PublicKey(MIKES_WALLET)
    );

    expect(claims).toEqual({
      familyName: "MacCana",
      givenName: "Micheal-Sean",
      imageUrl: "//src/assets/ProfilePics/vaheh.jpg",
      type: "INDIVIDUAL",
    });
  });

  test(`We can not verify Joe McCann's wallet`, async () => {
    if (!mainNetConnection) {
      throw new Error(`Couldn't get a connection, can't continue`);
    }
    if (!identityTokenPrivateKey) {
      throw new Error(`IDENTITY_TOKEN_PRIVATE_KEY isn't  set in .env file`);
    }

    const identityTokenIssuer = getKeypairFromString(identityTokenPrivateKey);

    const claims = await verifyWallet(
      mainNetConnection,
      identityTokenIssuer,
      identityTokenIssuer.publicKey,
      new PublicKey(JOE_MCCANNS_WALLET)
    );

    expect(claims).toBeNull();
  });
});
