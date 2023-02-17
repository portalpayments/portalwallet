// Run with 'npx esrun mint-identity-token.ts'
// because 'ts-node' and 'tsx has issues:
// https://github.com/TypeStrong/ts-node/issues/1062#issuecomment-1192847985

import { log, sleep, stringify } from "./src/backend/functions";
import {
  mintAndTransferIdentityToken,
  mintIdentityToken,
} from "./src/backend/identity-tokens";
import { uploadImageToArweave } from "./src/backend/arweave";
import dotenv from "dotenv";
import { Keypair } from "@solana/web3.js";
import base58 from "bs58";
import { getKeypairFromString } from "./src/backend/solana-functions";
import type {
  VerifiedClaimsForIndividual,
  VerifiedClaimsForOrganization,
} from "./src/backend/types";
import type { CreateNftOutput } from "@metaplex-foundation/js";

dotenv.config();

const WALLET_ADDRESS = "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM";
const GIVEN_NAME = "Mike";
const FAMILY_NAME = "MacCana";
const IMAGE_FILE = "mike.jpg";

// ------------------------------------------------------------------------------

// Partial because we haven't filled in image URL yet
const tokenContentsNoImageUrl: Omit<VerifiedClaimsForIndividual, "imageUrl"> = {
  type: "INDIVIDUAL",
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
      tokenContents: tokenContentsNoImageUrl,
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

  const tokenContents: VerifiedClaimsForIndividual = {
    ...tokenContentsNoImageUrl,
    imageUrl: uploadedImageUrl,
  };

  // Step 2. Mint token (using the identity token issuer wallet) and then move the minted token to the final receipient.
  let tokenCreateOutput: CreateNftOutput;

  try {
    tokenCreateOutput = await mintIdentityToken(
      WALLET_ADDRESS,
      tokenContents,
      identityTokenIssuer,
      true
    );
  } catch (thrownObject) {
    const error = thrownObject as Error;
    if (error.message.includes("insufficient lamports")) {
      throw new Error(
        `⚠️ The token mint account has run out of Sol. Please send a small amount of Sol to the Token issuer account ${identityTokenIssuer.publicKey.toBase58()}`
      );
    }
    log(`Unexpected error making NFT: ${error.message}`);
    throw error;
  }

  // Step 3. Move the minted token to the final recipient.

  const transactionId = await mintAndTransferIdentityToken(
    tokenCreateOutput,
    WALLET_ADDRESS,
    tokenContents,
    identityTokenIssuer
  );
  log(transactionId);

  log(`✅ Completed successfully`);
};

main();
