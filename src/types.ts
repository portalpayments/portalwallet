// Shouldn't be necessary but the metaplex will return an awway of 3 possible data types
export interface ExpandedNFT {
  model: string;
  updateAuthorityAddress: string;
  json: any;
  jsonLoaded: boolean;
  name: string;
  symbol: string;
  uri: string;
  isMutable: boolean;
  primarySaleHappened: boolean;
  sellerFeeBasisPoints: number;
  editionNonce: number;
  creators: Array<{
    address: string;
    verified: boolean;
    share: number;
  }>;
  tokenStandard: number;
  collection: any;
  collectionDetails: any;
  uses: any;
  address: string;
  metadataAddress: string;
  mint: {
    model: string;
    address: string;
    mintAuthorityAddress: string;
    freezeAuthorityAddress: string;
    decimals: number;
    supply: {
      basisPoints: string;
      currency: {
        symbol: string;
        decimals: number;
        namespace: string;
      };
    };
    isWrappedSol: boolean;
    currency: {
      symbol: string;
      decimals: number;
      namespace: string;
    };
  };
  edition: {
    model: string;
    isOriginal: boolean;
    address: string;
    supply: string;
    maxSupply: string;
  };
}
