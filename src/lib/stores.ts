import { get as getFromStore, writable, type Writable } from "svelte/store";
import { PublicKey, type Connection, type Keypair } from "@solana/web3.js";
import { identityTokenIssuerPublicKeyString } from "./constants";
import {
  Currency,
  Direction,
  type AccountSummary,
  type Collectable,
  type Contact,
} from "../lib/types";
import { asyncMap, log, sleep, stringify } from "../backend/functions";
import {
  getContactsFromTransactions,
  getKeypairFromString,
  getNativeAccountSummary,
  getTokenAccountSummaries,
} from "../backend/vmwallet";
import { MILLISECONDS, NOT_FOUND, SECONDS } from "../backend/constants";
import base58 from "bs58";
import { getAllNftMetadatasFromAWallet } from "../backend/identity-tokens";
import * as http from "./http-client";
import { summarizeTransaction } from "../backend/transactions";
import { runRepeatedlyWithTimeout } from "../backend/run-with-timeout";

let connection: Connection | null;
let keyPair: Keypair | null;

const SERVICE_WORKER = globalThis?.navigator?.serviceWorker || null;

// We do optimistic confirmsations on transactions. but we need to wait a few minutes for a
// proper confirmed transaction ID - in testing, 3 seconds was too little so let's use 5 seconds.
const TRANSACTION_CONFIRM_DELAY = 5 * SECONDS;

const IS_CHROME_EXTENSION =
  globalThis?.location?.protocol === "chrome-extension:";

// Right now let's only load our Chrome extension in the service worker
// We may change our mind on this
const HAS_SERVICE_WORKER = IS_CHROME_EXTENSION && Boolean(SERVICE_WORKER);

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

  const collectablesUnfiltered = await asyncMap(
    allNftsFromAWallet,
    async (nft) => {
      const data = await http.get(nft.uri);
      const firstFile = data?.properties?.files?.[0];
      const image = firstFile?.uri || null;
      const type = firstFile?.type || null;
      return {
        name: data.name,
        description: data.description,
        image,
        type,
      };
    }
  );

  // Filter out non-collectible NFTs
  const collectables = collectablesUnfiltered.filter((collectable) => {
    return Boolean(collectable.image);
  });

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

export const updateAccountTransactions = async (
  signature: string,
  nativeOrTokenAccountAddress: PublicKey
) => {
  // We wait a little while for the transaction to go through
  // as getParsedTransaction() can return null if we do it immediately
  // TODO: maybe check getParsedTransaction() options?
  setTimeout(async () => {
    log(`Running delayed function to add to transactions`);
    const rawTransaction = await connection.getParsedTransaction(signature, {});

    if (rawTransaction === null) {
      throw new Error(
        `rawTransaction for transaction signature ${signature} was null`
      );
    }
    const transactionSummary = await summarizeTransaction(
      rawTransaction,
      keyPair.publicKey,
      null,
      true,
      keyPair.secretKey
    );

    const isUsingSolAccount = nativeOrTokenAccountAddress === keyPair.publicKey;

    if (isUsingSolAccount) {
      log(`Adding transaction ${transactionSummary.id} to our Sol account`);
      const updatedNativeAccount = getFromStore(nativeAccountStore);
      updatedNativeAccount.transactionSummaries.push(transactionSummary);
      nativeAccountStore.set(updatedNativeAccount);
      return;
    }

    log(`Adding transaction ${transactionSummary.id} to our Token account`);
    const updatedTokenAccounts = getFromStore(tokenAccountsStore);
    const tokenAccountIndex = updatedTokenAccounts.findIndex((tokenAccount) => {
      return tokenAccount.address === nativeOrTokenAccountAddress;
    });

    if (tokenAccountIndex === NOT_FOUND) {
      throw new Error(
        `Couldn't find token account for transaction ${transactionSummary.id} for account address ${nativeOrTokenAccountAddress}`
      );
    }
    updatedTokenAccounts[tokenAccountIndex].transactionSummaries.push(
      transactionSummary
    );
    tokenAccountsStore.set(updatedTokenAccounts);
  }, TRANSACTION_CONFIRM_DELAY);

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

  // Get contacts now we have the accounts (and their transactions)
  log(`Getting contacts used in transactions`);
  let contacts = getFromStore(contactsStore);
  if (contacts?.length) {
    log(`No need to update Contact as it's previously been set`);
  } else {
    contacts = await getContactsFromTransactions(
      connection,
      keyPair,
      nativeAccountSummary,
      tokenAccountSummaries
    );
    contactsStore.set(contacts);
  }

  // TODO: add to the store wheher the service worker has been checked yet
  // then have App.js check that value

  // We could add hasUSDCAccount to Service Worker but it's [robbaly easier to just checl
  log(`Finding USDC account...`);
  const usdcAccountIndex = tokenAccountSummaries.findIndex(
    (accountSummary) => accountSummary.currency === Currency.USDC
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
      throw new Error(`Service worker registration failed`, error.message);
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
