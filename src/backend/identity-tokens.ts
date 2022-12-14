// https://github.com/metaplex-foundation/js

// TODO:
// joncinque commented on 6 Jun
// https://github.com/solana-labs/solana-program-library/issues/2909
//  the feature is available on token-2022, but has not been released to mainnet yet. Also, Metaplex is not using token-2022 at the moment. If you need this soon, then you will have to develop your own on-chain program.
// https://github.com/solana-labs/solana-program-library/pull/3178/files

import {
  Metaplex,
  keypairIdentity,
  mockStorage,
  bundlrStorage,
  type CreateNftOutput,
} from "@metaplex-foundation/js";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";

import { asyncFilter, asyncMap, log, sleep } from "./functions";
import {
  IDENTITY_TOKEN_NAME,
  LATEST_IDENTITY_TOKEN_VERSION,
  SECONDS,
} from "./constants";
import { stringify } from "./functions";

import type { TokenMetaData, ExpandedNFT } from "./types";
import { makeTokenAccount, transferPortalIdentityToken } from "./tokens";
import { connect } from "./vmwallet";
import { httpGet } from "src/lib/utils";

const name = IDENTITY_TOKEN_NAME;

export const getMetaplex = (
  connection: Connection,
  keypair: Keypair,
  isProduction: boolean = false
) => {
  if (isProduction) {
    return Metaplex.make(connection)
      .use(keypairIdentity(keypair))
      .use(bundlrStorage());
  }
  return Metaplex.make(connection)
    .use(keypairIdentity(keypair))
    .use(mockStorage());
};

// Create an identityToken, it will be owned by identityTokenIssuer
export const mintIdentityToken = async (
  connection: Connection,
  identityTokenIssuer: Keypair,
  metadata: Record<string, any>,
  isProduction: boolean
) => {
  const metaplex = getMetaplex(connection, identityTokenIssuer, isProduction);
  const metaplexNFTs = metaplex.nfts();
  const uploadResponse = await metaplexNFTs.uploadMetadata(metadata).run();

  // From https://github.com/metaplex-foundation/js#create
  // "This will take care of creating the mint account, the associated token account, the metadata PDA and the original edition PDA (a.k.a. the master edition) for you.""
  // Full parameters at https://github.com/metaplex-foundation/js/blob/main/packages/js/src/plugins/nftModule/createNft.ts#L64

  // See https://github.com/metaplex-foundation/js-examples/blob/main/getting-started-expressjs/createNFT.cjs too

  // Sometimes fails with
  let createOutput: CreateNftOutput;
  try {
    createOutput = await metaplexNFTs
      .create({
        uri: uploadResponse.uri, // "https://arweave.net/123",
        name,
        sellerFeeBasisPoints: 0, // 500 would represent 5.00%.
      })
      .run();
  } catch (thrownError) {
    const error = thrownError as Error;
    log(`Unexpected error`, error.message);
    // See https://github.com/metaplex-foundation/js/issues/148
    throw new Error(
      `Check Sol balance of wallet for token issuer ${identityTokenIssuer.publicKey.toBase58()}`
    );
  }

  return createOutput;
};

// Make the token and sent it to the recipient's wallet
// https://github.com/solana-labs/solana-program-library/blob/master/token/js/examples/createMintAndTransferTokens.ts

export const mintAndTransferIdentityToken = async (
  wallet: string,
  givenName: string,
  familyName: string,
  uploadedImageUrl: string,
  identityTokenIssuer: Keypair
) => {
  log(`🏦 Minting identity token`);
  const connection = await connect("quickNodeMainNetBeta");

  let tokenCreateOutput: CreateNftOutput;

  try {
    tokenCreateOutput = await mintIdentityToken(
      connection,
      identityTokenIssuer,
      makeTokenMetaData(wallet, givenName, familyName, uploadedImageUrl),
      true
    );
  } catch (thrownObject) {
    const error = thrownObject as Error;
    if (error.message.includes("insufficient lamports")) {
      throw new Error(
        `⚠️ The token mint account has run out of Sol. Please send Sol to the Token issuer account ${identityTokenIssuer.publicKey.toBase58()}`
      );
    }
    log(`Unexpected error making NFT`);
    throw error;
  }

  const mintAddress = tokenCreateOutput.mintAddress;
  const tokenAddress = tokenCreateOutput.tokenAddress;

  log(`🎟️ The token for ${givenName} has been created.`, {
    mintAddress: mintAddress.toBase58(),
    tokenAddress: tokenAddress.toBase58(),
  });

  // Yes really, the sender token account is the token address
  const senderTokenAccount = tokenAddress;

  const tokenAccountResults = await makeTokenAccount(
    connection,
    identityTokenIssuer,
    mintAddress,
    new PublicKey(wallet)
  );

  const recipientTokenAccount = tokenAccountResults.address;

  log(
    `👛 made token account for this mint on ${givenName}'s wallet, recipient token account is`,
    recipientTokenAccount.toBase58()
  );

  const signature = await transferPortalIdentityToken(
    connection,
    identityTokenIssuer,
    senderTokenAccount,
    recipientTokenAccount
  );

  log(`Transferred token to final destination!`, signature);

  return signature;
};

// From https://solana.stackexchange.com/questions/137/how-do-i-get-all-nfts-for-a-given-wallet
export const getAllNftMetadatasFromAWallet = async (
  connection: Connection,
  metaplexKeypair: Keypair,
  wallet: PublicKey
) => {
  const metaplex = new Metaplex(connection);
  metaplex.use(keypairIdentity(metaplexKeypair));

  const owner = new PublicKey(wallet);
  const findNftsByOwnerOutput = await metaplex
    .nfts()
    .findAllByOwner({
      owner,
    })
    .run();
  return findNftsByOwnerOutput;
};

export const makeTokenMetaData = (
  wallet: string,
  givenName: string,
  familyName: string,
  imageUrl: string
): TokenMetaData => {
  return {
    version: LATEST_IDENTITY_TOKEN_VERSION,
    // In future this can be removed, however right now Solana
    // token standard doesn't support non-transferrable tokens
    // So check that that token wasn't issued against another wallet and transferred
    issuedAgainst: wallet,
    claims: {
      type: "INDIVIDUAL",
      givenName,
      familyName,
      imageUrl,
    },
  };
};

export const getFullNFTsFromWallet = async (
  keypair: Keypair,
  connection: Connection,
  address: PublicKey
) => {
  const metaplex = new Metaplex(connection);
  metaplex.use(keypairIdentity(keypair));

  const owner = new PublicKey(address);
  const nftMetadatas = await metaplex
    .nfts()
    .findAllByOwner({
      owner,
    })
    .run();
  const nfts = await asyncMap(nftMetadatas, async (metadata) => {
    return (
      metaplex
        .nfts()
        // TODO: hacking, this is probably a bad idea but apparently .findAllByOwner() may return a bunch of different types of objects
        // @ts-ignore
        .load({ metadata })
        .run()
    );
  });

  const nftData = await asyncMap(nfts, async (nft) => {
    try {
      const responseBody = await httpGet(nft.uri);
      const datum = responseBody;
      return datum;
    } catch (thrownObject) {
      const error = thrownObject as Error;
      log(error.message);
      return null;
    }
  });

  return nftData;
};

export const getIdentityTokensFromWallet = async (
  connection: Connection,
  metaplexConnectionKeypair: Keypair,
  identityTokenIssuerPublicKey: PublicKey,
  wallet: PublicKey
) => {
  const metaplex = getMetaplex(connection, metaplexConnectionKeypair);
  const nfts = await metaplex
    .nfts()
    .findAllByOwner({
      owner: wallet,
    })
    .run();
  const identityTokens = nfts.filter((nft) => {
    // Quick note we need to toBase58() both addresses for the comparison to work.
    const tokenCreator = nft?.creators?.[0]?.address.toBase58();
    const portalCompany = identityTokenIssuerPublicKey.toBase58();
    return tokenCreator === portalCompany;
  });

  return identityTokens;
};
