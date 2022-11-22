import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import type {
  TransactionResponse,
  ParsedTransactionWithMeta,
} from "@solana/web3.js";

import { log, sleep, stringify } from "./functions";
import {
  LATEST_IDENTITY_TOKEN_VERSION,
  URLS,
  SECOND,
  USDC_MAINNET_MINT_ACCOUNT,
} from "./constants";
import { asyncMap } from "./functions";
import base58 from "bs58";
import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import type { RawAccount } from "@solana/spl-token";
import { getIdentityTokensFromWallet } from "./identity-tokens";
import type { TokenMetaData, VerifiedClaims } from "./types";
import { summarizeTransaction } from "./transactions";
import { httpGet } from "../lib/utils";

const VERIFIED_CLAIMS_BY_ADDRESS: Record<string, VerifiedClaims> = {};

export const getKeypairFromString = (secretKeyString: string) => {
  let decodedSecretKey: Uint8Array;
  try {
    decodedSecretKey = base58.decode(secretKeyString);
  } catch (throwObject) {
    throw new Error("Invalid secret key! See README.md");
  }
  return Keypair.fromSecretKey(decodedSecretKey);
};

export const getUSDCAccounts = async (
  connection: Connection,
  publicKey: PublicKey,
  usdcMintAccount = USDC_MAINNET_MINT_ACCOUNT
) => {
  try {
    let parsedTokenAccountsByOwner =
      await connection.getParsedTokenAccountsByOwner(publicKey, {
        mint: new PublicKey(usdcMintAccount),
      });
    return parsedTokenAccountsByOwner.value;
  } catch (thrownObject) {
    const error = thrownObject as Error;
    console.trace();
    throw new Error(`Error in getParsedTokenAccountsByOwner: ${error.message}`);
  }
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

  // Wait for airdrop confirmation
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  });
};

export const getKeypairFromEnvFile = (envFileKey: string) => {
  // From https://yihau.github.io/solana-web3-demo/tour/create-keypair.html
  const secretKeyFromEnvFile = process.env[envFileKey];
  if (!secretKeyFromEnvFile) {
    throw new Error(
      `Please add '${envFileKey}' to your .env file with a private key extracted from Phantom etc.`
    );
  }
  const keyPair = getKeypairFromString(secretKeyFromEnvFile);
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
  metaplexConnectionKeypair: Keypair,
  identityTokenIssuerPublicKey: PublicKey,
  wallet: PublicKey,
  useCache = true
): Promise<VerifiedClaims | null> => {
  const walletString = wallet.toBase58();

  if (useCache) {
    const cachedVerifiedClaims = VERIFIED_CLAIMS_BY_ADDRESS[walletString];
    if (cachedVerifiedClaims) {
      log(`Found verified claims for ${walletString} in cache`);
      sleep(1 * SECOND);
      return cachedVerifiedClaims;
    }
  }

  const identityTokens = await getIdentityTokensFromWallet(
    connection,
    metaplexConnectionKeypair,
    identityTokenIssuerPublicKey,
    wallet
  );

  if (!identityTokens.length) {
    return null;
  }

  const tokensMetadata = (await asyncMap(
    identityTokens,
    async (identityTokens) => {
      const metadata = await httpGet(identityTokens.uri);
      return metadata;
    }
  )) as Array<TokenMetaData>;

  const currentTokenMetadata = await tokensMetadata.filter((tokenMetadata) => {
    // Don't support older, beta tokens.
    if (tokenMetadata.version < LATEST_IDENTITY_TOKEN_VERSION) {
      return false;
    }
    // Ensure the token is actually issued for this wallet
    if (tokenMetadata.issuedAgainst !== walletString) {
      return false;
    }
    return true;
  });

  if (!currentTokenMetadata.length) {
    log(`No current identity token was issued to this wallet`);
    return null;
  }

  const latestTokenMetadata = currentTokenMetadata?.[0];

  return latestTokenMetadata.claims;
};

// https://www.quicknode.com/guides/web3-sdks/how-to-get-transaction-logs-on-solana
export const getTransactionsForAddress = async (
  connection: Connection,
  address: PublicKey,
  limit: number
) => {
  const confirmedSignatureInfos = await connection.getSignaturesForAddress(
    address,
    { limit }
  );

  log(
    `Got ${confirmedSignatureInfos.length} confirmedSignatureInfos with a limit of ${limit}`
  );

  let signatures: Array<string> = confirmedSignatureInfos.map(
    (confirmedSignatureInfo) => confirmedSignatureInfo.signature
  );

  log(`Got ${signatures.length} signatures`);

  const transactions: Array<ParsedTransactionWithMeta> =
    await connection.getParsedTransactions(signatures, {
      // NOTE: we can't use commitment: finalised in our localhost validator
      // commitment: "finalized",
    });

  return transactions;
};

export const getTransactionSummariesForTokenAccount = async (
  connection: Connection,
  walletAddress: PublicKey,
  tokenMint: PublicKey,
  limit: number
) => {
  const tokenAccounts = await getTokenAccountsByOwner(
    connection,
    walletAddress
  );
  const tokenAccountForCurrency = tokenAccounts.find((tokenAccount) => {
    // We need to compare by value, otherwise the account won't be found
    return tokenAccount.mint.toBase58() === tokenMint.toBase58();
  });

  if (!tokenAccountForCurrency) {
    throw new Error(`Could not find an account for ${tokenMint}`);
  }

  const transactionSummaries = await getTransactionSummariesForAddress(
    connection,
    walletAddress,
    tokenAccountForCurrency.address,
    limit
  );

  return transactionSummaries;
};

export const getTransactionSummariesForAddress = async (
  connection: Connection,
  walletAddress: PublicKey,
  tokenAccount: PublicKey | null,
  limit: number
) => {
  // For token accounts, we must get transactions for the token account specifically
  // - getting transactions for the parent wallet won't show deposits by other people
  // since deposits by other people aren't signed by our wallet
  const addressToGetTransactionsFor = tokenAccount || walletAddress;
  const rawTransactions = await getTransactionsForAddress(
    connection,
    addressToGetTransactionsFor,
    limit
  );

  if (!rawTransactions.length) {
    // TODO: we may wish to change this to a warning
    throw new Error(
      `Could not get any rawTransactions for ${walletAddress.toBase58()}`
    );
  }

  log(
    `In getTransactionSummariesForAddress, limit was ${limit}, got ${rawTransactions.length} rawTransactions`
  );

  let transactionSummaries = rawTransactions.map((rawTransaction) => {
    return summarizeTransaction(rawTransaction, walletAddress);
  });

  // We can't summarize all transactions yet
  transactionSummaries = transactionSummaries.filter(
    (transactionSummary) => transactionSummary !== null
  );

  return transactionSummaries;
};
