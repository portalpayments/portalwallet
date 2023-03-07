// Run with 'npm run mint-identity-token'
// Otherwise trying to load Dialect npm module will fail
// (the npm script sets an environent variable to disable Dialect)

import { log, sleep, stringify } from "./src/backend/functions";
import {
  transferIdentityToken,
  mintIdentityToken,
} from "./src/backend/identity-tokens";
import { uploadImageToPinata } from "./src/backend/pinata";
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

// const WALLET_ADDRESS = "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG";
// const GIVEN_NAME = "Vaheh";
// const FAMILY_NAME = "Hatami";
// const INDIVIDUAL_OR_ORGANIZATION_IMAGE_FILE = "vaheh.jpg";
// const COVER_IMAGE_FILE = "identity-token-cover-image-for-vaheh.png";

// const ALREADY_UPLOADED_INDIVIDUAL_OR_ORGANIZATION_IMAGE =
//   "https://gateway.pinata.cloud/ipfs/QmeSwV7adusNDe4BFnet46Xbcwg3PX8hqV8DnckfDw1nei";

// const ALREADY_UPLOADED_COVER_IMAGE =
//   "https://gateway.pinata.cloud/ipfs/QmQo43qNLTjrAALrrvAck7kykdFXzVGoyrwP7B6vXojipf";

// // Partial because we haven't filled in image URL yet
// const tokenClaimsNoImageUrl: Omit<VerifiedClaimsForIndividual, "imageUrl"> = {
//   type: "INDIVIDUAL",
//   givenName: GIVEN_NAME,
//   familyName: FAMILY_NAME,
// };

const WALLET_ADDRESS = "7bz4h6T4p39ozCnz7vpDmmiFNssyV1d1Hu3TKcDXmSXu";
const LEGAL_NAME = "Bridgesplit, Inc.";
const STATE = "Delaware";
const COUNTRY = "United States of America";
const JURISDICTION = "State";
const INDIVIDUAL_OR_ORGANIZATION_IMAGE_FILE = "bridgesplit.jpg";
const COVER_IMAGE_FILE = "identity-token-cover-image-for-bridgesplit.png";
const IS_NOTABLE = true;

const ALREADY_UPLOADED_INDIVIDUAL_OR_ORGANIZATION_IMAGE =
  "https://gateway.pinata.cloud/ipfs/QmYtohFcvN3DT9pdEofWd7meYA87gRpFnBRAKgRPMp5XBW";
const ALREADY_UPLOADED_COVER_IMAGE = null;

// Partial because we haven't filled in image URL yet
const tokenClaimsNoImageUrl: Omit<VerifiedClaimsForOrganization, "imageUrl"> = {
  type: "ORGANIZATION",
  legalName: LEGAL_NAME,
  state: STATE,
  jurisdiction: JURISDICTION,
  country: COUNTRY,
  isNotable: IS_NOTABLE,
};

// No need to change anything below this line
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

const main = async () => {
  log(
    `'\n\nMake sure to fix the ENABLE BELOW FOR TOKEN MINTER code otherwise this will fail\n\n`
  );

  log(`🎟️ Running Portal Identity token minter ...`);

  const identityTokenSecretKey = process.env.IDENTITY_TOKEN_SECRET_KEY;

  const connection: Connection = await connect("quickNodeMainNetBetaBackup");

  const walletAddress = new PublicKey(WALLET_ADDRESS);

  if (!identityTokenSecretKey) {
    throw new Error(`Please set IDENTITY_TOKEN_SECRET_KEY in .env file`);
  }

  log(
    stringify({
      WALLET_ADDRESS,
      tokenClaims: tokenClaimsNoImageUrl,
      individualImage: INDIVIDUAL_OR_ORGANIZATION_IMAGE_FILE,
      coverImage: COVER_IMAGE_FILE,
    })
  );

  const identityTokenIssuer = getKeypairFromString(identityTokenSecretKey);

  // Step 0:

  // Step 1a. Upload individual image if necessary
  let uploadedIndividualOrOrganizationImageUrl: string | null =
    ALREADY_UPLOADED_INDIVIDUAL_OR_ORGANIZATION_IMAGE;

  if (uploadedIndividualOrOrganizationImageUrl) {
    log(
      `🖼️ Using already-uploaded individual image`,
      uploadedIndividualOrOrganizationImageUrl
    );
  } else {
    uploadedIndividualOrOrganizationImageUrl = await uploadImageToPinata(
      INDIVIDUAL_OR_ORGANIZATION_IMAGE_FILE
    );
    log(
      `🖼️ Uploaded individual image`,
      uploadedIndividualOrOrganizationImageUrl
    );
  }

  // Step 1b. Upload cover image if necessary
  let uploadedCoverImageUrl: string | null = ALREADY_UPLOADED_COVER_IMAGE;

  if (uploadedCoverImageUrl) {
    log(`🖼️ Using already-uploaded cover image`, uploadedCoverImageUrl);
  } else {
    uploadedCoverImageUrl = await uploadImageToPinata(COVER_IMAGE_FILE);
    log(`🖼️ Uploaded cover image`, uploadedCoverImageUrl);
  }

  const tokenClaims:
    | VerifiedClaimsForIndividual
    | VerifiedClaimsForOrganization = {
    ...tokenClaimsNoImageUrl,
    imageUrl: uploadedIndividualOrOrganizationImageUrl,
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

  log(`>>> DEBUG mintAddress`, mintAddress);
  log(`>>> DEBUG senderTokenAccount`, senderTokenAccount);

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
