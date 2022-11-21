// Run with 'npx tsx mint-identity-token.ts'
// because 'ts-node' has issues:
// https://github.com/TypeStrong/ts-node/issues/1062#issuecomment-1192847985

import { log, stringify } from "./src/backend/functions";
import { mintAndTransferIdentityToken } from "./src/backend/identity-tokens";
import dotenv from "dotenv";
import { getKeypairFromString } from "./src/backend/vmwallet";

dotenv.config();

const identityTokenSecretKey = process.env.IDENTITY_TOKEN_SECRET_KEY;

if (!identityTokenSecretKey) {
  throw new Error(`Please set IDENTITY_TOKEN_SECRET_KEY in .env file`);
}

const WALLET_ADDRESS = "";
const FIRST_NAME = "";
const LAST_NAME = "";
const IMAGE_FILE = "";

const main = async () => {
  log(`🎟️ Running Portal Identity token minter ...`);
  log(
    stringify({
      WALLET_ADDRESS,
      firstName: FIRST_NAME,
      lastName: LAST_NAME,
      imageFile: IMAGE_FILE,
    })
  );

  const identityTokenIssuer = getKeypairFromString(identityTokenSecretKey);

  const transactionId = await mintAndTransferIdentityToken(
    WALLET_ADDRESS,
    FIRST_NAME,
    LAST_NAME,
    IMAGE_FILE,
    identityTokenIssuer
  );
  log(transactionId);

  log(`✅ Completed successfully`);
};

main();
