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
} from "./constants";
import { asyncMap } from "./functions";
import base58 from "bs58";
import { AccountLayout, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import type { RawAccount } from "@solana/spl-token";
import { getIdentityTokensFromWallet } from "./identity-tokens";
import type { TokenMetaData, VerifiedClaims } from "./types";
import { summarizeTransaction } from "./transactions";
import { httpGet, toUniqueStringArray } from "../lib/utils";
import { HOW_MANY_TRANSACTIONS_TO_SHOW } from "./constants";
import { Currency, Direction, type Contact } from "../lib/types";
import type { AccountSummary } from "../lib/types";
import { identityTokenIssuerPublicKey } from "../lib/stores";

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

  let transactionSummaries = rawTransactions.map((rawTransaction) => {
    return summarizeTransaction(rawTransaction, walletAddress);
  });

  // We can't summarize all transactions yet
  transactionSummaries = transactionSummaries.filter(
    (transactionSummary) => transactionSummary !== null
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
  walletAddress: PublicKey
): Promise<Array<AccountSummary>> => {
  const tokenAccounts = await getTokenAccountsByOwner(
    connection,
    walletAddress
  );
  // TODO: fix asyncmap
  // @ts-ignore
  const accountSummariesOrNulls: Array<AccountSummary | null> = await asyncMap(
    tokenAccounts,
    async (tokenAccount) => {
      const currencyInfo = mintToCurrencyMap[tokenAccount.mint.toBase58()];

      if (!currencyInfo) {
        log(`Unknown currency for mint ${tokenAccount.mint}`);
        return null;
      }

      const currencyName = currencyInfo.name;
      log(`Getting transactions for ${currencyName} account`);
      const transactionSummaries = await getTransactionSummariesForAddress(
        connection,
        walletAddress,
        tokenAccount.address,
        HOW_MANY_TRANSACTIONS_TO_SHOW
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
  walletAddress: PublicKey
): Promise<AccountSummary> => {
  log(`Getting transactions for native account`);
  const accountBalance = await getAccountBalance(connection, walletAddress);
  const transactionSummaries = await getTransactionSummariesForAddress(
    connection,
    walletAddress,
    walletAddress,
    HOW_MANY_TRANSACTIONS_TO_SHOW
  );
  const accountSummary: AccountSummary = {
    address: walletAddress,
    currency: Currency.SOL,
    balance: accountBalance,
    decimals: SOLANA_DECIMALS,
    transactionSummaries,
  };
  return accountSummary;
};

export const getCurrencyName = (currencyNumber: number) => {
  return Currency[currencyNumber] || null;
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

  // TODO - Fix 'as' - asyncMap may need some work.
  const contacts = (await asyncMap(
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
  )) as Array<Contact>;

  log(`Got ${contacts.length} contacts used in transactions`);

  return contacts;
};
