// From example code on https://www.npmjs.com/package/@pinata/sdk

import pinataSDK from "@pinata/sdk";
import mime from "mime";
import * as dotenv from "dotenv";
import { log, stringify } from "./src/backend/functions";

dotenv.config();

const pinataAPIKey = process.env.PINATA_API_KEY;
const pinataSecretAPIKey = process.env.PINATA_API_SECRET;

if (!pinataAPIKey) {
  throw new Error(`Please set PINATA_API_KEY in .env file`);
}

const pinata = new pinataSDK(pinataAPIKey, pinataSecretAPIKey);

const contentIDtoUploadedImageURL = (contentID: string) => {
  // From Lindsay at Pinata
  // "If you just uploaded 1 image and you get 1 CID generated, you would only use the 1 CID in the url; however, for example, if you uploaded an entire folder of images and you get 100 CIDs back, then you would specify it like this: https://gateway.pinata.cloud/ipfs/[FOLDER-CID]/1.png
  return `https://gateway.pinata.cloud/ipfs/${contentID}`;
};

const uploadImageToPinata = async (fileName: string) => {
  const contentType = mime.getType(fileName);

  if (!contentType) {
    throw new Error(`Could not get MIME type for '${fileName}'`);
  }

  const result = await pinata.pinFromFS(fileName);

  const uploadedImageURL = contentIDtoUploadedImageURL(result.IpfsHash);

  log(uploadedImageURL);

  return uploadedImageURL;
};

uploadImageToPinata("vaheh.jpg");
