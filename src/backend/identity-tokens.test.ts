// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import { Metaplex, Pda, type Nft } from "@metaplex-foundation/js";
import {
  getIdentityTokensFromWallet,
  getVerifiedClaimsFromNFTMetadata,
  getMetaplex,
  makeTokenMetaDataForIndividual,
  mintIdentityToken,
} from "./identity-tokens";
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction } from "@solana/web3.js";
import { connect, getTokenAccountsByOwner, putSolIntoWallet } from "./wallet";
import { log, sleep, stringify } from "./functions";
import { IDENTITY_TOKEN_NAME, SOLANA_SYSTEM_PROGRAM, SECONDS } from "./constants";
import base58 from "bs58";
import { BN as BigNumber } from "bn.js";
import { makeTokenAccount, makeTransaction } from "./tokens";
import type { VerifiedClaimsForIndividual } from "./types";
import { rawNFTOffChainData } from "./test-data/nft-off-chain-data";
import { mcBurgerNFTOnChainData } from "./test-data/nft-on-chain-data";
import { uploadImageToPinata } from "./pinata";

// We don't want to waste Pinata tokens unecessarily
const testPinataIfAskedSpecfically = process.env.TEST_PINATA ? test : test.skip;

// Make zero and one work
// Hopefully one day BigNumber will be replaced by BigInt (which is native to JS)
export const ZERO = new BigNumber(0);
export const ONE = new BigNumber(1);

jest.mock("./functions");

describe(`arWeave`, () => {
  testPinataIfAskedSpecfically(
    `We can upload an image to Pinata`,
    async () => {
      const result = await uploadImageToPinata("./public/icon16.png");
      expect(result).toMatch(/https:\/\/arweave.net\/.*/);
    },
    10 * SECONDS
  );
});

describe(`identity tokens`, () => {
  let connection: Connection;
  const alice = new Keypair();
  const testIdentityTokenIssuer = new Keypair();

  let mintAddress: PublicKey | null = null;
  let senderTokenAccount: PublicKey | null = null;
  let alicesTokenAccount: PublicKey | null = null;

  beforeAll(async () => {
    connection = await connect("localhost");
    await putSolIntoWallet(connection, testIdentityTokenIssuer.publicKey, 1_000_000_000);
  });

  test(`we can save Alice's secret key as a string`, async () => {
    const stringKeypair = base58.encode(alice.secretKey);
    expect(typeof stringKeypair === "string");
  });

  test(
    `we can mint an identity token for Alice`,
    async () => {
      await putSolIntoWallet(connection, alice.publicKey, 1_000_000_000);

      const fakeUrl = "https://arweave.net/fakeImageForUnitTests.png";

      const tokenContents: VerifiedClaimsForIndividual = {
        type: "INDIVIDUAL",
        givenName: "Alice",
        familyName: "Smith",
        imageUrl: fakeUrl,
      };

      const newNFT = await mintIdentityToken(
        connection,
        alice.publicKey,
        tokenContents,
        fakeUrl,
        testIdentityTokenIssuer,
        false
      );

      mintAddress = newNFT.mint.address;

      const idTokenIssuer = testIdentityTokenIssuer.publicKey;
      const alicePublicKey = alice.publicKey;

      expect(newNFT).toEqual({
        address: expect.any(PublicKey),
        collection: null,
        collectionDetails: null,
        creators: [
          {
            address: idTokenIssuer,
            share: 100,
            verified: true,
          },
        ],
        edition: {
          address: expect.any(PublicKey),
          isOriginal: true,
          maxSupply: expect.any(BigNumber),
          model: "nftEdition",
          supply: expect.any(BigNumber),
        },
        editionNonce: expect.any(Number),
        isMutable: true,
        json: {
          attributes: [
            { trait_type: "type", value: "INDIVIDUAL" },
            { trait_type: "givenName", value: "Alice" },
            { trait_type: "familyName", value: "Smith" },
            { trait_type: "isNotable", value: "false" },
            { trait_type: "version", value: "7" },
            {
              trait_type: "issuedAgainst",
              value: alicePublicKey.toBase58(),
            },
          ],
          description: "Verification of real-world identity for Solana payments and apps",
          external_url: "https://getportal.app",
          image: "https://arweave.net/fakeImageForUnitTests.png",
          name: "Portal Identity Token",
          properties: {
            files: [
              {
                type: "image/png",
                uri: "https://arweave.net/fakeImageForUnitTests.png",
              },
              {
                type: "image/png",
                uri: "https://arweave.net/fakeImageForUnitTests.png",
              },
            ],
          },
        },
        jsonLoaded: true,
        metadataAddress: expect.any(PublicKey),
        mint: {
          address: expect.any(PublicKey),
          currency: { decimals: 0, namespace: "spl-token", symbol: "Token" },
          decimals: 0,
          freezeAuthorityAddress: expect.any(PublicKey),
          isWrappedSol: false,
          mintAuthorityAddress: expect.any(PublicKey),
          model: "mint",
          supply: {
            basisPoints: ONE,
            currency: {
              decimals: 0,
              namespace: "spl-token",
              symbol: "Token",
            },
          },
        },
        model: "nft",
        name: "Portal Identity Token",
        primarySaleHappened: false,
        programmableConfig: null,
        sellerFeeBasisPoints: 0,
        symbol: "",
        tokenStandard: 0,
        updateAuthorityAddress: idTokenIssuer,
        uri: expect.stringContaining("https://mockstorage.example.com"),
        uses: null,
      });
    },
    // Slow test as we're talking to the local validator
    30 * SECONDS
  );

  test(`we can extract claims from token metadata`, () => {
    const nftMetadata = {
      name: "Portal Identity Token",
      description: "Verification of real-world identity for Solana payments and apps",
      image: "https://i.imgur.com/GSCtECV.png",
      external_url: "https://getportal.app",
      attributes: [
        {
          trait_type: "type",
          value: "INDIVIDUAL",
        },
        {
          trait_type: "givenName",
          value: "Micheal-Sean",
        },
        {
          trait_type: "familyName",
          value: "MacCana",
        },
        {
          trait_type: "isNotable",
          value: "false",
        },
        {
          trait_type: "version",
          value: "7",
        },
        {
          trait_type: "issuedAgainst",
          value: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
        },
      ],
      properties: {
        files: [
          {
            uri: "https://i.imgur.com/GSCtECV.png",
            type: "image/png",
          },
          {
            uri: "https://i.imgur.com/W05AoFb.jpg",
            type: "image/jpeg",
          },
        ],
      },
    };

    const result = getVerifiedClaimsFromNFTMetadata(
      nftMetadata,
      new PublicKey("5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM"),
      true
    );

    expect(result).toEqual({
      familyName: "MacCana",
      givenName: "Micheal-Sean",
      imageUrl: expect.stringMatching(/https:\/\/.*/),
      type: "INDIVIDUAL",
    });
  });

  test(`We can retrieve the NFT we just minted`, async () => {
    const metaplex = getMetaplex(connection, testIdentityTokenIssuer);
    if (!mintAddress) {
      throw new Error(`Couldn't get a mint address`);
    }
    const nft = await metaplex.nfts().findByMint({ mintAddress });

    const artistAddress = nft.mint.mintAuthorityAddress;
    const nftAddress = nft.address;

    expect(nft).toEqual({
      model: "nft",
      updateAuthorityAddress: expect.any(PublicKey),
      json: null,
      jsonLoaded: true,
      name: IDENTITY_TOKEN_NAME,
      symbol: "",
      // Eg https://mockstorage.example.com/ew211zOcizEL1IKjaY2N
      uri: expect.any(String),
      isMutable: true,
      primarySaleHappened: false,
      programmableConfig: null,
      sellerFeeBasisPoints: 0,
      editionNonce: expect.any(Number),
      creators: [
        {
          address: expect.any(PublicKey),
          verified: true,
          share: 100,
        },
      ],
      tokenStandard: 0,
      collection: null,
      collectionDetails: null,
      uses: null,
      address: expect.any(PublicKey),
      metadataAddress: expect.any(PublicKey),
      mint: {
        model: "mint",
        address: nftAddress,
        mintAuthorityAddress: artistAddress,
        freezeAuthorityAddress: artistAddress,
        decimals: 0,
        supply: {
          basisPoints: ONE,
          currency: {
            symbol: "Token",
            decimals: 0,
            namespace: "spl-token",
          },
        },
        isWrappedSol: false,
        currency: {
          symbol: "Token",
          decimals: 0,
          namespace: "spl-token",
        },
      },
      edition: {
        model: "nftEdition",
        isOriginal: true,
        address: expect.any(Pda),
        // Both zero
        supply: expect.any(BigNumber),
        maxSupply: expect.any(BigNumber),
      },
    });

    const tokenAccountsByOwner = await getTokenAccountsByOwner(connection, testIdentityTokenIssuer.publicKey);

    // See the Associated Token Account for the Portal Identity Token at the testIdentityTokenIssuer
    expect(tokenAccountsByOwner).toEqual([
      {
        address: expect.any(PublicKey),
        amount: 1n,
        mint: expect.any(PublicKey),
      },
    ]);

    senderTokenAccount = tokenAccountsByOwner[0].address;
  });

  test(`We make an Associated Token Account for the Portal Identity Token in Alice's wallet`, async () => {
    if (!mintAddress) {
      throw new Error(`You need to mint a token first`);
    }
    const destinationTokenAccount = await makeTokenAccount(
      connection,
      testIdentityTokenIssuer,
      mintAddress,
      alice.publicKey
    );

    expect(destinationTokenAccount).toEqual({
      address: expect.any(PublicKey),
      amount: 0n,
      mint: mintAddress,
    });

    const tokenAccountsByOwner = await getTokenAccountsByOwner(connection, alice.publicKey);

    expect(tokenAccountsByOwner).toEqual([
      {
        address: expect.any(PublicKey),
        amount: 0n,
        mint: mintAddress,
      },
    ]);

    alicesTokenAccount = destinationTokenAccount.address;
  });

  test(`We can transfer the NFT we just made to the Associated Token Account in Alice's wallet`, async () => {
    if (!senderTokenAccount) {
      throw new Error(`Haven't set a senderTokenAccount yet`);
    }

    if (!alicesTokenAccount) {
      throw new Error(`Haven't set alicesTokenAccount yet`);
    }
    const transaction = await makeTransaction(
      connection,
      senderTokenAccount,
      alice.publicKey,
      testIdentityTokenIssuer,
      1,
      mintAddress,
      null
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [testIdentityTokenIssuer], {
      // https://solanacookbook.com/guides/retrying-transactions.html#facts
      maxRetries: 6,
    });

    expect(signature).toEqual(expect.any(String));

    const tokenAccountsByOwner = await getTokenAccountsByOwner(connection, alice.publicKey);

    expect(tokenAccountsByOwner).toEqual([
      {
        address: expect.any(PublicKey),
        // The token has now arrived in Alice's account
        amount: 1n,
        mint: mintAddress,
      },
    ]);
  });

  test(`We can get the Portal Identity Tokens for Alice's wallet`, async () => {
    const identityTokens = await getIdentityTokensFromWallet(
      connection,
      testIdentityTokenIssuer,
      testIdentityTokenIssuer.publicKey,
      alice.publicKey
    );

    expect(identityTokens).toEqual([
      {
        address: expect.any(PublicKey),
        collection: null,
        collectionDetails: null,
        creators: [
          {
            address: testIdentityTokenIssuer.publicKey,
            share: 100,
            verified: true,
          },
        ],
        editionNonce: expect.any(Number),
        isMutable: true,
        json: null,
        jsonLoaded: false,
        mintAddress,
        model: "metadata",
        name: "Portal Identity Token",
        primarySaleHappened: false,
        programmableConfig: null,
        sellerFeeBasisPoints: 0,
        symbol: "",
        tokenStandard: 0,
        updateAuthorityAddress: testIdentityTokenIssuer.publicKey,
        uri: expect.any(String),
        uses: null,
      },
    ]);
  });

  // TODO: add http or pinata mocks
  // test(`We can verify Alice`, async () => {
  //   const claims = await verifyWallet(
  //     connection,
  //     testIdentityTokenIssuer,
  //     testIdentityTokenIssuer.publicKey,
  //     alice.publicKey
  //   );

  //   expect(claims).toEqual({});
  // });
});
