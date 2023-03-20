// From example code on https://www.npmjs.com/package/@pinata/sdk
// TODO: we could just use metaplex to upload to arweave if we decide we don't like pinata or it's too expensive
// See https://www.quicknode.com/guides/solana-development/nfts/how-to-mint-an-nft-on-solana-using-typescript/

import pinataSDK from "@pinata/sdk";
import mime from "mime";
import * as dotenv from "dotenv";
import { getFromEnv, log, stringify } from "./functions";

dotenv.config();

let pinata: pinataSDK | null;

const contentIDtoUploadedImageURL = (contentID: string) => {
  // From Lindsay at Pinata
  // "If you just uploaded 1 image and you get 1 CID generated, you would only use the 1 CID in the url; however, for example, if you uploaded an entire folder of images and you get 100 CIDs back, then you would specify it like this: https://gateway.pinata.cloud/ipfs/[FOLDER-CID]/1.png
  return `https://gateway.pinata.cloud/ipfs/${contentID}`;
};

// We only start Pinata as necessary, so we don't fail when
// the module is loaded without PINATA_API_KEY
const startPinata = () => {
  if (pinata) {
    return pinata;
  }

  const pinataAPIKey = getFromEnv("PINATA_API_KEY");
  const pinataSecretAPIKey = getFromEnv("PINATA_API_SECRET");

  pinata = new pinataSDK(pinataAPIKey, pinataSecretAPIKey);

  return pinata;
};

export const uploadImageToPinata = async (fileName: string) => {
  const pinata = startPinata();
  const contentType = mime.getType(fileName);

  if (!contentType) {
    throw new Error(`Could not get MIME type for '${fileName}'`);
  }

  const result = await pinata.pinFromFS(fileName);

  const uploadedImageURL = contentIDtoUploadedImageURL(result.IpfsHash);

  return uploadedImageURL;
};
