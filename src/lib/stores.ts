import { get as getFromStore, writable, type Writable } from "svelte/store";
import { PublicKey, type Connection, type Keypair } from "@solana/web3.js";
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
  getKeypairFromString,
  getNativeAccountSummary,
  getTokenAccountSummaries,
} from "../backend/vmwallet";
import { NOT_FOUND } from "../backend/constants";
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
    keyPair
  );
  nativeAccountStore.set(nativeAccountSummary);

  log(`Updating token accounts...`);
  const tokenAccountSummaries: Array<AccountSummary> =
    await getTokenAccountSummaries(connection, keyPair);
  tokenAccountsStore.set(tokenAccountSummaries);

  haveAccountsLoadedStore.set(true);

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
    SERVICE_WORKER.controller.postMessage({
      // Post a message asking for secret key
      topic: "getSecretKey",
    });

    // messages from service worker
    SERVICE_WORKER.onmessage = function (event) {
      log(
        "🟦 Got a message from the service worker - we might have a cached secret key",
        event.data
      );
      if (event.data.topic === "replySecretKey") {
        const secretKey = event.data.secretKey;
        log(`secret key is `, secretKey);
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
    };
  } else {
    log(
      `Not contacting service worker as not loaded as an extension (or running in node)`
    );
  }
};

setupServiceWorker();
