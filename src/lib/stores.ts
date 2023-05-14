// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import { get as getFromStore, writable, type Writable } from "svelte/store";
import type { PublicKey, Keypair, Connection } from "@solana/web3.js";
import type { AccountSummary, Auth, Collectable, Contact, PendingUserApproval } from "../backend/types";
import { asyncMap, isFresh, log, sleep, stringify } from "../backend/functions";
import uniqBy from "lodash.uniqby";
import {
  getContactsFromTransactions,
  getNativeAccountSummary,
  getParsedTransactionAndCache,
  getTokenAccountSummaries,
  getTransactionSummariesForAddress,
} from "../backend/wallet";
import { MILLISECONDS, MINUTES, NOT_FOUND, SECONDS } from "../backend/constants";
import { getKeypairFromString, getCurrencyBySymbol } from "../backend/solana-functions";
import base58 from "bs58";
import { summarizeTransaction } from "../backend/transactions";
import { HOW_MANY_TRANSACTIONS_TO_GET_AT_ONCE } from "./frontend-constants";
import { getCollectables } from "../backend/collectables";

import localforage from "localforage";

let connection: Connection | null;
let keyPair: Keypair | null;

const SERVICE_WORKER = globalThis?.navigator?.serviceWorker || null;

const IS_CHROME_EXTENSION = globalThis?.location?.protocol === "chrome-extension:";

// Right now let's only load our Chrome extension in the service worker
// We may change our mind on this
const HAS_SERVICE_WORKER = IS_CHROME_EXTENSION && Boolean(SERVICE_WORKER);

export const updateActiveAccount = async () => {
  if (!connection) {
    return;
  }
  if (!keyPair) {
    return;
  }
  let activeAccount: AccountSummary;
  const activeAccountIndex = getFromStore(activeAccountIndexStore);
  let tokenAccounts: Array<AccountSummary> | null = null;
  let nativeAccount: AccountSummary | null = null;

  if (typeof activeAccountIndex === "number") {
    tokenAccounts = getFromStore(tokenAccountsStore);
    activeAccount = tokenAccounts.at(activeAccountIndex);
  }
  if (activeAccountIndex === "native") {
    nativeAccount = getFromStore(nativeAccountStore);
    activeAccount = nativeAccount;
  }

  const oldestTransactionID = activeAccount.transactionSummaries.at(-1).id;
  const newTransactionSummaries = await getTransactionSummariesForAddress(
    connection,
    keyPair.publicKey,
    activeAccount.address,
    HOW_MANY_TRANSACTIONS_TO_GET_AT_ONCE,
    keyPair.secretKey,
    oldestTransactionID
  );

  log(`Before updating account ${activeAccountIndex}: ${activeAccount.transactionSummaries.length} transactions`);

  const joinedTransactions = activeAccount.transactionSummaries.concat(newTransactionSummaries);

  const uniqueTransactionSummaries = uniqBy(joinedTransactions, "id");

  activeAccount.transactionSummaries = uniqueTransactionSummaries;

  await updateContactsStoreForNewTransactions([activeAccount]);

  log(`After updating account ${activeAccountIndex}: ${activeAccount.transactionSummaries.length} transactions`);

  if (typeof activeAccountIndex === "number") {
    tokenAccounts[activeAccountIndex] = activeAccount;
    tokenAccountsStore.set(tokenAccounts);
  }
  if (activeAccountIndex === "native") {
    nativeAccountStore.set(activeAccount);
  }
};

const updateCollectables = async () => {
  if (!connection) {
    return;
  }
  if (!keyPair) {
    return;
  }

  const collectables = await getCollectables(connection, keyPair.publicKey);

  collectablesStore.set(collectables);
};

// Our connection to Solana
export const connectionStore: Writable<null | Connection> = writable(null);
connectionStore.subscribe((newValue) => {
  connection = newValue;
  updateCollectables();
});

export const contactsStore: Writable<null | Array<Contact>> = writable(null);

// number for a numbered token account, "native" for Solana
export const activeAccountIndexStore: Writable<number | "native" | null> = writable(null);

export const nativeAccountStore: Writable<null | AccountSummary> = writable(null);

export const tokenAccountsStore: Writable<null | Array<AccountSummary>> = writable(null);

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

type ActiveAccountHandler = (accountSummary: AccountSummary) => any;

export const onChangeActiveAccount = (activeAccountHandler: ActiveAccountHandler) => {
  activeAccountIndexStore.subscribe((newValue) => {
    if (newValue !== null) {
      const activeAccount = getActiveAccount();
      activeAccountHandler(activeAccount);
    }
  });
};

export const authStore: Writable<Auth> = writable({
  keyPair: null,
});

export const updateAccountsForNewTransaction = async (signature: string, nativeOrTokenAccountAddress: PublicKey) => {
  let rawTransaction = await getParsedTransactionAndCache(connection, signature);
  const simpleTransaction = await summarizeTransaction(
    rawTransaction,
    keyPair.publicKey,
    null,
    true,
    keyPair.secretKey
  );

  const isUsingSolAccount = nativeOrTokenAccountAddress === keyPair.publicKey;

  if (isUsingSolAccount) {
    log(`Adding transaction ${simpleTransaction.id} to our Sol account`);
    const updatedNativeAccount = getFromStore(nativeAccountStore);
    updatedNativeAccount.transactionSummaries.push(simpleTransaction);
    nativeAccountStore.set(updatedNativeAccount);
    return;
  }

  log(`Adding transaction ${simpleTransaction.id} to our Token account`);
  const updatedTokenAccounts = getFromStore(tokenAccountsStore);
  const tokenAccountIndex = updatedTokenAccounts.findIndex((tokenAccount) => {
    return tokenAccount.address === nativeOrTokenAccountAddress;
  });

  if (tokenAccountIndex === NOT_FOUND) {
    throw new Error(
      `Couldn't find token account for transaction ${simpleTransaction.id} for account address ${nativeOrTokenAccountAddress}`
    );
  }
  updatedTokenAccounts[tokenAccountIndex].transactionSummaries.push(simpleTransaction);
  tokenAccountsStore.set(updatedTokenAccounts);

  return;
};

export const haveAccountsLoadedStore: Writable<boolean> = writable(false);

// We use a store for pendingUserApprovals, but also persist to localforage
export const pendingUserApprovalStore: Writable<PendingUserApproval | null> = writable(null);

// Set the initial value of pendingUserApprovalStore from localstorage
const setupPendingUserApprovalStore = async () => {
  const pendingUserApprovalOrNull = await localforage.getItem("PENDING_USER_APPROVAL");

  if (!pendingUserApprovalOrNull) {
    log(`⏹️ We don't have any PendingUserApprovals in storage`);
    return;
  }
  const pendingUserApproval = pendingUserApprovalOrNull as PendingUserApproval;
  if (!pendingUserApproval.time) {
    throw new Error(`No date on stored pendingUserApproval, we can't know if it's fresh or not`);
  }
  if (isFresh(pendingUserApproval.time, 30 * SECONDS)) {
    log(`⏹️ We have a fresh pendingUserApproval in localforage, saving it`);
    pendingUserApprovalStore.set(pendingUserApproval);
    log(`⏹️ Saved fresh pendingUserApproval to store`);
  } else {
    log(`⏹️ We have a pendingUserApproval in localforage but it is stale`);
  }
};
setupPendingUserApprovalStore();

// Update the localstorage whenever this store gets a value
// Note: hopefully this won't cause an infonite loop as an item from localforage makes the subscription update
// which causes localforage to save
pendingUserApprovalStore.subscribe(async (newValue) => {
  if (newValue) {
    newValue.time = Date.now();
    await localforage.setItem("PENDING_USER_APPROVAL", newValue);
  }
});

export const hasUSDCAccountStore: Writable<boolean | null> = writable(null);

export const collectablesStore: Writable<Array<Collectable> | null> = writable([]);

const getNativeAccountSummaryOrCached = async (): Promise<AccountSummary> => {
  let nativeAccountSummaryFromStore = getFromStore(nativeAccountStore);
  if (nativeAccountSummaryFromStore) {
    return nativeAccountSummaryFromStore;
  }

  // Not already in the store, let's get it from the blockchain (and save it to the store)
  const date = new Date().valueOf();
  console.time(`Getting Solana account ${date}`);
  let nativeAccountSummary = await getNativeAccountSummary(connection, keyPair);
  console.timeEnd(`Getting Solana account ${date}`);

  if (HAS_SERVICE_WORKER) {
    log(`Saving nativeAccountSummary to serviceworker`);
    // No 'await' as we don't expect a reply.
    // Adding one will pause forever!
    chrome.runtime.sendMessage({
      topic: "setNativeAccountSummary",
      nativeAccountSummary,
    });
  }
  return nativeAccountSummary;
};

const getTokenAccountSummariesOrCached = async (): Promise<Array<AccountSummary>> => {
  const tokenAccountSummariesFromStore = getFromStore(tokenAccountsStore);

  if (tokenAccountSummariesFromStore) {
    return tokenAccountSummariesFromStore;
  }
  const date = new Date().valueOf();
  console.time(`Getting native accounts ${date}`);
  let tokenAccountSummaries = await getTokenAccountSummaries(connection, keyPair);
  console.timeEnd(`Getting native accounts ${date}`);

  if (HAS_SERVICE_WORKER) {
    log(`Saving tokenAccountSummaries to serviceworker`);
    // No 'await' as we don't expect a reply.
    // Adding one will pause forever!
    chrome.runtime.sendMessage({
      topic: "setTokenAccountSummaries",
      tokenAccountSummaries,
    });
  }
  return tokenAccountSummaries;
};

const updateContactsStoreForNewTransactions = async (accounts: Array<AccountSummary>) => {
  log(`Getting contacts used in transactions`);
  let contacts = getFromStore(contactsStore) || [];

  const beforeCount = contacts.length;
  const newContacts = await getContactsFromTransactions(connection, keyPair, accounts);

  if (!newContacts.length) {
    log(`No new contacts for recently loaded transactions.`);
    return;
  }

  const joinedContacts = contacts.concat(newContacts);

  const uniqueContacts = uniqBy(joinedContacts, "walletAddress");

  const afterCount = uniqueContacts.length;

  log(`Got contacts used in transactions, added ${afterCount - beforeCount} new contacts`);

  contactsStore.set(uniqueContacts);
};

const updateAccounts = async () => {
  if (!connection) {
    return;
  }
  if (!keyPair) {
    return;
  }

  // Get both Solana account and token accounts at same time
  const date = new Date().valueOf();
  console.time(`Getting all accounts ${date}`);
  const [nativeAccountSummary, tokenAccountSummaries] = await Promise.all([
    getNativeAccountSummaryOrCached(),
    getTokenAccountSummariesOrCached(),
  ]);
  console.timeEnd(`Getting all accounts ${date}`);
  nativeAccountStore.set(nativeAccountSummary);
  tokenAccountsStore.set(tokenAccountSummaries);
  haveAccountsLoadedStore.set(true);

  const allAccounts = [...tokenAccountSummaries];
  allAccounts.push(nativeAccountSummary);
  await updateContactsStoreForNewTransactions(allAccounts);

  // TODO: add to the store whether the service worker has been checked yet
  // then have App.js check that value

  // We could add hasUSDCAccount to Service Worker but it's probably easier to just check
  log(`Finding USDC account...`);
  const usdcAccountIndex = tokenAccountSummaries.findIndex(
    (accountSummary) => accountSummary.currency === getCurrencyBySymbol("USDC").mintAddress
  );
  if (usdcAccountIndex === NOT_FOUND) {
    log(`No existing USDC account in this wallet`);
    hasUSDCAccountStore.set(false);
    // TODO: we could add a fake USDC account here so it shows a zero balance.
    return;
  }
  log(`Found USDC account`);
  hasUSDCAccountStore.set(true);
  activeAccountIndexStore.set(usdcAccountIndex);
};

connectionStore.subscribe((newValue) => {
  if (newValue) {
    log(`🔌 connection has changed, updating accounts`);
    connection = newValue;
    updateAccounts();
  }
});

authStore.subscribe(async (newValue) => {
  if (newValue.keyPair) {
    log(`🗝️ keyPair has changed, updating accounts`);
    keyPair = newValue.keyPair;
    if (HAS_SERVICE_WORKER) {
      log(`Setting secret key on service worker`);
      await chrome.runtime.sendMessage({
        // Post a message telling the serviceWorker about the secretKey
        topic: "setSecretKey",
        secretKey: base58.encode(newValue.keyPair.secretKey),
      });
    }

    updateAccounts();
    updateCollectables();
  }
});

// After wallet is launched for first time
// - This script asks Service Worker for cache, gets any responses
// and *THEN* loads the accounts.

const setupServiceWorker = async () => {
  if (HAS_SERVICE_WORKER) {
    // Register ('install') a service worker hosted at the root of the
    // site using the default scope.
    const SERVICE_WORKER_URL = "./service-worker.js";

    // Service worker may already be registered when the extension is installed
    let registration = (await SERVICE_WORKER.getRegistration(SERVICE_WORKER_URL)) || null;

    if (registration) {
      log(`⚙️ Service worker is already registered.`);
    } else {
      try {
        log(`⚙️ Registering service worker...`);
        // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register
        registration = await SERVICE_WORKER.register(SERVICE_WORKER_URL);
        log("⚙️ Service worker registration succeeded:", registration);
      } catch (error) {
        throw error;
      }
    }

    // Post messaging asking for all the things we'd like to get from the cache

    // Get the secret key
    console.time("getSecretKey");
    const secretKeyReply = await chrome.runtime.sendMessage({
      topic: "getSecretKey",
    });
    if (secretKeyReply.topic === "replySecretKey") {
      const secretKey = secretKeyReply.secretKey;
      if (secretKey) {
        log(`we have a secret key! Setting it.`);
        authStore.set({
          keyPair: getKeypairFromString(secretKey),
        });
      } else {
        log(`We don't have a cached secret key`);
      }
    }
    console.timeEnd("getSecretKey");

    // Get the native account summary
    console.time("getNativeAccountSummary");
    const nativeAccountReply = await chrome.runtime.sendMessage({
      topic: "getNativeAccountSummary",
    });

    if (nativeAccountReply.topic === "replyNativeAccountSummary") {
      const nativeAccountSummary = nativeAccountReply.nativeAccountSummary as AccountSummary;
      log(
        `nativeAccountSummary reply from Service Worker with  ${nativeAccountSummary.transactionSummaries.length} transactions`
      );
      if (nativeAccountSummary) {
        log(`we have recieved a nativeAccountSummary from the service worker! Setting it.`);
        nativeAccountStore.set(nativeAccountSummary);
      } else {
        log(`We don't have a nativeAccountSummary from the service worker`);
      }
    }
    console.timeEnd("getNativeAccountSummary");

    // Get the token account summaries
    console.time("getTokenAccountSummaries");
    const tokenAccountSummariesReply = await chrome.runtime.sendMessage({
      topic: "getTokenAccountSummaries",
    });
    if (tokenAccountSummariesReply.topic === "replyTokenAccountSummaries") {
      const tokenAccountSummaries = tokenAccountSummariesReply.tokenAccountSummaries as Array<AccountSummary>;
      log(`tokenAccountSummaries reply from Service Worker with  ${tokenAccountSummaries.length} token accounts`);
      if (tokenAccountSummaries) {
        log(`we have recieved tokenAccountSummaries from the service worker! Setting it.`);
        tokenAccountsStore.set(tokenAccountSummaries);
      } else {
        log(`We don't have tokenAccountSummaries from the service worker`);
      }
    }
    console.timeEnd("getTokenAccountSummaries");
  } else {
    log(`Not contacting service worker as not loaded as an extension (or running in node)`);
  }
};

setupServiceWorker();
