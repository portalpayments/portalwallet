// Run with 'npx esrun mint-identity-token.ts'
// because 'ts-node' and 'tsx has issues:
// https://github.com/TypeStrong/ts-node/issues/1062#issuecomment-1192847985

import { log, sleep, stringify } from "./src/backend/functions";
import { mintAndTransferIdentityToken } from "./src/backend/identity-tokens";

// TODO: move into seperate file and share with wallet
import { uploadImageToArweave } from "./src/backend/arweave";
import dotenv from "dotenv";
import { Keypair } from "@solana/web3.js";
import base58 from "bs58";

dotenv.config();

// const WALLET_ADDRESS = "6UQnexjqat9m552wrjcSkvEYuZPiC8C1r6dJzRTpN2GT";
// const GIVEN_NAME = "Mark";
// const FAMILY_NAME = "Ransford";
// const IMAGE_FILE = "mark.jpg";

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

const ALREADY_UPLOADED_ARWEAVE_IMAGE = null;
//   "https://arweave.net/kNWn4-S_ioBEfVHjhHlKH3Uen4B3kyguoG1Kn3ctIUc";
const ALREADY_UPLOADED_NFT_METADATA = null;
//   "https://arweave.net/8qyTtcAfluFaPXnGdMurseZL0zvnMjv-gI6DSVJEJU8";

// TODO: move into seperate file and share with wallet
export const getKeypairFromString = (secretKeyString: string) => {
  let decodedSecretKey: Uint8Array;
  try {
    decodedSecretKey = base58.decode(secretKeyString);
  } catch (throwObject) {
    throw new Error("Invalid secret key! See README.md");
  }
  return Keypair.fromSecretKey(decodedSecretKey);
};

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

  let uploadedImageUrl: string | null = ALREADY_UPLOADED_ARWEAVE_IMAGE;
  if (!uploadedImageUrl) {
    uploadedImageUrl = await uploadImageToArweave(IMAGE_FILE);
  }

  log(`🖼️ Uploaded image`, uploadedImageUrl);

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
