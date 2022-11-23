// Run with 'npx tsx mint-identity-token.ts'
// because 'ts-node' has issues:
// https://github.com/TypeStrong/ts-node/issues/1062#issuecomment-1192847985

import { log, sleep, stringify } from "./src/backend/functions";
import { mintAndTransferIdentityToken } from "./src/backend/identity-tokens";
import { uploadImageToArweave } from "./src/backend/arweave";
import dotenv from "dotenv";
import { getKeypairFromString } from "./src/backend/vmwallet";
import { SECOND, SECONDS } from "./src/backend/constants";

dotenv.config();

const identityTokenSecretKey = process.env.IDENTITY_TOKEN_SECRET_KEY;

if (!identityTokenSecretKey) {
  throw new Error(`Please set IDENTITY_TOKEN_SECRET_KEY in .env file`);
}

const WALLET_ADDRESS = "";
const GIVEN_NAME = "";
const FAMILY_NAME = "";
const IMAGE_FILE = "";

const main = async () => {
  log(`🎟️ Running Portal Identity token minter ...`);

  log(
    stringify({
      WALLET_ADDRESS,
      GIVEN_NAME,
      FAMILY_NAME,
      IMAGE_FILE,
    })
  );

  log(
    `Press Ctrl C now if these details are incorrect, othermine minting in 5 seconds.`
  );

  await sleep(1 * SECOND);
  log(`4...`);
  await sleep(1 * SECOND);
  log(`3...`);
  await sleep(1 * SECOND);
  log(`2...`);
  await sleep(1 * SECOND);
  log(`1...`);
  await sleep(1 * SECOND);
  log(`We have lift off....`);

  const identityTokenIssuer = getKeypairFromString(identityTokenSecretKey);

  const uploadedImageUrl = await uploadImageToArweave(IMAGE_FILE);

  log(`🖼️ Uploaded image`, uploadedImageUrl);

  const transactionId = await mintAndTransferIdentityToken(
    WALLET_ADDRESS,
    GIVEN_NAME,
    FAMILY_NAME,
    uploadedImageUrl,
    identityTokenIssuer
  );
  log(transactionId);

  log(`✅ Completed successfully`);
};

main();
