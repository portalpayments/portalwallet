import { promises as fs } from "fs";
import { SECONDS } from "./constants";
import Arweave from "arweave";

const OK = 200;

export const fileNameToContentType = (fileName: string) => {
  let contentType: "image/png" | "image/jpeg" | null = null;

  if (fileName.endsWith(".png")) {
    contentType = "image/png";
  }

  if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
    contentType = "image/jpeg";
  }

  if (!contentType) {
    throw new Error(`Could not determine Content Type for ${fileName}`);
  }

  return contentType;
};

// See https://solanacookbook.com/references/nfts.html#upload-to-arweave
export const uploadImageToArweave = async (fileName: string) => {
  const data = await fs.readFile(fileName);

  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
    timeout: 20 * SECONDS,
    logging: false,
  });

  const contentType = fileNameToContentType(fileName);

  const arWeaveWallet = JSON.parse(
    // File supplied by https://faucet.arweave.net/
    await fs.readFile("arweave-wallet.json", "utf-8")
  );

  const transaction = await arweave.createTransaction({
    data,
  });

  transaction.addTag("Content-Type", contentType);

  await arweave.transactions.sign(transaction, arWeaveWallet);

  const response = await arweave.transactions.post(transaction);

  if (response.status !== OK) {
    throw new Error(`Got ${response.status} error from arWeave`);
  }

  const uploadedImageUrl = `https://arweave.net/${transaction.id}`;
  return uploadedImageUrl;
};
