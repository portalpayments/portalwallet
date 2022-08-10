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
} from "@metaplex-foundation/js";
import { Connection, Keypair } from "@solana/web3.js";
import { log, stringify } from "./functions";

// Workaround for https://github.com/metaplex-foundation/js/issues/227
interface UploadMetadataResult {
  uri: string;
  metadata: {
    name: string;
  };
  assetUris: Array<string>;
}

export const getMetaplex = (
  connection: Connection,
  identityTokenIssuer: Keypair
) => {
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(identityTokenIssuer))
    // TODO: change storage provider
    .use(mockStorage());
  return metaplex;
};

export const mintIdentityToken = async (metaplex: Metaplex) => {
  const metaplexNFTs = metaplex.nfts();
  const uploadResponse: UploadMetadataResult = await metaplexNFTs
    .uploadMetadata({
      name: "First NFT",
    })
    .run();

  log(process.version);
  log(stringify(uploadResponse));

  expect(uploadResponse.uri);

  // https://github.com/metaplex-foundation/js#create
  // Full parameters at https://github.com/metaplex-foundation/js/blob/main/packages/js/src/plugins/nftModule/createNft.ts#L64

  // From https://github.com/metaplex-foundation/js#create
  // This will take care of creating the mint account, the associated token account, the metadata PDA and the original edition PDA (a.k.a. the master edition) for you.

  const createOutput = await metaplexNFTs
    .create({
      uri: uploadResponse.uri, // "https://arweave.net/123",
      name: "My NFT",
      sellerFeeBasisPoints: 500, // 500 represents 5.00%.
    })
    .run();

  log(stringify(createOutput)); // .nft.mint.toBase58());
};
