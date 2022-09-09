#!/usr/bin/env ts-node

// Send the token to Vaheh's wallet
// https://github.com/solana-labs/solana-program-library/blob/master/token/js/examples/createMintAndTransferTokens.ts

import { log, stringify } from "./src/backend/functions";
import { MIKES_WALLET, YCOMBINATOR_DEMO_WALLET_FOR_JARED } from "./src/backend/constants";
import { getTokenMetaData, mintIdentityToken } from "./src/backend/identity-tokens";
import { connect, getKeypairFromString } from "./src/backend/vmwallet";
import dotenv from "dotenv";
import { makeTokenAccount, transferPortalIdentityToken } from "./src/backend/tokens";
import { PublicKey } from "@solana/web3.js";

dotenv.config();

const identityTokenPrivateKey = process.env.IDENTITY_TOKEN_PRIVATE_KEY;

if (!identityTokenPrivateKey) {
  throw new Error(`Please set IDENTITY_TOKEN_PRIVATE_KEY in .env file`);
}

const identityTokenIssuer = getKeypairFromString(identityTokenPrivateKey);

const mintAndTransferIdentityToken = async (
  wallet: string,
  givenName: string,
  familyName: string
) => {
  log(`🏦 Minting identity tokens`);
  const connection = await connect("mainNetBeta");

  const tokenCreateOutput = await mintIdentityToken(
    connection,
    identityTokenIssuer,
    getTokenMetaData(wallet, givenName, familyName),
    true
  );

  const mintAddress = tokenCreateOutput.mintAddress;
  const tokenAddress = tokenCreateOutput.tokenAddress;

  log(`🎟️The token for ${givenName} has been created.`, {
    mintAddress: mintAddress.toBase58(),
    tokenAddress: tokenAddress.toBase58(),
  });

  // Yes really, the sender token account is the token address
  const senderTokenAccount = tokenAddress;

  const tokenAccountResults = await makeTokenAccount(
    connection,
    identityTokenIssuer,
    mintAddress,
    new PublicKey(wallet)
  );

  const recipientTokenAccount = tokenAccountResults.address;

  log(
    `👛 made token account for this mint on ${givenName}'s wallet, recipient token account is`,
    recipientTokenAccount.toBase58()
  );

  const signature = await transferPortalIdentityToken(
    connection,
    identityTokenIssuer,
    senderTokenAccount,
    recipientTokenAccount
  );

  log(`Transferred token to final destination!`, signature);

  log(`✅ Completed successfully`);
};

mintAndTransferIdentityToken(YCOMBINATOR_DEMO_WALLET_FOR_JARED, "Jared", "Friedman");
