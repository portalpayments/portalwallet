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
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { log, stringify } from "./functions";

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

export const mintIdentityToken = async (
  connection: Connection,
  identityTokenIssuer: Keypair,
  name: string,
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

// From https://raw.githubusercontent.com/serpentacademy/Get-all-NFTS-from-Solana-Wallet-Get-Owner-of-NFT/master/getAllNftsFromAWallet.ts
export const getAllNftsFromAWallet = async (
  connection: Connection,
  address: PublicKey
) => {
  // https://metaplex-foundation.github.io/metaplex-program-library/docs/token-metadata/index.html
  const nftsMetadata = await Metadata.fromAccountAddress(connection, address);

  log(nftsMetadata);

  /*
  {
     MetadataData {
    key: 4,
    updateAuthority: '9SuDMwgmCFP8CEmBELScujDd9dqVZxBkA15VCV1nFkT4',
    mint: 'ANf44K4fLaD4heoKvTXzAfQorktH6XVKpGmwy9CQu2Xs',
    data: MetadataDataData {
      name: 'Lion Punk King',
      symbol: 'NFTPro',
      uri: 'https://www.arweave.net/5H1NMgzOvyAZWGzBgLFx27z-tYSInjimYbAC9bIWKLM?ext=json',
      sellerFeeBasisPoints: 700,
      creators: [Array]
    },
    primarySaleHappened: 0,
    isMutable: 1,
    editionNonce: 255,
    tokenStandard: undefined,
    collection: undefined,
    uses: undefined
  },
  MetadataData {
    key: 4,
    updateAuthority: '9SuDMwgmCFP8CEmBELScujDd9dqVZxBkA15VCV1nFkT4',
    mint: '2ofgix8pr8eALYrxzQ31UAWyi9XU9sCJBJZdJub49ZwR',
    data: MetadataDataData {
      name: 'Ape Bird Punk GOD',
      symbol: 'NFTPro',
      uri: 'https://www.arweave.net/vPDq-tNr91seOWrXNNU0RJ1O9rAxZWOrN50gYyevCoA?ext=json',
      sellerFeeBasisPoints: 700,
      creators: [Array]
    },
    primarySaleHappened: 0,
    isMutable: 1,
    editionNonce: 255,
    tokenStandard: undefined,
    collection: undefined,
    uses: undefined
  }
  */
};
