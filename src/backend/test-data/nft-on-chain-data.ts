import { PublicKey } from "@solana/web3.js";
import type { ReadApiAsset } from "src/metaplex-read-api/types";

export const mcBurgerNFTOnChainData: ReadApiAsset = {
  interface: "V1_NFT",
  id: "Ehmn6RgCgUSkD1ugkrrHcyZJECULxGN4wKuJ2XafLaQj",
  content: {
    // @ts-expect-error
    $schema: "https://schema.metaplex.com/nft1.0.json",
    json_uri:
      "https://crossmint.myfilebase.com/ipfs/bafkreig5nuz3qswtnipclnhdw4kbdn5s6fpujtivyt4jf3diqm4ivpmv5u",
    files: [],
    metadata: {
      attributes: [],
      description: "Demo of composable loyalty. Not redeemable for a burger.",
      name: "McBurger Demo",
      symbol: "",
    },
  },
  authorities: [
    {
      address: "4ZCiGakZJy5aJsLpMBNBNwyrmNCCSCzukzhaPzzd4d7v",
      scopes: ["full"],
    },
  ],
  compression: {
    eligible: false,
    compressed: false,
    data_hash: "",
    creator_hash: "",
    asset_hash: "",
    tree: "",
    seq: 0,
    leaf_id: 0,
  },
  grouping: [
    {
      group_key: "collection",
      group_value: "5k2ddFyAPRXiypemmEogbRbgTKKZFGxazR7FjPkHGXf9",
    },
  ],
  royalty: {
    // @ts-expect-error
    royalty_model: "creators",
    target: null,
    percent: 0,
    basis_points: 0,
    primary_sale_happened: false,
    locked: false,
  },
  creators: [
    {
      address: new PublicKey("4ZCiGakZJy5aJsLpMBNBNwyrmNCCSCzukzhaPzzd4d7v"),
      share: 100,
      verified: true,
    },
  ],
  ownership: {
    frozen: false,
    delegated: false,
    delegate: null,
    ownership_model: "single",
    owner: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
  },
  supply: {
    print_max_supply: 0,
    print_current_supply: 0,
    edition_nonce: 254,
  },
  mutable: true,
};
