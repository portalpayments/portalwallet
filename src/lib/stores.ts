// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import { get as getFromStore, writable, type Writable } from "svelte/store";
import type { PublicKey, Connection, Keypair } from "@solana/web3.js";
import type {
  AccountSummary,
  Collectable,
  Contact,
  JsonMetadata,
} from "../backend/types";
import { asyncMap, log, sleep, stringify } from "../backend/functions";
import uniqBy from "lodash.uniqby";
import {
  getContactsFromTransactions,
  getKeypairFromString,
  getNativeAccountSummary,
  getTokenAccountSummaries,
  getTransactionSummariesForAddress,
} from "../backend/wallet";
import { MILLISECONDS, NOT_FOUND, SECONDS } from "../backend/constants";
import { getCurrencyBySymbol } from "../backend/solana-functions";
import base58 from "bs58";
import {
  getAllNftMetadatasFromAWallet,
  getAttributesFromNFT,
  getCollectables,
} from "../backend/identity-tokens";
import * as http from "./http-client";
import { summarizeTransaction } from "../backend/transactions";
import { runRepeatedlyWithTimeout } from "../backend/run-with-timeout";
import { HOW_MANY_TRANSACTIONS_TO_GET_AT_ONCE } from "./frontend-constants";

let connection: Connection | null;
let keyPair: Keypair | null;

const SERVICE_WORKER = globalThis?.navigator?.serviceWorker || null;

const IS_CHROME_EXTENSION =
  globalThis?.location?.protocol === "chrome-extension:";

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

  log(
    `Before updating account ${activeAccountIndex}: ${activeAccount.transactionSummaries.length} transactions`
  );

  const joinedTransactions = activeAccount.transactionSummaries.concat(
    newTransactionSummaries
  );

  const uniqueTransactionSummaries = uniqBy(joinedTransactions, "id");

  activeAccount.transactionSummaries = uniqueTransactionSummaries;

  await updateContactsStoreForNewTransactions([activeAccount]);

  log(
    `After updating account ${activeAccountIndex}: ${activeAccount.transactionSummaries.length} transactions`
  );

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

  const allNftsFromAWallet = await getAllNftMetadatasFromAWallet(
    connection,
    keyPair,
    keyPair.publicKey
  );

  const collectables = await getCollectables(allNftsFromAWallet);

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

type ActiveAccountHandler = (accountSummary: AccountSummary) => any;

export const onChangeActiveAccount = (
  activeAccountHandler: ActiveAccountHandler
) => {
  activeAccountIndexStore.subscribe((newValue) => {
    if (newValue !== null) {
      const activeAccount = getActiveAccount();
      activeAccountHandler(activeAccount);
    }
  });
};

interface Auth {
  isLoggedIn: boolean;
  keyPair: null | Keypair;
}

// From https://svelte.dev/repl/cc54944f9c2f44209d6da7344ea4c101?version=3.17.2
export const authStore: Writable<Auth> = writable({
  isLoggedIn: false,
  keyPair: null,
});

export const updateAccountsForNewTransaction = async (
  signature: string,
  nativeOrTokenAccountAddress: PublicKey
) => {
  const rawTransaction = await connection.getParsedTransaction(
    signature,
    // Only wait for confirmed so we can show transaction in list immediately
    "confirmed"
  );

  if (rawTransaction === null) {
    throw new Error(
      `rawTransaction for transaction signature ${signature} was null`
    );
  }
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
  updatedTokenAccounts[tokenAccountIndex].transactionSummaries.push(
    simpleTransaction
  );
  tokenAccountsStore.set(updatedTokenAccounts);

  return;
};

export const haveAccountsLoadedStore: Writable<boolean> = writable(false);

export const hasUSDCAccountStore: Writable<boolean | null> = writable(null);

export const collectablesStore: Writable<Array<Collectable> | null> =
  writable(null);

const getNativeAccountSummaryOrCached = async () => {
  let nativeAccountSummary: AccountSummary;
  try {
    nativeAccountSummary = await runRepeatedlyWithTimeout(
      async () => {
        let nativeAccountSummaryFromStore = getFromStore(nativeAccountStore);
        if (nativeAccountSummaryFromStore) {
          return nativeAccountSummaryFromStore;
        } else {
          throw new Error(
            `Store not ready yet, background page may have not responded to our getNativeAccountSummary message yet`
          );
        }
      },
      500 * MILLISECONDS,
      3 * SECONDS
    );

    return nativeAccountSummary;
  } catch (error) {
    if (error.message.includes("Timeout")) {
      // Not already in the store, let's get it from the blockchain (and save it to the store)
      console.time("Getting Solana account");
      nativeAccountSummary = await getNativeAccountSummary(connection, keyPair);
      console.timeEnd("Getting Solana account");

      if (HAS_SERVICE_WORKER) {
        log(`Saving nativeAccountSummary to serviceworker`);
        SERVICE_WORKER.controller.postMessage({
          topic: "setNativeAccountSummary",
          nativeAccountSummary,
        });
      }
      return nativeAccountSummary;
    }
    log(
      `Got an error we didn't expect when getting native account: ${error.message}`
    );
    throw error;
  }
};

const getTokenAccountSummariesOrCached = async () => {
  let tokenAccountSummaries: Array<AccountSummary>;
  try {
    // checks, every 500ms, for a max of 3 seconds, if the background page has the account summaries.
    tokenAccountSummaries = await runRepeatedlyWithTimeout(
      async () => {
        const tokenAccountSummariesFromStore = getFromStore(tokenAccountsStore);

        if (tokenAccountSummariesFromStore) {
          return tokenAccountSummariesFromStore;
        } else {
          throw new Error(
            `Store not ready yet, background page may have not responded to our getTokenAccountSummaries message yet`
          );
        }
      },
      500 * MILLISECONDS,
      3 * SECONDS
    );
    return tokenAccountSummaries;
  } catch (error) {
    if (error.message.includes("Timeout")) {
      console.time("Getting token accounts");
      tokenAccountSummaries = await getTokenAccountSummaries(
        connection,
        keyPair
      );
      console.timeEnd("Getting token accounts");

      if (HAS_SERVICE_WORKER) {
        log(`Saving tokenAccountSummaries to serviceworker`);
        SERVICE_WORKER.controller.postMessage({
          topic: "setTokenAccountSummaries",
          tokenAccountSummaries,
        });
      }
      return tokenAccountSummaries;
    }
    log(
      `Got an error we didn't expect when getting token accounts: ${error.message}`
    );
    throw error;
  }
};

const updateContactsStoreForNewTransactions = async (
  accounts: Array<AccountSummary>
) => {
  log(`Getting contacts used in transactions`);
  let contacts = getFromStore(contactsStore) || [];

  const beforeCount = contacts.length;
  const newContacts = await getContactsFromTransactions(
    connection,
    keyPair,
    accounts
  );

  if (!newContacts.length) {
    log(`No new contacts for recently loaded transactions.`);
    return;
  }

  const joinedContacts = contacts.concat(newContacts);

  const uniqueContacts = uniqBy(joinedContacts, "walletAddress");

  const afterCount = uniqueContacts.length;

  log(
    `Got contacts used in transactions, added ${
      afterCount - beforeCount
    } new contacts`
  );

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
  console.time("Getting all accounts");
  const [nativeAccountSummary, tokenAccountSummaries] = await Promise.all([
    getNativeAccountSummaryOrCached(),
    getTokenAccountSummariesOrCached(),
  ]);
  console.timeEnd("Getting all accounts");
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
    (accountSummary) =>
      accountSummary.currency === getCurrencyBySymbol("USDC").mintAddress
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

authStore.subscribe((newValue) => {
  if (newValue.keyPair) {
    log(`🗝️ keyPair has changed, updating accounts`);
    keyPair = newValue.keyPair;
    if (HAS_SERVICE_WORKER) {
      log(`Setting secret key on service worker`);
      SERVICE_WORKER.controller.postMessage({
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
    log(`Registering service worker...`);
    let registration: ServiceWorkerRegistration | null = null;
    try {
      // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register
      registration = await SERVICE_WORKER.register("./service-worker.js");
    } catch (error) {
      throw error;
    }

    log("⚡Service worker registration succeeded:", registration);

    // Post messaging asking for all the things we'd like to get from the cache
    console.time("getSecretKey");
    SERVICE_WORKER.controller.postMessage({
      topic: "getSecretKey",
    });
    console.time("getNativeAccountSummary");
    SERVICE_WORKER.controller.postMessage({
      topic: "getNativeAccountSummary",
    });
    console.time("getTokenAccountSummaries");
    SERVICE_WORKER.controller.postMessage({
      topic: "getTokenAccountSummaries",
    });

    // messages from service worker
    SERVICE_WORKER.onmessage = function (event) {
      log(
        `📩 Got a message from the service worker on this topic ${event.data.topic}`
      );

      if (event.data.topic === "replySecretKey") {
        console.timeEnd("getSecretKey");
        const secretKey = event.data.secretKey;
        if (secretKey) {
          log(`we have a secret key! Setting it.`);
          authStore.set({
            isLoggedIn: true,
            keyPair: getKeypairFromString(secretKey),
          });
        } else {
          log(`We don't have a cached secret key`);
        }
      }

      if (event.data.topic === "replyNativeAccountSummary") {
        console.timeEnd("getNativeAccountSummary");

        const nativeAccountSummary = event.data
          .nativeAccountSummary as AccountSummary;
        log(
          `nativeAccountSummary reply from Service Worker with  ${nativeAccountSummary.transactionSummaries.length} transactions`
        );
        if (nativeAccountSummary) {
          log(
            `we have recieved a nativeAccountSummary from the service worker! Setting it.`
          );
          nativeAccountStore.set(nativeAccountSummary);
        } else {
          log(`We don't have a nativeAccountSummary from the service worker`);
        }
      }

      if (event.data.topic === "replyTokenAccountSummaries") {
        console.timeEnd("getTokenAccountSummaries");

        const tokenAccountSummaries = event.data
          .tokenAccountSummaries as Array<AccountSummary>;
        log(
          `tokenAccountSummaries reply from Service Worker with  ${tokenAccountSummaries.length} token accounts`
        );
        if (tokenAccountSummaries) {
          log(
            `we have recieved tokenAccountSummaries from the service worker! Setting it.`
          );
          tokenAccountsStore.set(tokenAccountSummaries);
        } else {
          log(`We don't have tokenAccountSummaries from the service worker`);
        }
      }
    };
  } else {
    log(
      `Not contacting service worker as not loaded as an extension (or running in node)`
    );
  }
};

setupServiceWorker();
