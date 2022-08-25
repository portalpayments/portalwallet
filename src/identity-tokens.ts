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
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { IDENTITY_TOKEN_NAME } from "./constants";

const name = IDENTITY_TOKEN_NAME;

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

// Create an identityToken, it will be owned by identityTokenIssuer
export const mintIdentityToken = async (
  connection: Connection,
  identityTokenIssuer: Keypair,
  metadata: Record<string, any>
) => {
  const metaplex = getMetaplex(connection, identityTokenIssuer);
  const metaplexNFTs = metaplex.nfts();
  const uploadResponse = await metaplexNFTs.uploadMetadata(metadata).run();

  expect(uploadResponse.uri);

  // https://github.com/metaplex-foundation/js#create
  // Full parameters at https://github.com/metaplex-foundation/js/blob/main/packages/js/src/plugins/nftModule/createNft.ts#L64

  // From https://github.com/metaplex-foundation/js#create
  // This will take care of creating the mint account, the associated token account, the metadata PDA and the original edition PDA (a.k.a. the master edition) for you.

  // See https://github.com/metaplex-foundation/js-examples/blob/main/getting-started-expressjs/createNFT.cjs too

  const createOutput = await metaplexNFTs
    .create({
      uri: uploadResponse.uri, // "https://arweave.net/123",
      name,
      sellerFeeBasisPoints: 500, // 500 represents 5.00%.
    })
    .run();

  return createOutput;
};

// From https://solana.stackexchange.com/questions/137/how-do-i-get-all-nfts-for-a-given-wallet
export const getAllNftsFromAWallet = async (
  connection: Connection,
  address: PublicKey
) => {
  const keypair = Keypair.generate();

  const metaplex = new Metaplex(connection);
  metaplex.use(keypairIdentity(keypair));

  const owner = new PublicKey(address);
  const findNftsByOwnerOutput = await metaplex
    .nfts()
    .findAllByOwner({
      owner,
    })
    .run();

  return findNftsByOwnerOutput;
};
