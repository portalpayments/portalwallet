#!/usr/bin/env ts-node

// Send the token to Vaheh's wallet
// https://github.com/solana-labs/solana-program-library/blob/master/token/js/examples/createMintAndTransferTokens.ts

import { log, stringify } from "./src/functions";
import {
  LATEST_IDENTITY_TOKEN_VERSION,
  MIKES_WALLET,
  VAHEHS_WALLET,
} from "./src/constants";
import {
  getFullNFTsFromWallet,
  getIdentityTokenFromWallet,
  getTokenMetaData,
  mintIdentityToken,
} from "./src/identity-tokens";
import { connect, getKeypairFromString } from "./src/vmwallet";
import dotenv from "dotenv";
import { makeTokenAccount, transferPortalIdentityToken } from "./src/tokens";
import { Account } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";

dotenv.config();

const identityTokenPrivateKey = process.env.IDENTITY_TOKEN_PRIVATE_KEY;

if (!identityTokenPrivateKey) {
  throw new Error(`Please set IDENTITY_TOKEN_PRIVATE_KEY in .env file`);
}

const identityTokenIssuer = getKeypairFromString(identityTokenPrivateKey);

(async () => {
  log(`🏦 Minting two identity tokens`);
  const connection = await connect("mainNetBeta");

  // const mikeTokenCreateOutput = await mintIdentityToken(
  //   connection,
  //   identityTokenIssuer,
  //   getTokenMetaData(MIKES_WALLET, "Micheal-Sean", "MacCana"),
  //   true
  // );

  // log(
  //   `🎟️ make portal identity token for Mike`,
  //   stringify(mikeTokenCreateOutput)
  // );

  // const vahehTokenCreateOutput = await mintIdentityToken(
  //   connection,
  //   identityTokenIssuer,
  //   getTokenMetaData(VAHEHS_WALLET, "Vaheh", "Hatami"),
  //   true
  // );

  // log(
  //   `🎟️ make portal identity token for Vaheh`,
  //   stringify(vahehTokenCreateOutput)
  // );

  // https://solscan.io/account/FvGmPpkBXQhBg6gdo7KiL6AtjfrQCsC2J1jdErdPGYfz
  // const mintAddress = new PublicKey(
  //   "J7nfNW2vZYeecyKFS6BrVTqayvxVVek21wbYGM97HCrs"
  // );
  // const destinationTokenAccount = await makeTokenAccount(
  //   connection,
  //   identityTokenIssuer,
  //   mintAddress,
  //   new PublicKey(MIKES_WALLET)
  // );

  // log(destinationTokenAccount);

  // const signature = await transferPortalIdentityToken(
  //   connection,
  //   identityTokenIssuer,
  //   new PublicKey("FvGmPpkBXQhBg6gdo7KiL6AtjfrQCsC2J1jdErdPGYfz"),
  //   new PublicKey("9A1FCs5FciGYpxz7yd8yrr2pjmFqtM9NRXMDCpAGWEGr")
  // );

  // log(signature);

  log(`Finding the portal identity token minted for Mike`);

  const identityToken = await getIdentityTokenFromWallet(
    connection,
    identityTokenIssuer,
    identityTokenIssuer.publicKey,
    new PublicKey(MIKES_WALLET)
  );
  log(identityToken);

  if (!identityToken) {
    throw new Error(`Mising identity token`);
  }

  const dataFromUri = await axios.get(identityToken.uri);
  log(dataFromUri);

  log(`✅ Completed successfully`);
})();
