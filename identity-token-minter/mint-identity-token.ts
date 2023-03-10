// Run with 'npm run mint-identity-token'
// Otherwise trying to load Dialect npm module will fail
// (the npm script sets an environent variable to disable Dialect)

import { log, sleep, stringify } from "../src/backend/functions";
import {
  transferIdentityToken,
  mintIdentityToken,
} from "../src/backend/identity-tokens";
import { uploadImageToPinata } from "../src/backend/pinata";
import dotenv from "dotenv";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import base58 from "bs58";
import { getKeypairFromString } from "../src/backend/solana-functions";
import type {
  VerifiedClaimsForIndividual,
  VerifiedClaimsForOrganization,
} from "../src/backend/types";
import { connect } from "../src/backend/wallet";

dotenv.config();

import { config } from "../mint-identity-token-config";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

const main = async () => {
  log(
    `'\n\nMake sure to fix the ENABLE BELOW FOR TOKEN MINTER code otherwise this will fail\n\n`
  );

  log(`🎟️ Running Portal Identity token minter ...`);

  const identityTokenSecretKey = process.env.IDENTITY_TOKEN_SECRET_KEY;

  const connection: Connection = await connect("quickNodeMainNetBeta");

  const walletAddress = new PublicKey(config.walletAddress);

  if (!identityTokenSecretKey) {
    throw new Error(`Please set IDENTITY_TOKEN_SECRET_KEY in .env file`);
  }

  const identityTokenIssuer = getKeypairFromString(identityTokenSecretKey);

  // Step 1a. Upload individual image if necessary
  let uploadedIndividualOrOrganizationImageUrl: string | null =
    config.alreadyUploadedIndividualOrOrganizationImage;

  if (uploadedIndividualOrOrganizationImageUrl) {
    log(
      `🖼️ Using already-uploaded individual image`,
      uploadedIndividualOrOrganizationImageUrl
    );
  } else {
    uploadedIndividualOrOrganizationImageUrl = await uploadImageToPinata(
      config.individualOrOrganizationImageFile
    );
    log(
      `🖼️ Uploaded individual image`,
      uploadedIndividualOrOrganizationImageUrl
    );
  }

  // Step 1b. Upload cover image if necessary
  let uploadedCoverImageUrl: string | null = config.alreadyUploadedCoverImage;

  if (uploadedCoverImageUrl) {
    log(`🖼️ Using already-uploaded cover image`, uploadedCoverImageUrl);
  } else {
    uploadedCoverImageUrl = await uploadImageToPinata(config.coverImageFile);
    log(`🖼️ Uploaded cover image`, uploadedCoverImageUrl);
  }

  const tokenClaims:
    | VerifiedClaimsForIndividual
    | VerifiedClaimsForOrganization = {
    ...config.tokenClaimsNoImageUrl,
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

  log("tokenCreateOutput", stringify(tokenCreateOutput));

  // Step 3. Move the minted token to the final recipient.
  const mintAddress = tokenCreateOutput.address;

  const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    identityTokenIssuer,
    mintAddress,
    identityTokenIssuer.publicKey
  );

  const senderTokenAccountAddress = senderTokenAccount.address;

  log(`>>> DEBUG mintAddress`, mintAddress);
  log(`>>> DEBUG senderTokenAccountAddress`, senderTokenAccountAddress);

  const recipientWallet = new PublicKey(config.walletAddress);

  const transactionId = await transferIdentityToken(
    connection,
    mintAddress,
    senderTokenAccountAddress,
    recipientWallet,
    identityTokenIssuer
  );
  log(transactionId);

  log(`✅ Completed successfully`);
};

main();
