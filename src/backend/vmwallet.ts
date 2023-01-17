import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import type { ParsedTransactionWithMeta } from "@solana/web3.js";

import { log, sleep, stringify } from "./functions";
import {
  LATEST_IDENTITY_TOKEN_VERSION,
  URLS,
  SECOND,
  mintToCurrencyMap,
  SOLANA_DECIMALS,
  getCurrencyByName,
} from "./constants";
import { asyncMap } from "./functions";
import base58 from "bs58";
import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import type { RawAccount } from "@solana/spl-token";
import { getIdentityTokensFromWallet } from "./identity-tokens";
import type { BasicTokenAccount, TokenMetaData, VerifiedClaims } from "./types";
import { summarizeTransaction } from "./transactions";
import { toUniqueStringArray } from "../lib/utils";
import * as http from "../lib/http-client";
import { HOW_MANY_TRANSACTIONS_TO_SHOW } from "../lib/constants";
import { Direction, type Contact, type SimpleTransaction } from "../lib/types";
import type { AccountSummary } from "../lib/types";
import { identityTokenIssuerPublicKey } from "../lib/stores";

const VERIFIED_CLAIMS_BY_ADDRESS: Record<string, VerifiedClaims> = {};

const debug = (_unused) => {};

export const getKeypairFromString = (secretKeyString: string) => {
  let decodedSecretKey: Uint8Array;
  try {
    decodedSecretKey = base58.decode(secretKeyString);
  } catch (throwObject) {
    throw new Error("Invalid secret key! See README.md");
  }
  return Keypair.fromSecretKey(decodedSecretKey);
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

// Get the token accounts, and return only the details we care about
export const getTokenAccountsByOwner = async (
  connection: Connection,
  publicKey: PublicKey
): Promise<Array<BasicTokenAccount>> => {
  const rawTokenAccountsByOwner = await connection.getTokenAccountsByOwner(
    publicKey,
    {
      programId: TOKEN_PROGRAM_ID,
    }
  );

  const tokenAccounts = await asyncMap(
    rawTokenAccountsByOwner.value,
    async (rawTokenAccount) => {
      // A Partial since we don't add 'address' until the next line
      const rawAccount = AccountLayout.decode(rawTokenAccount.account.data);

      const rawAccountBasics = {
        address: rawTokenAccount.pubkey,
        amount: rawAccount.amount,
        mint: rawAccount.mint,
      };

      return rawAccountBasics;
    }
  );

  return tokenAccounts;
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

  const tokensMetadata = await asyncMap(
    identityTokens,
    async (identityTokens) => {
      const metadata = (await http.get(identityTokens.uri)) as TokenMetaData;
      return metadata;
    }
  );

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
    // TODO: this seems to fire even with verified wallets
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
): Promise<Array<ParsedTransactionWithMeta>> => {
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
      // (it's a limitation of the localhost validator)
      // commitment: "finalized",

      // Fixes:
      // SolanaJSONRPCError: failed to get transactions: Transaction version (0) is not supported
      maxSupportedTransactionVersion: 0,
    });

  return transactions;
};

export const getTransactionSummariesForAddress = async (
  connection: Connection,
  walletAddress: PublicKey,
  tokenAccount: PublicKey | null,
  limit: number,
  secretKey: Uint8Array | null = null
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

  let transactionSummaries = await asyncMap(
    rawTransactions,
    (rawTransaction) => {
      return summarizeTransaction(
        rawTransaction,
        walletAddress,
        null,
        true,
        secretKey
      );
    }
  );

  // We can't summarize all transactions yet
  transactionSummaries = transactionSummaries.filter(
    (simpleTransaction) => simpleTransaction !== null
  );

  log(
    `In getTransactionSummariesForAddress, for wallet ${walletAddress.toBase58()} token account ${tokenAccount.toBase58()} limit was ${limit}, got ${
      rawTransactions.length
    } rawTransactions, produced ${
      transactionSummaries.length
    } transactionSummaries`
  );

  return transactionSummaries;
};

export const getTokenAccountSummaries = async (
  connection: Connection,
  keyPair: Keypair
): Promise<Array<AccountSummary>> => {
  const tokenAccounts = await getTokenAccountsByOwner(
    connection,
    keyPair.publicKey
  );
  const accountSummariesOrNulls: Array<AccountSummary | null> = await asyncMap(
    tokenAccounts,
    async (tokenAccount) => {
      const currencyInfo = mintToCurrencyMap[tokenAccount.mint.toBase58()];

      if (!currencyInfo) {
        debug(`Unknown currency for mint ${tokenAccount.mint}`);
        return null;
      }

      const currencyName = currencyInfo.name;
      log(`Getting transactions for ${currencyName} account`);
      const transactionSummaries = await getTransactionSummariesForAddress(
        connection,
        keyPair.publicKey,
        tokenAccount.address,
        HOW_MANY_TRANSACTIONS_TO_SHOW,
        keyPair.secretKey
      );
      const accountSummary: AccountSummary = {
        address: tokenAccount.address,
        currency: currencyInfo.id,
        // TODO - converting BigInt to Number may be sketchy
        balance: Number(tokenAccount.amount),
        decimals: currencyInfo.decimals,
        transactionSummaries,
      };
      return accountSummary;
    }
  );
  const accountSummaries: Array<AccountSummary> =
    accountSummariesOrNulls.filter((accountSummary) => accountSummary !== null);
  return accountSummaries;
};

export const getNativeAccountSummary = async (
  connection: Connection,
  keyPair: Keypair
): Promise<AccountSummary> => {
  log(`Getting transactions for native account`);
  let accountBalance = 0;
  let transactionSummaries: Array<SimpleTransaction> = [];
  try {
    accountBalance = await getAccountBalance(connection, keyPair.publicKey);
    transactionSummaries = await getTransactionSummariesForAddress(
      connection,
      keyPair.publicKey,
      keyPair.publicKey,
      HOW_MANY_TRANSACTIONS_TO_SHOW,
      keyPair.secretKey
    );
  } catch (error) {
    log(`No sol account balance for ${keyPair.publicKey}`);
  }
  const accountSummary: AccountSummary = {
    address: keyPair.publicKey,
    currency: getCurrencyByName("SOL").id,
    balance: accountBalance,
    decimals: SOLANA_DECIMALS,
    transactionSummaries,
  };
  return accountSummary;
};

export const getContactsFromTransactions = async (
  connection: Connection,
  keyPair: Keypair,
  nativeAccount: AccountSummary,
  tokenAccounts: Array<AccountSummary>
): Promise<Array<Contact>> => {
  const allAccounts = [...tokenAccounts];
  allAccounts.push(nativeAccount);

  const transactionWalletAddresses = allAccounts.map((account) => {
    return account.transactionSummaries.map((transaction) => {
      let transactionWalletAddress: string;
      if (transaction.direction === Direction.sent) {
        transactionWalletAddress = transaction.to;
      } else {
        transactionWalletAddress = transaction.from;
      }
      return transactionWalletAddress;
    });
  });

  const uniqueTransactionWalletAddresses: Array<string> = toUniqueStringArray(
    transactionWalletAddresses.flat()
  );
  log(
    `We need to verify ${uniqueTransactionWalletAddresses.length} uniqueTransactionWalletAddresses:`
  );

  const contacts = await asyncMap(
    uniqueTransactionWalletAddresses,
    async (walletAddress): Promise<Contact> => {
      const verifiedClaims = await verifyWallet(
        connection,
        keyPair,
        identityTokenIssuerPublicKey,
        new PublicKey(walletAddress)
      );
      const contact: Contact = {
        walletAddress,
        isNew: false,
        isPending: false,
        verifiedClaims,
      };
      return contact;
    }
  );

  log(`Got ${contacts.length} contacts used in transactions`);

  return contacts;
};
