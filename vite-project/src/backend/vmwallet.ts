import { AccountInfo, Connection, Keypair, PublicKey } from "@solana/web3.js";

import { log } from "./functions";
import {
  LATEST_IDENTITY_TOKEN_VERSION,
  MIKES_WALLET,
  URLS,
  USDC_MAINNET_MINT_ACCOUNT,
} from "./constants";
import { asyncMap } from "./functions";
import base58 from "bs58";
import { AccountLayout, RawAccount, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import axios, { AxiosResponse } from "axios";
import { getIdentityTokenFromWallet } from "./identity-tokens";
import type { VerifiedClaims } from "./types";

export const getKeypairFromString = (privateKeyString: string) => {
  let decodedPrivateKey: Buffer;
  try {
    decodedPrivateKey = base58.decode(privateKeyString);
  } catch (throwObject) {
    throw new Error("Invalid private key! See README.md");
  }
  return Keypair.fromSecretKey(decodedPrivateKey);
};

export const getUSDCAccounts = async (
  connection: Connection,
  publicKey: PublicKey,
  usdcMintAccount = USDC_MAINNET_MINT_ACCOUNT
) => {
  let parsedTokenAccountsByOwner =
    await connection.getParsedTokenAccountsByOwner(publicKey, {
      mint: new PublicKey(usdcMintAccount),
    });
  return parsedTokenAccountsByOwner.value;
};

export const connect = async (
  networkName: keyof typeof URLS
): Promise<Connection> => {
  log(`⚡ Connecting to ${networkName}`);
  const connection = new Connection(URLS[networkName], {
    commitment: "confirmed",
    disableRetryOnRateLimit: true,
  });
  return connection;
};

// See https://github.com/Bonfida/bonfida-utils/blob/main/js
export const checkAccountExists = async (
  connection: Connection,
  publicKey: PublicKey
): Promise<boolean> => {
  const accountInfo = await connection.getAccountInfo(publicKey);
  if (!accountInfo) {
    return false;
  }
  return true;
};

export const getAccountBalance = async (
  connection: Connection,
  publicKey: PublicKey
) => {
  let accountInfo = await connection.getAccountInfo(publicKey);
  if (!accountInfo) {
    throw new Error(`Could not find account '${publicKey}'`);
  }
  log("💰 Account balance:", accountInfo.lamports);
  return accountInfo.lamports;
};

export const putSolIntoWallet = async (
  connection: Connection,
  publicKey: PublicKey,
  lamports: number
) => {
  log(`💸 Putting Sol into wallet`);
  // Generate a new wallet keypair and airdrop SOL
  var airdropSignature = await connection.requestAirdrop(publicKey, lamports);

  const latestBlockHash = await connection.getLatestBlockhash();

  //wait for airdrop confirmation
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  });
};

export const getKeypairFromEnvFile = (envFileKey: string) => {
  // From https://yihau.github.io/solana-web3-demo/tour/create-keypair.html
  const privateKeyFromEnvFile = process.env[envFileKey];
  if (!privateKeyFromEnvFile) {
    throw new Error(
      `Please add '${envFileKey}' to your .env file with a private key extracted from Phantom etc.`
    );
  }
  const keyPair = getKeypairFromString(privateKeyFromEnvFile);
  return keyPair;
};

// Make a custom object that combined the decoded rawAccount
// with the public key in the token Accounts address
// So we have all the useful detauls for an Associated Token Account
// in one object
interface TokenAccount extends RawAccount {
  address: PublicKey;
}

// Just a wrapper with sensible defaults
export const getTokenAccountsByOwner = async (
  connection: Connection,
  publicKey: PublicKey
): Promise<Array<TokenAccount>> => {
  const tokenAccountsByOwner = await connection.getTokenAccountsByOwner(
    publicKey,
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );

  const tokenAccounts = await asyncMap(
    tokenAccountsByOwner.value,
    async (tokenAccount) => {
      const rawAccountWithAddress: Partial<TokenAccount> = AccountLayout.decode(
        tokenAccount.account.data
      );
      rawAccountWithAddress.address = tokenAccount.pubkey;

      return rawAccountWithAddress;
    }
  );

  return tokenAccounts as Array<TokenAccount>;
};

export const verifyWallet = async (
  connection: Connection,
  metaplexKeypair: Keypair,
  identityTokenIssuerPublicKey: PublicKey,
  wallet: PublicKey
): Promise<VerifiedClaims | null> => {
  const identityToken = await getIdentityTokenFromWallet(
    connection,
    metaplexKeypair,
    identityTokenIssuerPublicKey,
    wallet
  );

  if (!identityToken) {
    return null;
  }

  let arweaveResponse: AxiosResponse<any, any>;
  try {
    arweaveResponse = await axios.get(identityToken.uri);
  } catch (thrownObject) {
    const error = thrownObject as Error;
    throw new Error(`Error fetching data from ARWeave: ${error.message}`);
  }

  const arweaveResponseBody = arweaveResponse.data;

  // Ensure the token is actually issued for this wallet
  if (arweaveResponseBody.issuedAgainst !== wallet.toBase58()) {
    return null;
  }

  // Don't support older, beta tokens.
  if (arweaveResponseBody.version < LATEST_IDENTITY_TOKEN_VERSION) {
    return null;
  }

  return arweaveResponseBody.claims;
};
