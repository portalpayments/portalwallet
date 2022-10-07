import { get as getFromStore, writable, type Writable } from "svelte/store";
import { PublicKey, type Connection, type Keypair } from "@solana/web3.js";
import { Keypair as KeypairConstructor } from "@solana/web3.js";
import { identityTokenIssuerPublicKeyString } from "./constants";
import { Direction, type Contact, type TransactionSummary } from "../lib/types";
import { asyncMap, log, stringify } from "../backend/functions";
import { verifyWallet } from "../backend/vmwallet";
import { toUniqueStringArray } from "./utils";
import { getSettings } from "./settings";

let connection: Connection | null;
let keyPair: Keypair | null;

// Our connection to Solana
export const connectionStore: Writable<null | Connection> = writable(null);
connectionStore.subscribe((newValue) => {
  connection = newValue;
});

export const transactionsStore: Writable<null | Array<TransactionSummary>> =
  writable(null);

export const identityTokenIssuerPublicKey = new PublicKey(
  identityTokenIssuerPublicKeyString
);

interface Auth {
  isLoggedIn: boolean;
  secretKey: null | Uint8Array;
}

// From https://svelte.dev/repl/cc54944f9c2f44209d6da7344ea4c101?version=3.17.2
export const authStore: Writable<Auth> = writable({
  isLoggedIn: false,
  secretKey: null,
});

// Storing the state of the wallet balance account
export const walletBalanceAccount = writable({
  isShowingBalanceInSol: false,
});

transactionsStore.subscribe(async (transactionSummaries) => {
  if (!transactionSummaries) {
    if (connection) {
      throw new Error(
        `We have transactions but no connection. This shouldn't happen!`
      );
    }
    log(`No transactions yet...`);
    return;
  }

  if (!transactionSummaries.length) {
    return;
  }

  log(`${transactionSummaries.length} transactionSummaries.`);

  const transactionWalletAddresses = transactionSummaries.map((transaction) => {
    let transactionWalletAddress: string;
    if (transaction.direction === Direction.sent) {
      transactionWalletAddress = transaction.to;
    } else {
      transactionWalletAddress = transaction.from;
    }
    return transactionWalletAddress;
  });

  const uniqueTransactionWalletAddresses: Array<string> = toUniqueStringArray(
    transactionWalletAddresses
  );

  log(
    `We need to verify these uniqueTransactionWalletAddresses:`,
    uniqueTransactionWalletAddresses
  );

  // TODO - Fix 'as' - asyncMap may need some work.
  const secretKey = getFromStore(authStore).secretKey;
  if (!secretKey) {
    throw new Error(`Couldn't get the secret key from the auth store!`);
  }

  keyPair = KeypairConstructor.fromSecretKey(secretKey);

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

  log(`Got contacts for transaction contacts`, stringify(contacts));

  contactsStore.set(contacts);
});

// Their contacts
export const contactsStore: Writable<Array<Contact>> = writable([]);
