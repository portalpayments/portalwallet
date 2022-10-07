#!/usr/bin/env ts-node

import { BundlrStorageDriver } from "@metaplex-foundation/js";
import { getMetaplex } from "./src/identity-tokens";
import { connect, getKeypairFromString } from "./src/vmwallet";
import dotenv from "dotenv";

dotenv.config();

const identityTokenSecretKey = process.env.IDENTITY_TOKEN_SECRET_KEY;

if (!identityTokenSecretKey) {
  throw new Error(`Please set IDENTITY_TOKEN_SECRET_KEY in .env file`);
}

const identityTokenIssuer = getKeypairFromString(identityTokenSecretKey);

(async () => {
  // See https://www.npmjs.com/package/@metaplex-foundation/js
  // scroll to 'bundlrStorage'
  const connection = await connect("ankrMainNet");
  const metaplex = getMetaplex(connection, identityTokenIssuer, true);
  const bundlrStorage = metaplex.storage().driver() as BundlrStorageDriver;

  const bundlr = await bundlrStorage.bundlr();

  bundlr.fund(1000); // Fund using lamports directly.
})();
