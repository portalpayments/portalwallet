import type {
  FindNftsByOwnerOutput,
  Metadata,
  Nft,
  Sft,
  JsonMetadata,
  PublicKey,
} from "@metaplex-foundation/js";
import { asyncMap, log, stringify } from "./functions";
import { getAttributesFromNFT } from "./solana-functions";
import type { Collectable } from "./types";
import * as http from "fetch-unfucked";
import mime from "mime";
import type { ConnectionWithCompressedNFTSupport } from "../metaplex-read-api/ConnectionWithCompressedNFTSupport";
import type { ReadApiAsset } from "src/metaplex-read-api/types";

export const getCoverImage = (metadata: JsonMetadata) => {
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

export const nftToCollectable = async (
  nft: ReadApiAsset
): Promise<Collectable> => {
  // We have to force content type as nftstorage.link returns incorrect types
  // See https://twitter.com/mikemaccana/status/1620140384302288896?s=20&t=gP3XffhtDkUiaYQvSph8vg
  const { body } = await http.get(
    nft.content.json_uri,
    null,
    http.CONTENT_TYPES.JSON
  );

  const rawNFTMetaData: JsonMetadata = body;

  const coverImage = getCoverImage(rawNFTMetaData);

  const bestMediaAndType = getBestMediaAndType(rawNFTMetaData);

  const media = bestMediaAndType?.file || null;
  const type = bestMediaAndType?.type || null;

  const attributes = getAttributesFromNFT(rawNFTMetaData);

  return {
    id: nft.id,
    name: rawNFTMetaData.name,
    description: rawNFTMetaData.description,
    coverImage,
    media,
    type,
    attributes,
  };
};

export const getCollectables = async (
  connection: ConnectionWithCompressedNFTSupport,
  publicKey: PublicKey
): Promise<Array<Collectable>> => {
  log(`🎟️ Getting NFTs for ${publicKey.toBase58()}...`);

  // TODO: use metaplex instead? Maybe?
  // See https://github.com/metaplex-foundation/js/issues/515
  const response = await connection.getAssetsByOwner({
    ownerAddress: publicKey.toBase58(),
  });

  const allNftsFromAWallet = response.items || [];

  const collectablesUnfiltered: Array<Collectable> = await asyncMap(
    allNftsFromAWallet,
    async (nft) => {
      const collectable = await nftToCollectable(nft);
      return collectable;
    }
  );

  // Filter out non-media NFTs
  const collectables = collectablesUnfiltered.filter((collectable) => {
    return Boolean(collectable.media);
  });

  return collectables;
};

// Best means 'most fun' - video, then images.
export const getBestMediaAndType = (
  metadata: JsonMetadata
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
