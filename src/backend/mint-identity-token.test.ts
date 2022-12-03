const testOrSkip = process.env.RUN_SKIPPED_TESTS ? test : test.skip;

// Run with 'npx tsx mint-identity-token.ts'
// because 'ts-node' has issues:
// https://github.com/TypeStrong/ts-node/issues/1062#issuecomment-1192847985

import { log, sleep, stringify } from "./functions";
import { mintAndTransferIdentityToken } from "./identity-tokens";
import { uploadImageToArweave } from "./arweave";
import dotenv from "dotenv";
import { getKeypairFromString } from "./vmwallet";
import { SECOND, SECONDS } from "./constants";

dotenv.config();

const WALLET_ADDRESS = "";
const GIVEN_NAME = "";
const FAMILY_NAME = "";
const IMAGE_FILE = "";

testOrSkip(
  "Mints a real identity token",
  async () => {
    log(`🎟️ Running Portal Identity token minter ...`);

    // Check process.env inside the test so GitHub doesn't complain when this
    // value is missing (we never want to run this on GitHub)
    const identityTokenSecretKey = process.env.IDENTITY_TOKEN_SECRET_KEY;

    if (!identityTokenSecretKey) {
      throw new Error(`Please set IDENTITY_TOKEN_SECRET_KEY in .env file`);
    }

    log(
      stringify({
        WALLET_ADDRESS,
        GIVEN_NAME,
        FAMILY_NAME,
        IMAGE_FILE,
      })
    );

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
  },
  30 * SECONDS
);
