import { get as getFromStore, writable, type Writable } from "svelte/store";
import { PublicKey, type Connection, type Keypair } from "@solana/web3.js";
import { Keypair as KeypairConstructor } from "@solana/web3.js";
import { identityTokenIssuerPublicKeyString } from "./constants";
import {
  Currency,
  Direction,
  type AccountSummary,
  type Contact,
} from "../lib/types";
import { asyncMap, log, stringify } from "../backend/functions";
import {
  getContactsFromTransactions,
  getNativeAccountSummary,
  getTokenAccountSummaries,
  verifyWallet,
} from "../backend/vmwallet";
import { toUniqueStringArray } from "./utils";
import { NOT_FOUND } from "../backend/constants";

let connection: Connection | null;
let keyPair: Keypair | null;

// Our connection to Solana
export const connectionStore: Writable<null | Connection> = writable(null);
connectionStore.subscribe((newValue) => {
  connection = newValue;
});

export const contactsStore: Writable<Array<Contact>> = writable([]);

// number for a numbered token account, "native" for Solana
export const activeAccountIndexStore: Writable<number | "native" | null> =
  writable(null);

export const nativeAccountStore: Writable<null | AccountSummary> =
  writable(null);

export const tokenAccountsStore: Writable<null | Array<AccountSummary>> =
  writable(null);

export const getActiveAccount = () => {
  const activeAccountIndex = getFromStore(activeAccountIndexStore);
  if (typeof activeAccountIndex === "number") {
    const tokenAccounts = getFromStore(tokenAccountsStore);
    return tokenAccounts.at(activeAccountIndex);
  }
  if (activeAccountIndex === "native") {
    const nativeAccount = getFromStore(nativeAccountStore);
    return nativeAccount;
  }
  return null;
};

export const identityTokenIssuerPublicKey = new PublicKey(
  identityTokenIssuerPublicKeyString
);

interface Auth {
  isLoggedIn: boolean;
  keyPair: null | Keypair;
}

// From https://svelte.dev/repl/cc54944f9c2f44209d6da7344ea4c101?version=3.17.2
export const authStore: Writable<Auth> = writable({
  isLoggedIn: false,
  keyPair: null,
});

export const haveAccountsLoadedStore: Writable<boolean> = writable(false);

export const hasUSDCAccountStore: Writable<boolean | null> = writable(null);

const updateAccounts = async () => {
  if (!connection) {
    return;
  }
  if (!keyPair) {
    return;
  }

  log(`Updating accounts...`);

  log(`Updating Solana account....`);
  const nativeAccountSummary: AccountSummary = await getNativeAccountSummary(
    connection,
    keyPair.publicKey
  );
  nativeAccountStore.set(nativeAccountSummary);

  log(`Updating token accounts...`);
  const tokenAccountSummaries: Array<AccountSummary> =
    await getTokenAccountSummaries(connection, keyPair.publicKey);
  tokenAccountsStore.set(tokenAccountSummaries);
  haveAccountsLoadedStore.set(true);

  log(`Finding USDC account...`);
  const usdcAccountIndex = tokenAccountSummaries.findIndex(
    (accountSummary) => accountSummary.currency === Currency.USDC
  );
  if (usdcAccountIndex === NOT_FOUND) {
    log(`No existing USDC account in this wallet`);
    hasUSDCAccountStore.set(false);
    return;
  }
  log(`Found USDC account`);
  hasUSDCAccountStore.set(true);
  activeAccountIndexStore.set(usdcAccountIndex);

  log(`Getting contacts for all transactions`);
  const contacts = await getContactsFromTransactions(
    connection,
    keyPair,
    nativeAccountSummary,
    tokenAccountSummaries
  );
  contactsStore.set(contacts);
};

connectionStore.subscribe((newValue) => {
  if (newValue) {
    log(`🔌 connection has changed, updating accounts`);
    connection = newValue;
    updateAccounts();
  }
});

authStore.subscribe((newValue) => {
  if (newValue.keyPair) {
    log(`🗝️ keyPair has changed, updating accounts`);
    keyPair = newValue.keyPair;
    updateAccounts();
  }
});
