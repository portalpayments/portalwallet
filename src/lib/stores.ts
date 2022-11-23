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

export const activeAccountIndexOrNativeStore: Writable<
  null | number | "native"
> = writable(null);

export const nativeAccountStore: Writable<null | AccountSummary> =
  writable(null);

export const tokenAccountsStore: Writable<null | Array<AccountSummary>> =
  writable(null);

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

const updateAccounts = async () => {
  if (!connection) {
    return;
  }
  if (!keyPair) {
    return;
  }

  log(`Updating Solana account....`);
  const nativeAccountSummaries: AccountSummary = await getNativeAccountSummary(
    connection,
    keyPair.publicKey
  );
  nativeAccountStore.set(nativeAccountSummaries);

  log(`Updating token accounts...`);
  const tokenAccountSummaries: Array<AccountSummary> =
    await getTokenAccountSummaries(connection, keyPair.publicKey);
  tokenAccountsStore.set(tokenAccountSummaries);

  log(`Finding USDC account...`);
  const usdcAccountIndex = tokenAccountSummaries.findIndex(
    (accountSummary) => accountSummary.currency === Currency.USDC
  );

  if (usdcAccountIndex === NOT_FOUND) {
    log(`No existing USDC account in this wallet`);
    return;
  }

  log(`Setting USDC account index as active account`);
  activeAccountIndexOrNativeStore.set(usdcAccountIndex);
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

tokenAccountsStore.subscribe(async (accounts) => {
  if (!accounts?.length) {
    return;
  }

  const transactionWalletAddresses = accounts.map((account) => {
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

  const secretKey = getFromStore(authStore).keyPair.secretKey;
  if (!secretKey) {
    throw new Error(`Couldn't get the secret key from the auth store!`);
  }

  keyPair = KeypairConstructor.fromSecretKey(secretKey);

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

  contactsStore.set(contacts);
});

export const contactsStore: Writable<Array<Contact>> = writable([]);
