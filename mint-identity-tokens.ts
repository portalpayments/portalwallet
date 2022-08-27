#!/usr/bin/env ts-node

// Send the token to Vaheh's wallet
// https://github.com/solana-labs/solana-program-library/blob/master/token/js/examples/createMintAndTransferTokens.ts

import { log, stringify } from "./src/functions";
import { MIKES_WALLET, VAHEHS_WALLET } from "./src/constants";
import {
  getFullNFTsFromWallet,
  mintIdentityToken,
} from "./src/identity-tokens";
import { connect, getKeypairFromString } from "./src/vmwallet";
import dotenv from "dotenv";
import { transferPortalIdentityToken } from "./src/tokens";
import { Account } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";

dotenv.config();

const identityTokenPrivateKey = process.env.IDENTITY_TOKEN_PRIVATE_KEY;

if (!identityTokenPrivateKey) {
  throw new Error(`Please set IDENTITY_TOKEN_PRIVATE_KEY in .env file`);
}

const identityTokenIssuer = getKeypairFromString(identityTokenPrivateKey);

// Older were minted with test storage URLs, timed out, etc.
const LATEST_IDENTITY_TOKEN_VERSION = 5;

const mikeMetadata = {
  version: LATEST_IDENTITY_TOKEN_VERSION,
  // In future this can be removed, however right now Solana
  // token standard doesn't support non-transferrable tokens
  // So check that that token wasn't issued against another wallet and transferred
  issuedAgainst: MIKES_WALLET,
  claims: {
    type: "INDIVIDUAL",
    givenName: "Micheal-Sean",
    familyName: "MacCana",
    imageUrl: "//src/assets/verifiedMikeImage.png",
  },
};

const vahehMetadata = {
  version: 1,
  // In future this can be removed, however right now Solana
  // token standard doesn't support non-transferrable tokens
  // So check that that token wasn't issued against another wallet and transferred
  issuedAgainst: VAHEHS_WALLET,
  claims: {
    type: "INDIVIDUAL",
    givenName: "Vaheh",
    familyName: "Hatami",
    imageUrl: "//src/assets/verifiedVahehImage.png",
  },
};

(async () => {
  log(`🏦 Minting two identity tokens`);
  const connection = await connect("mainNetBeta");

  // const mikeTokenCreateOutput = await mintIdentityToken(
  //   connection,
  //   identityTokenIssuer,
  //   mikeMetadata,
  //   true
  // );

  // log(
  //   `🎟️ make portal identity token for Mike`,
  //   stringify(mikeTokenCreateOutput)
  // );

  const vahehTokenCreateOutput = await mintIdentityToken(
    connection,
    identityTokenIssuer,
    vahehMetadata,
    true
  );

  log(
    `🎟️ make portal identity token for Vaheh`,
    stringify(vahehTokenCreateOutput)
  );

  // log(`Finding the portal identity token minted for Mike`);

  // const identityTokens = await getFullNFTsFromWallet(
  //   identityTokenIssuer,
  //   connection,
  //   identityTokenIssuer.publicKey,
  //   "Portal Identity Token"
  // );
  // log(`Found identityTokens:`, stringify(identityTokens));

  // const SENDER_TOKEN_ACCOUNT_FOR_MIKES_IDENTITY_TOKEN = new PublicKey("x");

  // const transactionSignature = await transferPortalIdentityToken(
  //   connection,
  //   identityTokenIssuer,
  //   SENDER_TOKEN_ACCOUNT_FOR_MIKES_IDENTITY_TOKEN,
  //   mikesTokenAccount
  // );

  log(`✅ Completed successfully`);
})();
