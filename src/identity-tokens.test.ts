import { Metaplex } from "@metaplex-foundation/js";
import { getMetaplex, mintIdentityToken } from "./identity-tokens";
import { clusterApiUrl, Connection, Keypair } from "@solana/web3.js";
import { connect, putSolIntoWallet } from "./vmwallet";
import { log, stringify } from "./functions";
import { URLS } from "./constants";
import { BN } from "bn.js";

describe(`identity tokens`, () => {
  let metaplex: Metaplex;
  let connection: Connection;
  let testIdentityTokenIssuer = new Keypair();

  beforeAll(async () => {
    connection = await connect("localhost");
    metaplex = getMetaplex(connection, testIdentityTokenIssuer);
    await putSolIntoWallet(
      connection,
      testIdentityTokenIssuer.publicKey,
      1_000_000_000
    );
  });

  afterAll(async () => {
    // Close connection?
  });

  test(`we can mint an identity token`, async () => {
    const metadata = {
      name: "First NFT",
    };
    const name = "My NFT";
    const createOutput = await mintIdentityToken(metaplex, name, metadata);

    const zero = new BN(0, 10);
    const one = new BN(1, 10);

    // Created fresh, but will be referenced a few times in our output
    const mintAddress = createOutput.mintAddress;
    const masterEditionAddress = createOutput.masterEditionAddress;
    const metadataAddress = createOutput.metadataAddress;
    const tokenAddress = createOutput.tokenAddress;
    const updateAuthorityAddress = createOutput.nft.updateAuthorityAddress;

    expect(createOutput).toEqual({
      response: {
        signature: expect.any(String),
        confirmResponse: {
          context: {
            slot: expect.any(Number),
          },
          value: {
            err: null,
          },
        },
      },
      mintAddress,
      metadataAddress,
      masterEditionAddress,
      tokenAddress,
      nft: {
        model: "nft",
        updateAuthorityAddress,
        json: metadata,
        jsonLoaded: true,
        name,
        symbol: "",
        // https://mockstorage.example.com/..
        uri: expect.any(String),
        isMutable: true,
        primarySaleHappened: false,
        sellerFeeBasisPoints: 500,
        editionNonce: expect.any(Number),
        creators: [
          {
            address: testIdentityTokenIssuer.publicKey,
            verified: true,
            share: 100,
          },
        ],
        tokenStandard: 0,
        collection: null,
        collectionDetails: null,
        uses: null,
        address: mintAddress,
        metadataAddress: metadataAddress,
        mint: {
          model: "mint",
          address: mintAddress,
          mintAuthorityAddress: masterEditionAddress,
          freezeAuthorityAddress: masterEditionAddress,
          decimals: 0,
          supply: {
            basisPoints: one,
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
        token: {
          model: "token",
          address: tokenAddress,
          isAssociatedToken: true,
          mintAddress: mintAddress,
          ownerAddress: testIdentityTokenIssuer.publicKey,
          amount: {
            basisPoints: one,
            currency: {
              symbol: "Token",
              decimals: 0,
              namespace: "spl-token",
            },
          },
          closeAuthorityAddress: null,
          delegateAddress: null,
          delegateAmount: {
            basisPoints: zero,
            currency: {
              symbol: "Token",
              decimals: 0,
              namespace: "spl-token",
            },
          },
          state: 1,
        },
        edition: {
          model: "nftEdition",
          isOriginal: true,
          address: masterEditionAddress,
          supply: zero,
          maxSupply: zero,
        },
      },
    });
  });

  // test(`We can get the associated token account for Portal Identity Token for alice's wallet`, () => {
  //   //
  // });

  // test(`We can read the Portal Identity Token from the Alice's wallet's Portal Identity Token account`, () => {
  //   //
  // });

  // test(`We can read the Portal Identity Token from the Alice's wallet's Portal Identity Token account`, () => {
  //   //
  // });

  // test(`We can read the Portal Identity Token from the Alice's wallet's Portal Identity Token account`, () => {
  //   //
  // });
});
