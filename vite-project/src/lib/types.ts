export interface Welcome2 {
  model: string;
  address: string;
  mintAddress: string;
  updateAuthorityAddress: string;
  json: null;
  jsonLoaded: boolean;
  name: string;
  symbol: string;
  uri: string;
  isMutable: boolean;
  primarySaleHappened: boolean;
  sellerFeeBasisPoints: number;
  editionNonce: number;
  creators: Creator[];
  tokenStandard: number;
  collection: null;
  collectionDetails: null;
  uses: null;
}

export interface Creator {
  address: string;
  verified: boolean;
  share: number;
}
