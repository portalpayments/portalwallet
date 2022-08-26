#!/usr/bin/env ts-node

// Send the token to Vaheh's wallet

import { log, stringify } from "./src/functions";
import { MIKES_WALLET, VAHEHS_WALLET } from "./src/constants";
import { mintIdentityToken } from "./src/identity-tokens";
import { connect, getKeypairFromString } from "./src/vmwallet";
import dotenv from "dotenv";

dotenv.config();

const identityTokenPrivateKey = process.env.IDENTITY_TOKEN_PRIVATE_KEY;

if (!identityTokenPrivateKey) {
  throw new Error(`Please set IDENTITY_TOKEN_PRIVATE_KEY in .env file`);
}

const portalIdentityTokenIssuer = getKeypairFromString(identityTokenPrivateKey);

const mikeMetadata = {
  version: 1,
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

  const mikeTokenCreateOutput = await mintIdentityToken(
    connection,
    portalIdentityTokenIssuer,
    mikeMetadata
  );

  log(
    `🎟️ make portal identity token for Mike`,
    stringify(mikeTokenCreateOutput)
  );

  const vahehTokenCreateOutput = await mintIdentityToken(
    connection,
    portalIdentityTokenIssuer,
    vahehMetadata
  );

  log(
    `🎟️ make portal identity token for Vaheh`,
    stringify(vahehTokenCreateOutput)
  );

  log(`Completed successfully`);
})();
