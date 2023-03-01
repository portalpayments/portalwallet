// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
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
  type FindNftsByOwnerOutput,
  type Metadata,
  type JsonMetadata,
  type Nft,
  type Sft,
} from "@metaplex-foundation/js";
import mime from "mime";
import {
  Connection,
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

import { asyncMap, log, stringify } from "./functions";
import {
  IDENTITY_TOKEN_NAME,
  LATEST_IDENTITY_TOKEN_VERSION,
  MINIMUM_IDENTITY_TOKEN_VERSION,
} from "./constants";

import type {
  VerifiedClaimsForIndividual,
  VerifiedClaimsForOrganization,
  NonFungibleTokenMetadataStandard,
  OldNonStandardTokenMetaData,
  Collectable,
} from "./types";
import { makeTransaction } from "./tokens";
import * as http from "../lib/http-client";

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

// Problem is in the form of
// "The account of type [MintAccount] was not found at the provided address [4DuUeum1r4MP19SAYfg57LdeqeWui7Z5a8mc1KCTiS1N]."
const getAddressFromProblem = (problem: string): string | null => {
  const regex = /provided address \[(.*)\]/g;
  const matches = [...problem.matchAll(regex)];
  if (!matches.length) {
    return null;
  }

  // First match, item 2
  return matches[0][1];
};

// Create an identityToken, it will be owned by identityTokenIssuer
export const mintIdentityToken = async (
  connection: Connection,
  recipientWallet: PublicKey,
  tokenClaims: VerifiedClaimsForIndividual | VerifiedClaimsForOrganization,
  tokenCoverImage: string,
  identityTokenIssuer: Keypair,
  isProduction: boolean
) => {
  log(`🏦 Minting identity token...`);

  let tokenMetaData: NonFungibleTokenMetadataStandard | null = null;
  if (tokenClaims.type === "INDIVIDUAL") {
    tokenMetaData = makeTokenMetaDataForIndividual(
      recipientWallet,
      tokenClaims.givenName,
      tokenClaims.familyName,
      tokenClaims.imageUrl,
      tokenCoverImage
    );
  } else {
    if (tokenClaims.type === "ORGANIZATION") {
      tokenMetaData = makeTokenMetaDataForOrganization(
        recipientWallet,
        tokenClaims.legalName,
        tokenClaims.state,
        tokenClaims.country,
        tokenClaims.jurisdiction,
        tokenClaims.isNotable,
        tokenClaims.imageUrl,
        tokenCoverImage
      );
    }
    if (tokenMetaData === null) {
      throw new Error(
        `COuld not work out why type of token metadata to create.`
      );
    }
  }

  const metaplex = getMetaplex(connection, identityTokenIssuer, isProduction);
  const metaplexNFTs = metaplex.nfts();
  // TODO: see norte re: NonFungibleTokenMetadataStandard above
  // @ts-ignore
  const uploadResponse = await metaplexNFTs.uploadMetadata(tokenMetaData);

  // From https://github.com/metaplex-foundation/js#create
  // "This will take care of creating the mint account, the associated token account, the metadata PDA and the original edition PDA (a.k.a. the master edition) for you.""
  // Full parameters at https://github.com/metaplex-foundation/js/blob/main/packages/js/src/plugins/nftModule/createNft.ts#L64

  // See https://github.com/metaplex-foundation/js-examples/blob/main/getting-started-expressjs/createNFT.cjs too

  // Sometimes fails with
  let tokenCreateOutput: CreateNftOutput;
  try {
    tokenCreateOutput = await metaplexNFTs.create({
      uri: uploadResponse.uri, // "https://arweave.net/123",
      name: IDENTITY_TOKEN_NAME,
      sellerFeeBasisPoints: 0, // 500 would represent 5.00%.
    });
  } catch (thrownError) {
    const error = thrownError as Error;

    // See https://github.com/metaplex-foundation/js/issues/148
    if (error.message.includes("Failed to pack instruction data")) {
      throw new Error(
        `Increase Sol balance of wallet for token issuer ${identityTokenIssuer.publicKey.toBase58()}`
      );
    }

    if (error.message.includes("insufficient lamports")) {
      throw new Error(
        `⚠️ The token mint account has run out of Sol. Please send a small amount of Sol to the Token issuer account ${identityTokenIssuer.publicKey.toBase58()}`
      );
    }

    // Another possible error - this is be a metaplex bug
    // Unexpected error Account Not Found
    // >> Source: SDK
    // >> Problem: The account of type [MintAccount] was not found at the provided address [51pE2seG8HAk9ToWrKQfakMWrp3dJ8RPqRnnXu9jqyzV].
    // >> Solution: Ensure the provided address is correct and that an account exists at this address.
    //
    // This seems to be a race condition - the NFT is actually there in Solana Explorer
    // See https://github.com/metaplex-foundation/js/issues/430 and
    // See https://github.com/metaplex-foundation/js/issues/344#issuecomment-1325265657
    log(`DEBUG: raw error.message: ${error.message}`);

    const mintAddressInProblem = getAddressFromProblem(error.message);
    if (mintAddressInProblem) {
      throw new Error(
        `⚠️ Metaplex couldn't find the mint account, but check https://explorer.solana.com/address/${mintAddressInProblem} - this is likely a bug in Metaplex, see https://github.com/metaplex-foundation/js/issues/430, and the token was made. Just retry minting the token using the previously uploaded images.`
      );
    }

    log(`Unexpected error creating NFT:`, error.message);
    throw error;
  }

  log(
    `🎟️ The token for ${
      tokenClaims.type === "INDIVIDUAL"
        ? tokenClaims.givenName
        : tokenClaims.legalName
    } has been created, senderTokenAccount is ${
      tokenCreateOutput.tokenAddress
    }.`
  );

  return tokenCreateOutput;
};

// Transfer the token to the recipient's wallet
// https://github.com/solana-labs/solana-program-library/blob/master/token/js/examples/createMintAndTransferTokens.ts

export const transferIdentityToken = async (
  connection: Connection,
  mintAddress: PublicKey,
  senderTokenAccount: PublicKey,
  recipientWallet: PublicKey,
  identityTokenIssuer: Keypair
) => {
  log(`Transferring token to final destination...`);
  let signature: string;
  try {
    const transaction = await makeTransaction(
      connection,
      senderTokenAccount,
      recipientWallet,
      identityTokenIssuer,
      1,
      mintAddress,
      null
    );

    signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [identityTokenIssuer],
      {
        // https://solanacookbook.com/guides/retrying-transactions.html#facts
        maxRetries: 6,
      }
    );

    log(`Transferred token to final destination!`, signature);
  } catch (thrownObject) {
    const error = thrownObject as Error;
    log(`⚠️ Could not transfer token to final destination: ${error.message}`);
    throw error;
  }

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
  const findNftsByOwnerOutput = await metaplex.nfts().findAllByOwner({
    owner,
  });

  return findNftsByOwnerOutput;
};

export const makeTokenMetaDataForIndividual = (
  wallet: PublicKey,
  givenName: string,
  familyName: string,
  userImageUrl: string,
  tokenCoverImageUrl: string
): NonFungibleTokenMetadataStandard => {
  const userImageContentType = mime.getType(userImageUrl);
  const coverImageContentType = mime.getType(tokenCoverImageUrl);
  return {
    name: IDENTITY_TOKEN_NAME,
    description:
      "Verification of real-world identity for Solana payments and apps",
    image: tokenCoverImageUrl,
    external_url: "https://getportal.app",
    attributes: [
      {
        trait_type: "type",
        value: "INDIVIDUAL",
      },
      // Eg: https://find-and-update.company-information.service.gov.uk/search?q=portal+payments
      {
        trait_type: "givenName",
        value: givenName,
      },
      {
        trait_type: "familyName",
        value: familyName,
      },
      {
        trait_type: "isNotable",
        value: String(false),
      },
      {
        trait_type: "version",
        value: String(LATEST_IDENTITY_TOKEN_VERSION),
      },
      // In future this can be removed, however right now Solana
      // token standard doesn't support non-transferrable tokens
      // So check that that token wasn't issued against another wallet and transferred
      {
        trait_type: "issuedAgainst",
        value: wallet.toBase58(),
      },
    ],
    properties: {
      files: [
        {
          uri: tokenCoverImageUrl,
          type: coverImageContentType,
        },
        {
          uri: userImageUrl,
          type: userImageContentType,
        },
      ],
    },
  };
};

export const makeTokenMetaDataForOrganization = (
  wallet: PublicKey,
  legalName: string,
  state: string,
  country: string,
  jurisdiction: "state" | "country",
  isNotable: boolean,
  companyImageUrl: string,
  tokenCoverImageUrl: string
): NonFungibleTokenMetadataStandard => {
  const companyImageContentType = mime.getType(tokenCoverImageUrl);
  return {
    name: IDENTITY_TOKEN_NAME,
    description:
      "Verification of real-world identity for Solana payments and apps",
    image: tokenCoverImageUrl,
    external_url: "https://getportal.app",
    attributes: [
      {
        trait_type: "type",
        value: "ORGANIZATION",
      },
      // Eg: https://find-and-update.company-information.service.gov.uk/search?q=portal+payments
      {
        trait_type: "legalName",
        value: legalName,
      },
      {
        trait_type: "state",
        value: state,
      },
      {
        trait_type: "country",
        value: country,
      },
      {
        trait_type: "jurisdiction",
        value: jurisdiction,
      },
      {
        trait_type: "isNotable",
        value: String(isNotable),
      },
      {
        trait_type: "version",
        value: String(LATEST_IDENTITY_TOKEN_VERSION),
      },
      // In future this can be removed, however right now Solana
      // token standard doesn't support non-transferrable tokens
      // So check that that token wasn't issued against another wallet and transferred
      {
        trait_type: "issuedAgainst",
        value: wallet.toBase58(),
      },
    ],
    properties: {
      files: [
        {
          uri: tokenCoverImageUrl,
          type: "image/svg+xml",
        },
        {
          uri: companyImageUrl,
          type: companyImageContentType,
        },
      ],
    },
  };
};

export const nftToCollectable = async (
  nftOnChainData: Metadata<JsonMetadata<string>> | Nft | Sft,
  // TODO: we used id as it seems unique. We could use something else.
  id: number
): Promise<Collectable> => {
  // We have to force content type as nftstorage.link returns incorrect types
  // See https://twitter.com/mikemaccana/status/1620140384302288896?s=20&t=gP3XffhtDkUiaYQvSph8vg
  const rawNFTMetaData: NonFungibleTokenMetadataStandard = await http.get(
    nftOnChainData.uri,
    http.CONTENT_TYPES.JSON
  );

  const coverImage = getCoverImage(rawNFTMetaData);

  const bestMediaAndType = getBestMediaAndType(rawNFTMetaData);

  const media = bestMediaAndType?.file || null;
  const type = bestMediaAndType?.type || null;

  const attributes = getAttributesFromNFT(rawNFTMetaData);

  return {
    id: nftOnChainData.address.toBase58(),
    name: rawNFTMetaData.name,
    description: rawNFTMetaData.description,
    coverImage,
    media,
    type,
    attributes,
  };
};

export const getCollectables = async (
  allNftsFromAWallet: FindNftsByOwnerOutput
): Promise<Array<Collectable>> => {
  const collectablesUnfiltered: Array<Collectable> = await asyncMap(
    allNftsFromAWallet,
    async (nft, nftIndex) => {
      const collectable = await nftToCollectable(nft, nftIndex);
      return collectable;
    }
  );

  // Filter out non-media NFTs
  const collectables = collectablesUnfiltered.filter((collectable) => {
    return Boolean(collectable.media);
  });

  return collectables;
};

export const getIdentityTokensFromWallet = async (
  connection: Connection,
  metaplexConnectionKeypair: Keypair,
  identityTokenIssuerPublicKey: PublicKey,
  wallet: PublicKey
) => {
  const metaplex = getMetaplex(connection, metaplexConnectionKeypair);
  const nfts = await metaplex.nfts().findAllByOwner({
    owner: wallet,
  });

  const identityTokens = nfts.filter((nft) => {
    // Quick note we need to toBase58() both addresses for the comparison to work.
    const tokenCreator = nft?.creators?.[0]?.address.toBase58();
    const portalCompany = identityTokenIssuerPublicKey.toBase58();
    return tokenCreator === portalCompany;
  });

  return identityTokens;
};

const isOldIdentityToken = (
  object: object
): object is OldNonStandardTokenMetaData => {
  // This isn't a standard NFT metadata key, was used by an old version of portal identity token
  return Object.hasOwn(object, "version");
};

export const getCoverImage = (metadata: NonFungibleTokenMetadataStandard) => {
  // Sometimes 'files' is an empty list, but 'image' still exists
  // See https://crossmint.myfilebase.com/ipfs/bafkreig5nuz3qswtnipclnhdw4kbdn5s6fpujtivyt4jf3diqm4ivpmv5u
  let coverImage: null | string = metadata.image || null;
  const files = metadata?.properties?.files || null;
  if (files?.length) {
    const firstImage = files.find(
      (file) =>
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/svg+xml"
    );
    if (firstImage) {
      coverImage = firstImage.uri;
    }
  }
  return coverImage;
};

// The best is video, then images.
export const getBestMediaAndType = (
  metadata: NonFungibleTokenMetadataStandard
): { file: string; type: string } | null => {
  // Sometimes 'files' is an empty list, but 'image' still exists
  // See https://crossmint.myfilebase.com/ipfs/bafkreig5nuz3qswtnipclnhdw4kbdn5s6fpujtivyt4jf3diqm4ivpmv5u

  const files = metadata?.properties?.files || null;
  if (files?.length) {
    const video = files.find((file) => file.type === "video/mp4");
    if (video) {
      return {
        file: video.uri,
        type: video.type,
      };
    }
    // IDK why wave files are still a thing but I saw this on a real NFT so thought I'd add it
    const wave = files.find((file) => file.type === "audio/wav");
    if (wave) {
      return {
        file: wave.uri,
        type: wave.type,
      };
    }
    const image = files.find(
      (file) =>
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/svg+xml"
    );
    if (image) {
      return {
        file: image.uri,
        type: image.type,
      };
    }
  }
  if (metadata.image) {
    return {
      file: metadata.image,
      type: mime.getType(metadata.image),
    };
  }
  return null;
};

// NFT metadata has arrays of trait_type/value objects instead of a single object with keys and values
export const getAttributesFromNFT = (
  metadata: NonFungibleTokenMetadataStandard
): Record<string, string | boolean | number> => {
  if (!metadata.attributes) {
    return {};
  }
  const attributes = Object.fromEntries(
    metadata.attributes
      // Sort by trait type first
      // Even though we're making an object, key ordering will likely to be stable
      .sort((a, b) => a.trait_type.localeCompare(b.trait_type))
      .map((attribute) => {
        let value: string | boolean | number = attribute.value;
        if (value === "true") {
          value = true;
        }
        if (value === "false") {
          value = false;
        }
        return [attribute.trait_type, attribute.value];
      })
  );
  return attributes;
};

export const getIndividualClaimsFromNFTMetadata = (
  nftMetadata: NonFungibleTokenMetadataStandard | OldNonStandardTokenMetaData,
  wallet: PublicKey,
  allowOldIdentityToken: boolean
): VerifiedClaimsForIndividual | null => {
  if (isOldIdentityToken(nftMetadata)) {
    if (!allowOldIdentityToken) {
      log(
        `Old identity token detected, but we have disabled support for the old identity token`
      );
      return null;
    }
    if (nftMetadata.claims.type === "ORGANIZATION") {
      log(
        `Old identity token detected, but we do not support using the old identity token for organisations`
      );
      return null;
    }
    if (Number(nftMetadata.version) < MINIMUM_IDENTITY_TOKEN_VERSION) {
      log(`Old version version for this identity token`);
      return null;
    }
    return {
      givenName: nftMetadata.claims.givenName,
      familyName: nftMetadata.claims.familyName,
      imageUrl: nftMetadata.claims.imageUrl,
      type: nftMetadata.claims.type as "INDIVIDUAL",
    };
  }

  if (!nftMetadata.attributes) {
    throw new Error(`No attributes in this NFT`);
  }
  const attributes = getAttributesFromNFT(nftMetadata);

  if (!attributes.version) {
    log(`No version for this identity token`);
    return null;
  }

  if (Number(attributes.version) < MINIMUM_IDENTITY_TOKEN_VERSION) {
    log(`Old version version for this identity token`);
    return null;
  }

  // Ensure the token is actually issued for this wallet
  // TODO: we can eventually remove this once token 2022 becomes standard
  if (attributes.issuedAgainst !== wallet.toBase58()) {
    log(`Identity token not issued to this wallet`);
    return null;
  }

  // First image is always the NFT cover (shown in calleries etc)
  // Second image is the individual picture
  const individualImageUrl = nftMetadata.properties.files[1].uri;

  let tokenType: "INDIVIDUAL" | "ORGANIZATION" = "INDIVIDUAL" as "INDIVIDUAL";
  // TODO: add organization support

  return {
    givenName: String(attributes.givenName),
    familyName: String(attributes.familyName),
    imageUrl: individualImageUrl,
    type: tokenType,
  };
};
