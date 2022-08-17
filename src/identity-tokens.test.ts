import { Metaplex, Pda } from "@metaplex-foundation/js";
import { getMetaplex, mintIdentityToken } from "./identity-tokens";
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { connect, putSolIntoWallet } from "./vmwallet";
import { deepClone, log, stringify } from "./functions";
import { URLS } from "./constants";
import { BN } from "bn.js";

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

    const zero = new BN([0, 0, 0]);
    const one = new BN([1, 0, 0]);

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

    // log(basisPoints.)

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
            basisPoints: expect.any(BN), // one,
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
            basisPoints: expect.any(BN), // one,
            currency: {
              symbol: "Token",
              decimals: 0,
              namespace: "spl-token",
            },
          },
          closeAuthorityAddress: null,
          delegateAddress: null,
          delegateAmount: {
            basisPoints: expect.any(BN), // zero,
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
          supply: expect.any(BN), // zero,
          maxSupply: expect.any(BN), // zero,
        },
      },
    });
  });

  test(`We can retrieve the NFT we just minted`, async () => {
    const metaplex = await getMetaplex(connection, testIdentityTokenIssuer);
    log(metaplex);
    if (!mintAddress) {
      throw new Error(`Couldn't get a mint address`);
    }
    const nft = await metaplex.nfts().findByMint({ mintAddress }).run();

    log(stringify(nft));

    // expect(nft).toEqual({
    //   model: "nft",
    //   updateAuthorityAddress: "J6TiqyGetsRjUXo7MQA8LuKgi9ipEUt3e3gj7W5mQiFQ",
    //   json: null,
    //   jsonLoaded: true,
    //   name: "My NFT",
    //   symbol: "",
    //   uri: "https://mockstorage.example.com/Wd3tqHDmjBvCsKJzLC0n",
    //   isMutable: true,
    //   primarySaleHappened: false,
    //   sellerFeeBasisPoints: 500,
    //   editionNonce: 253,
    //   creators: [
    //     {
    //       address: "J6TiqyGetsRjUXo7MQA8LuKgi9ipEUt3e3gj7W5mQiFQ",
    //       verified: true,
    //       share: 100,
    //     },
    //   ],
    //   tokenStandard: 0,
    //   collection: null,
    //   collectionDetails: null,
    //   uses: null,
    //   address: "2ZS4QLcB6D3CUxSBhXcRDUUC562uyJp6zZt8YuEKeUPp",
    //   metadataAddress: "Cvfs373n8f3WtQ4XUk7WBsgvC9it6WBGEWDVz6rR52av",
    //   mint: {
    //     model: "mint",
    //     address: "2ZS4QLcB6D3CUxSBhXcRDUUC562uyJp6zZt8YuEKeUPp",
    //     mintAuthorityAddress: "FpbqrbAktTtQtGFnQy3CqK75qKZMp6vcYFfwr2tB9947",
    //     freezeAuthorityAddress: "FpbqrbAktTtQtGFnQy3CqK75qKZMp6vcYFfwr2tB9947",
    //     decimals: 0,
    //     supply: {
    //       basisPoints: "01",
    //       currency: {
    //         symbol: "Token",
    //         decimals: 0,
    //         namespace: "spl-token",
    //       },
    //     },
    //     isWrappedSol: false,
    //     currency: {
    //       symbol: "Token",
    //       decimals: 0,
    //       namespace: "spl-token",
    //     },
    //   },
    //   edition: {
    //     model: "nftEdition",
    //     isOriginal: true,
    //     address: "FpbqrbAktTtQtGFnQy3CqK75qKZMp6vcYFfwr2tB9947",
    //     supply: "00",
    //     maxSupply: "00",
    //   },
    // });

    // MetaplexError: Unexpected Account
    // >> Source: SDK
    // >> Problem: The account at the provided address [DVJjhbMCqVJbBy5Dw189jaQhJzUFpsDdBEjTzL3EEja6] is not of the expected type [MintAccount].
    // >> Solution: Ensure the provided address is correct and that it holds an account of type [MintAccount].
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
