#!/usr/bin/env ts-node

// Make the token and sent it to the recipient's wallet
// https://github.com/solana-labs/solana-program-library/blob/master/token/js/examples/createMintAndTransferTokens.ts

import { log, sleep, stringify } from "./functions";
import { makeTokenMetaData, mintIdentityToken } from "./identity-tokens";
import { connect, getKeypairFromString } from "./vmwallet";
import dotenv from "dotenv";
import { makeTokenAccount, transferPortalIdentityToken } from "./tokens";
import { PublicKey } from "@solana/web3.js";
import { uploadImageToArweave } from "./arweave";
import { SECONDS } from "./constants";

dotenv.config();

const identityTokenSecretKey = process.env.IDENTITY_TOKEN_SECRET_KEY;

if (!identityTokenSecretKey) {
  throw new Error(`Please set IDENTITY_TOKEN_SECRET_KEY in .env file`);
}

const identityTokenIssuer = getKeypairFromString(identityTokenSecretKey);

export const mintAndTransferIdentityToken = async (
  wallet: string,
  givenName: string,
  familyName: string,
  imageFile: string
) => {
  log(`🏦 Minting identity tokens`);
  const connection = await connect("quickNodeMainNetBeta");

  const imageUrl = await uploadImageToArweave(imageFile);

  log(`🖼️ Uploaded image`, imageUrl);

  const tokenCreateOutput = await mintIdentityToken(
    connection,
    identityTokenIssuer,
    makeTokenMetaData(wallet, givenName, familyName, imageUrl),
    true
  );

  const mintAddress = tokenCreateOutput.mintAddress;
  const tokenAddress = tokenCreateOutput.tokenAddress;

  log(`🎟️ The token for ${givenName} has been created.`, {
    mintAddress: mintAddress.toBase58(),
    tokenAddress: tokenAddress.toBase58(),
  });

  // TODO: there seems to be a race condition in metaplex
  // Adding this hack to avoid token account not found errors
  log(`sleeping again...`);
  await sleep(5 * SECONDS);
  log(`... done sleeping`);

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

  return signature;
};
