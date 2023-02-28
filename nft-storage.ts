// From example code on https://nft.storage/docs/

import { NFTStorage, File as NFTStorageFile } from "nft.storage";
import mime from "mime";
import { promises as fs } from "fs";
import * as dotenv from "dotenv";
import { log, stringify } from "./src/backend/functions";

dotenv.config();

const nftStorageKey = process.env.NFT_STORAGE_KEY;

if (!nftStorageKey) {
  throw new Error(`Please set NFT_STORAGE_KEY in .env file`);
}
const nftStorage = new NFTStorage({ token: nftStorageKey });

interface StoreNFTResult {
  ipnft: string;
  url: string;
}

const contentIDToUploadedImageURL = (
  contentID: string,
  filename: string
  // Subdomain is preferred
  // See https://nft.storage/docs/concepts/gateways/#subdomain-style-urls
) => {
  // See https://ipfs.github.io/public-gateway-checker/
  // Some examples:
  // "https://bafybeihued5ae5z6aenxmdptykc6rvzzrykeqxkn75cobbcilerbrgcrx4.ipfs.nftstorage.link/vaheh.jpg";
  // "https://bafybeihued5ae5z6aenxmdptykc6rvzzrykeqxkn75cobbcilerbrgcrx4.ipfs.dweb.link/vaheh.jpg";

  // dweb is one of the ONLY gateways without a warning on https://ipfs.github.io/public-gateway-checker/
  return `https://${contentID}.ipfs.dweb.link/${filename}`;
};

const uploadImageToNFTStorage = async (fileName: string) => {
  const name = "";
  const description = "";

  const content = await fs.readFile(fileName);
  const contentType = mime.getType(fileName);

  if (!contentType) {
    throw new Error(`Could not get MIME type for '${fileName}'`);
  }

  const result: StoreNFTResult = await nftStorage.store({
    name,
    description,
    image: new NFTStorageFile([content], fileName, { type: contentType }),
  });
  // See https://nft.storage/docs/how-to/retrieve/#understanding-ipfs-addresses
  const ipfsContentID = result.ipnft;

  log(`>>>`, stringify(result));

  const uploadedImageUrl = contentIDToUploadedImageURL(ipfsContentID, fileName);

  log(`>>> uploadedImageUrl`, uploadedImageUrl);

  return uploadedImageUrl;
};

uploadImageToNFTStorage("identity-token-cover-image-for-vaheh.png");
