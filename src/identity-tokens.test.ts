import { Metaplex, Pda } from "@metaplex-foundation/js";
import {
  getAllNftsFromAWallet,
  getMetaplex,
  mintIdentityToken,
} from "./identity-tokens";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { connect, putSolIntoWallet } from "./vmwallet";
import { deepClone, log, stringify } from "./functions";
import { URLS } from "./constants";
import { BN as BigNumber } from "bn.js";

describe(`identity tokens`, () => {
  let metaplex: Metaplex;
  let connection: Connection;
  let testIdentityTokenIssuer = new Keypair();
  let mintAddress: PublicKey | null = null;

  beforeAll(async () => {
    connection = await connect("localhost");
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
      firstName: "First NFT",
    };
    const name = "My NFT";
    const createOutput = await mintIdentityToken(
      connection,
      testIdentityTokenIssuer,
      name,
      metadata
    );

    mintAddress = createOutput.mintAddress;

    // Lets us compare to BigNumbers (bn.js) easily

    // Created fresh, but will be referenced a few times in our output
    //
    // From https://github.com/metaplex-foundation/js#create
    // metaplexNFTs.create will take care of creating the mint account, the associated token account, the metadata PDA and the original edition PDA (a.k.a. the master edition) for you.
    const masterEditionAddress = createOutput.masterEditionAddress;
    const masterEditionAddressPDA = new Pda(masterEditionAddress, 255);
    const metadataAddress = createOutput.metadataAddress;
    const tokenAddress = createOutput.tokenAddress;
    const updateAuthorityAddress = createOutput.nft.updateAuthorityAddress;

    // Make zero and one work
    const one = new BigNumber(1);
    const zero = new BigNumber(0);

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
      mintAddress: expect.any(PublicKey),
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
          mintAuthorityAddress: expect.any(PublicKey), // masterEditionAddressPDA,
          freezeAuthorityAddress: expect.any(PublicKey), //masterEditionAddressPDA,
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
          // TODO: this is zero, but in a lsightly different form
          // from new BigNum(0). Actually check value.
          supply: expect.any(BigNumber),
          // TODO: this is zero, but in a lsightly different form
          // from new BigNum(0). Actually check value.
          maxSupply: expect.any(BigNumber),
        },
      },
    });
  });

  test(`We can retrieve the NFT we just minted`, async () => {
    const metaplex = await getMetaplex(connection, testIdentityTokenIssuer);
    if (!mintAddress) {
      throw new Error(`Couldn't get a mint address`);
    }
    const nft = await metaplex.nfts().findByMint({ mintAddress }).run();

    const updateAuthorityAddress = nft.updateAuthorityAddress;
    const mintAuthorityAddress = nft.mint.mintAuthorityAddress;
    const nftAddress = nft.address;

    expect(nft).toEqual({
      model: "nft",
      updateAuthorityAddress: expect.any(PublicKey),
      json: null,
      jsonLoaded: true,
      name: "My NFT",
      symbol: "",
      // TODO: like https://mockstorage.example.com/ew211zOcizEL1IKjaY2N
      uri: expect.any(String),
      isMutable: true,
      primarySaleHappened: false,
      sellerFeeBasisPoints: 500,
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
        mintAuthorityAddress,
        freezeAuthorityAddress: mintAuthorityAddress,
        decimals: 0,
        supply: {
          // one
          basisPoints: expect.any(BigNumber),
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
  });

  test(`We can get NFTs from Mike's real-mainnet wallet`, async () => {
    const mainNetConnection = await connect("mainNetBeta");
    const mikeWallet = new PublicKey(
      "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM"
    );
    const NFTs = await getAllNftsFromAWallet(mainNetConnection, mikeWallet);
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
