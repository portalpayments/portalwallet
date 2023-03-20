#!/usr/bin/env ts-node

import { BundlrStorageDriver } from "@metaplex-foundation/js";
import { getMetaplex } from "./src/backend/identity-tokens";
import { connect } from "./src/backend/wallet";
import { getKeypairFromString } from "./src/backend/solana-functions";
import dotenv from "dotenv";
import { getFromEnv } from "./src/backend/functions";

dotenv.config();

const identityTokenIssuer = getKeypairFromString(
  getFromEnv("IDENTITY_TOKEN_SECRET_KEY")
);

(async () => {
  // See https://www.npmjs.com/package/@metaplex-foundation/js
  // scroll to 'bundlrStorage'
  const connection = await connect("quickNodeMainNetBeta");
  const metaplex = getMetaplex(connection, identityTokenIssuer, true);
  const bundlrStorage = metaplex.storage().driver() as BundlrStorageDriver;

  const bundlr = await bundlrStorage.bundlr();

  bundlr.fund(1000); // Fund using lamports directly.
})();
