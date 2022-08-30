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
} from "@metaplex-foundation/js";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { asyncMap, log } from "./functions";

import {
  IDENTITY_TOKEN_NAME,
  LATEST_IDENTITY_TOKEN_VERSION,
  MIKES_WALLET,
} from "./constants";
import { stringify } from "./functions";

// TODO maybe use node fetch after node 18
import axios from "axios";
import { ExpandedNFT } from "./types";

const name = IDENTITY_TOKEN_NAME;

export const getMetaplex = (
  connection: Connection,
  identityTokenIssuer: Keypair,
  isProduction: boolean = false
) => {
  if (isProduction) {
    return Metaplex.make(connection)
      .use(keypairIdentity(identityTokenIssuer))
      .use(bundlrStorage());
  }
  return Metaplex.make(connection)
    .use(keypairIdentity(identityTokenIssuer))
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

  const createOutput = await metaplexNFTs
    .create({
      uri: uploadResponse.uri, // "https://arweave.net/123",
      name,
      sellerFeeBasisPoints: 0, // 500 would represent 5.00%.
    })
    .run();

  return createOutput;
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

export const getTokenMetaData = (
  wallet: string,
  givenName: string,
  familyName: string
) => {
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
      imageUrl: "//src/assets/verifiedMikeImage.png",
    },
  };
};

export const getFullNFTsFromWallet = async (
  keypair: Keypair,
  connection: Connection,
  address: PublicKey,
  name: string
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
        // TODO: hacking, this is probably a bad idea but apparently .findAllByOwner() may return a bunch of differemt types of objects
        // @ts-ignore
        .load({ metadata })
        .run()
    );
  });

  const nftData = await asyncMap(nfts as Array<ExpandedNFT>, async (nft) => {
    // @ts-ignore
    try {
      const response = await axios.get(nft.uri);
      const datum = response.data;
      return datum;
    } catch (thrownObject) {
      const error = thrownObject as Error;
      log(error.message);
      return null;
    }
  });

  log(stringify(nftData));

  // const matchingNFTMetadatas = nfts.filter((nft) => nft.name === name);
  // log(stringify(matchingNFTMetadatas));
  // if (matchingNFTMetadatas?.length > 1) {
  //   throw new Error(`Found more than one matching NFT for the name '${name}'`);
  // }
  // if (!matchingNFTMetadatas.length) {
  //   throw new Error(`Found no NFTs ,matching the name`);
  // }
  // const matchingNFTMetadata = matchingNFTMetadatas[0];
  // const nft = await

  return nftData;
};

// export const transferIdentityToken = async (recipient: PublicKey) => {
//   // https://solanacookbook.com/references/basic-transactions.html#how-to-send-spl-tokens
//   let txhash = await transferChecked(
//     connection, // connection
//     feePayer: , // payer
//     fromTokenAccount, // from (should be a token account)
//     mintPubkey, // mint
//     destination, // to (should be a token account)
//     currentOwner,
//     1,
//     0
//   );

//   const result = await sendAndConfirmTransaction(connection, transaction, [
//     fromWallet,
//   ]);
// };
