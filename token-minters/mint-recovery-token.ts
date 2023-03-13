// Run with 'npm run mint-recovery-token'

import { Connection, Keypair } from "@solana/web3.js";
import { connect } from "../src/backend/wallet";
import { getKeypairFromString } from "../src/backend/solana-functions";
import {
  makeRecoveryTokenCiphertextAndInitializationVector,
  makeRecoveryTokenOffChainMetadata,
  mintRecoveryToken,
} from "../src/backend/recovery-token";
import dotenv from "dotenv";
import { log } from "console";
import { stringify } from "../src/backend/functions";
import { getMetaplex } from "../src/backend/identity-tokens";

const connection = await connect("quickNodeMainNetBeta");

dotenv.config();

const userSecretKey = process.env.MIKES_SECRET_KEY || null;
if (!userSecretKey) {
  throw new Error(`Please set MIKES_SECRET_KEY in .env file`);
}
const user = getKeypairFromString(userSecretKey);

const personalPhrase = process.env.MIKES_PERSONAL_PHRASE || null;
if (!personalPhrase) {
  throw new Error(`Please set MIKES_PERSONAL_PHRASE in .env file`);
}

const walletUnlockPassword = process.env.MIKES_WALLET_UNLOCK || null;
if (!walletUnlockPassword) {
  throw new Error(`Please set MIKES_WALLET_UNLOCK in .env file`);
}

// ----------------------------------------------------------

const metaplex = getMetaplex(connection, user, true);

const metaplexNFTs = metaplex.nfts();

const recoveryTokenOffChainMetadata = await makeRecoveryTokenOffChainMetadata(
  user,
  personalPhrase,
  walletUnlockPassword
);

const metadataUploadResponse = await metaplexNFTs.uploadMetadata(
  recoveryTokenOffChainMetadata
);

const externalMetadataUri = metadataUploadResponse.uri;

const recoveryToken = await mintRecoveryToken(
  connection,
  user,
  externalMetadataUri
);

log(stringify(recoveryToken));
