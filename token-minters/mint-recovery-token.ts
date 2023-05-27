// Run with 'npm run mint-recovery-token'

import { connect } from "../src/backend/wallet";
import { getKeypairFromString } from "../src/backend/solana-functions";
import { makeRecoveryTokenOffChainMetadata, mintRecoveryToken } from "../src/backend/recovery-token";
import dotenv from "dotenv";
import { log } from "console";
import { getFromEnv, stringify } from "../src/backend/functions";
import { getMetaplex } from "../src/backend/identity-tokens";

const connection = await connect("heliusMainNet");

dotenv.config();

const user = getKeypairFromString(getFromEnv("MIKES_SECRET_KEY"));

const personalPhrase = getFromEnv("MIKES_PERSONAL_PHRASE");

const walletUnlockPassword = getFromEnv("MIKES_WALLET_UNLOCK_PASSWORD");

// ----------------------------------------------------------

const metaplex = getMetaplex(connection, user, true);

const metaplexNFTs = metaplex.nfts();

const recoveryTokenOffChainMetadata = await makeRecoveryTokenOffChainMetadata(
  user,
  personalPhrase,
  walletUnlockPassword
);

const metadataUploadResponse = await metaplexNFTs.uploadMetadata(recoveryTokenOffChainMetadata);

const externalMetadataUri = metadataUploadResponse.uri;

const recoveryToken = await mintRecoveryToken(connection, user, externalMetadataUri);

log(stringify(recoveryToken));
