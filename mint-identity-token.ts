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

const WALLET_ADDRESS = "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM";
const GIVEN_NAME = "Micheal-Sean";
const FAMILY_NAME = "MacCana";
const IMAGE_FILE = "mike.jpg";

// ------------------------------------------------------------------------------

// Partial because we haven't filled in image URL yet
const tokenContentsNoImageUrl: Omit<VerifiedClaimsForIndividual, "imageUrl"> = {
  type: "INDIVIDUAL",
  givenName: GIVEN_NAME,
  familyName: FAMILY_NAME,
};

const ALREADY_UPLOADED_ARWEAVE_IMAGE = "https://i.imgur.com/8UJBQqd.jpg"; // null

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
  let tokenCreateOutput = await mintIdentityToken(
    connection,
    walletAddress,
    tokenContents,
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
