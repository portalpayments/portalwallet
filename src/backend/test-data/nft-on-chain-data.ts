import {
  type JsonMetadata,
  type Nft,
  type Sft,
  type Metadata,
  PublicKey,
} from "@metaplex-foundation/js";

export const mcBurgerNFTOnChainData:
  | Metadata<JsonMetadata<string>>
  | Nft
  | Sft = {
  model: "metadata",
  address: new PublicKey("DDgUX7a9Y2eas7qNdRkvSL2FXL7Vcg7HUs2MpWXgMPbG"),
  mintAddress: new PublicKey("Ehmn6RgCgUSkD1ugkrrHcyZJECULxGN4wKuJ2XafLaQj"),
  updateAuthorityAddress: new PublicKey(
    "4ZCiGakZJy5aJsLpMBNBNwyrmNCCSCzukzhaPzzd4d7v"
  ),
  json: null,
  jsonLoaded: false,
  name: "McBurger Demo",
  symbol: "",
  uri: "https://crossmint.myfilebase.com/ipfs/bafkreig5nuz3qswtnipclnhdw4kbdn5s6fpujtivyt4jf3diqm4ivpmv5u",
  isMutable: true,
  primarySaleHappened: false,
  sellerFeeBasisPoints: 0,
  editionNonce: 254,
  creators: [
    {
      address: new PublicKey("4ZCiGakZJy5aJsLpMBNBNwyrmNCCSCzukzhaPzzd4d7v"),
      verified: true,
      share: 100,
    },
  ],
  tokenStandard: 0,
  collection: {
    verified: true,
    // Looks like types and real NFTs are different yet again
    // @ts-ignore
    key: new PublicKey("5k2ddFyAPRXiypemmEogbRbgTKKZFGxazR7FjPkHGXf9"),
    address: new PublicKey("5k2ddFyAPRXiypemmEogbRbgTKKZFGxazR7FjPkHGXf9"),
  },
  collectionDetails: null,
  uses: null,
  programmableConfig: null,
};
