// Run with 'npx esrun mint-identity-token.ts'
// because 'ts-node' and 'tsx has issues:
// https://github.com/TypeStrong/ts-node/issues/1062#issuecomment-1192847985

import { log, sleep, stringify } from "./src/backend/functions";
import { mintAndTransferIdentityToken } from "./src/backend/identity-tokens";
import { uploadImageToArweave } from "./src/backend/arweave";
import dotenv from "dotenv";
import { Keypair } from "@solana/web3.js";
import base58 from "bs58";
import { getKeypairFromString } from "./src/backend/solana-functions";

dotenv.config();

const WALLET_ADDRESS = "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM";
const GIVEN_NAME = "Mike";
const FAMILY_NAME = "MacCana";
const IMAGE_FILE = "mike.jpg";

// ------------------------------------------------------------------------------

const tokenContents = {
  type: "INDIVIDUAL" as "INDIVIDUAL",
  givenName: GIVEN_NAME,
  familyName: FAMILY_NAME,
};

const ALREADY_UPLOADED_ARWEAVE_IMAGE =
  "https://arweave.net/kNWn4-S_ioBEfVHjhHlKH3Uen4B3kyguoG1Kn3ctIUc"; // null

const main = async () => {
  log(`🎟️ Running Portal Identity token minter ...`);

  const identityTokenSecretKey = process.env.IDENTITY_TOKEN_SECRET_KEY;

  if (!identityTokenSecretKey) {
    throw new Error(`Please set IDENTITY_TOKEN_SECRET_KEY in .env file`);
  }

  log(
    stringify({
      WALLET_ADDRESS,
      tokenContents,
    })
  );

  const identityTokenIssuer = getKeypairFromString(identityTokenSecretKey);

  // Step 1. Upload image if necessary
  let uploadedImageUrl: string | null = ALREADY_UPLOADED_ARWEAVE_IMAGE;

  if (uploadedImageUrl) {
    log(`🖼️ Using already-uploaded image`, uploadedImageUrl);
  } else {
    uploadedImageUrl = await uploadImageToArweave(IMAGE_FILE);
    log(`🖼️ Uploaded image`, uploadedImageUrl);
  }

  // Step 2. Mint token (using the identity token issuer wallet) and then move the minted token to the final receipient.
  const transactionId = await mintAndTransferIdentityToken(
    WALLET_ADDRESS,
    tokenContents,
    uploadedImageUrl,
    identityTokenIssuer
  );
  log(transactionId);

  log(`✅ Completed successfully`);
};

main();
