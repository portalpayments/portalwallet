// Run with 'npm run mint-identity-token'
// Otherwise trying to load Dialect npm module will fail
// (the npm script sets an environent variable to disable Dialect)

import { log, sleep, stringify } from "./src/backend/functions";
import {
  transferIdentityToken,
  mintIdentityToken,
} from "./src/backend/identity-tokens";
import { uploadImageToArweave } from "./src/backend/arweave";
import dotenv from "dotenv";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import base58 from "bs58";
import { getKeypairFromString } from "./src/backend/solana-functions";
import type {
  VerifiedClaimsForIndividual,
  VerifiedClaimsForOrganization,
} from "./src/backend/types";
import type { CreateNftOutput } from "@metaplex-foundation/js";
import { connect } from "./src/backend/wallet";

dotenv.config();

const WALLET_ADDRESS = "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG";
const GIVEN_NAME = "Vaheh";
const FAMILY_NAME = "Hatami";
const INDIVIDUAL_IMAGE_FILE = "vaheh.jpg";
const IDENTITY_TOKEN_COVER_IMAGE_FILE =
  "identity-token-cover-image-for-vaheh.png";

// ------------------------------------------------------------------------------

// Partial because we haven't filled in image URL yet
const tokenClaimsNoImageUrl: Omit<VerifiedClaimsForIndividual, "imageUrl"> = {
  type: "INDIVIDUAL",
  givenName: GIVEN_NAME,
  familyName: FAMILY_NAME,
};

const ALREADY_UPLOADED_INDIVIDUAL_IMAGE = null;
const ALREADY_UPLOADED_COVER_IMAGE = null;

const main = async () => {
  log(`🎟️ Running Portal Identity token minter ...`);

  const identityTokenSecretKey = process.env.IDENTITY_TOKEN_SECRET_KEY;

  const connection: Connection = await connect("quickNodeMainNetBeta");

  const walletAddress = new PublicKey(WALLET_ADDRESS);

  if (!identityTokenSecretKey) {
    throw new Error(`Please set IDENTITY_TOKEN_SECRET_KEY in .env file`);
  }

  log(
    stringify({
      WALLET_ADDRESS,
      tokenClaims: tokenClaimsNoImageUrl,
      coverImage: IDENTITY_TOKEN_COVER_IMAGE_FILE,
    })
  );

  const identityTokenIssuer = getKeypairFromString(identityTokenSecretKey);

  // Step 1a. Upload individual image if necessary
  let uploadedIndividualImageUrl: string | null =
    ALREADY_UPLOADED_INDIVIDUAL_IMAGE;

  if (uploadedIndividualImageUrl) {
    log(
      `🖼️ Using already-uploaded individual image`,
      uploadedIndividualImageUrl
    );
  } else {
    uploadedIndividualImageUrl = await uploadImageToArweave(
      INDIVIDUAL_IMAGE_FILE
    );
    log(`🖼️ Uploaded individual image`, uploadedIndividualImageUrl);
  }

  // Step 1b. Upload cover image if necessary
  let uploadedCoverImageUrl: string | null = ALREADY_UPLOADED_COVER_IMAGE;

  if (uploadedCoverImageUrl) {
    log(`🖼️ Using already-uploaded cover image`, uploadedCoverImageUrl);
  } else {
    uploadedCoverImageUrl = await uploadImageToArweave(INDIVIDUAL_IMAGE_FILE);
    log(`🖼️ Uploaded cover image`, uploadedCoverImageUrl);
  }

  const tokenClaims: VerifiedClaimsForIndividual = {
    ...tokenClaimsNoImageUrl,
    imageUrl: uploadedIndividualImageUrl,
  };

  // Step 2. Mint token (using the identity token issuer wallet) and then move the minted token to the final receipient.
  let tokenCreateOutput = await mintIdentityToken(
    connection,
    walletAddress,
    tokenClaims,
    uploadedCoverImageUrl,
    identityTokenIssuer,
    true
  );

  // Step 3. Move the minted token to the final recipient.
  const mintAddress = tokenCreateOutput.mintAddress;
  const senderTokenAccount = tokenCreateOutput.tokenAddress;

  const recipientWallet = new PublicKey(WALLET_ADDRESS);

  const transactionId = await transferIdentityToken(
    connection,
    mintAddress,
    senderTokenAccount,
    recipientWallet,
    identityTokenIssuer
  );
  log(transactionId);

  log(`✅ Completed successfully`);
};

main();
