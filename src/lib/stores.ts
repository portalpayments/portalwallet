import { get as getFromStore, writable, type Writable } from "svelte/store";
import { PublicKey, type Connection, type Keypair } from "@solana/web3.js";
import { identityTokenIssuerPublicKeyString } from "./constants";
import {
  Currency,
  Direction,
  type AccountSummary,
  type Contact,
} from "../lib/types";
import { asyncMap, log, sleep, stringify } from "../backend/functions";
import {
  getContactsFromTransactions,
  getKeypairFromString,
  getNativeAccountSummary,
  getTokenAccountSummaries,
} from "../backend/vmwallet";
import { NOT_FOUND, SECONDS } from "../backend/constants";
import base58 from "bs58";

let connection: Connection | null;
let keyPair: Keypair | null;

const SERVICE_WORKER = globalThis?.navigator?.serviceWorker || null;
const HAS_SERVICE_WORKER = Boolean(SERVICE_WORKER);

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

export const haveAccountsLoadedStore: Writable<boolean> = writable(false);

export const hasUSDCAccountStore: Writable<boolean | null> = writable(null);

const updateAccounts = async (useCache = true) => {
  if (!connection) {
    return;
  }
  if (!keyPair) {
    return;
  }

  log(`Updating accounts...`);

  log(`Updating Solana account....`);
  if (getFromStore(nativeAccountStore) && useCache) {
    log(`No need to update Solana account, it's not null`);
  } else {
    const nativeAccountSummary: AccountSummary = await getNativeAccountSummary(
      connection,
      keyPair
    );
    nativeAccountStore.set(nativeAccountSummary);
    if (HAS_SERVICE_WORKER) {
      log(`Saving nativeAccountSummary to serviceworker`);
      SERVICE_WORKER.controller.postMessage({
        topic: "setNativeAccountSummary",
        nativeAccountSummary,
      });
    }
  }

  log(`Updating token accounts...`);
  if (getFromStore(tokenAccountsStore) && useCache) {
    log(`No need to update Token accounts its previously been set`);
  } else {
    const tokenAccountSummaries: Array<AccountSummary> =
      await getTokenAccountSummaries(connection, keyPair);
    tokenAccountsStore.set(tokenAccountSummaries);
    haveAccountsLoadedStore.set(true);
    if (HAS_SERVICE_WORKER) {
      log(`Saving tokenAccountSummaries to serviceworker`);
      SERVICE_WORKER.controller.postMessage({
        topic: "setTokenAccountSummaries",
        tokenAccountSummaries,
      });
    }
  }

  // TODO: add hasUSDCAccount and contacts to Service Worker
  log(`Finding USDC account...`);
  const tokenAccountSummaries = getFromStore(tokenAccountsStore);
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

  log(`Getting contacts for all transactions`);
  const nativeAccountSummary = getFromStore(nativeAccountStore);
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
    if (HAS_SERVICE_WORKER) {
      log(`Setting secret key on service worker`);
      SERVICE_WORKER.controller.postMessage({
        // Post a message telling the serviceWorker about the secretKey
        topic: "setSecretKey",
        secretKey: base58.encode(newValue.keyPair.secretKey),
      });
    }

    updateAccounts();
  }
});

const setupServiceWorker = async () => {
  if (HAS_SERVICE_WORKER) {
    // Register a service worker hosted at the root of the
    // site using the default scope.
    log(`Registering service worker...`);
    let registration: ServiceWorkerRegistration | null = null;
    try {
      registration = await SERVICE_WORKER.register("./service-worker.js");
    } catch (error) {
      throw new Error(`Service worker registration failed`, error.message);
    }

    log("Service worker registration succeeded:", registration);

    // Post messaging asking for all the things we'd like to get from the cache
    SERVICE_WORKER.controller.postMessage({
      topic: "getSecretKey",
    });
    SERVICE_WORKER.controller.postMessage({
      topic: "getNativeAccountSummary",
    });
    SERVICE_WORKER.controller.postMessage({
      topic: "getTokenAccountSummaries",
    });

    // messages from service worker
    SERVICE_WORKER.onmessage = function (event) {
      log(
        `📩 Got a message from the service worker on this topic ${event.data.topic}`
      );
      if (event.data.topic === "replySecretKey") {
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
