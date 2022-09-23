import { writable, type Writable } from "svelte/store";
import { PublicKey, type Connection, type Keypair } from "@solana/web3.js";
import { identityTokenIssuerPublicKeyString } from "./constants";
import {
  JOE_MCCANNS_WALLET,
  KEVIN_ROSES_WALLET,
  SHAQS_WALLET,
  VAHEHS_WALLET,
} from "../backend/constants";
import { Direction, type Contact, type TransactionSummary } from "../lib/types";
import { asyncMap, log, stringify } from "../backend/functions";
import { verifyWallet } from "../backend/vmwallet";
import { toUniqueStringArray } from "./utils";

let connection: Connection | null;
let keyPair: Keypair | null;

// Our connection to Solana
export const connectionStore: Writable<null | Connection> = writable(null);
connectionStore.subscribe((newValue) => {
  connection = newValue;
});

// The active users's keypair
export const keyPairStore: Writable<null | Keypair> = writable(null);
keyPairStore.subscribe((newValue) => {
  keyPair = newValue;
});

export const transactionsStore: Writable<null | Array<TransactionSummary>> =
  writable(null);

export const identityTokenIssuerPublicKey = new PublicKey(
  identityTokenIssuerPublicKeyString
);

transactionsStore.subscribe(async (transactions) => {
  if (!transactions) {
    if (connection) {
      throw new Error(
        `We have transactions but no connection. This shouldn't happen!`
      );
    }
    log(`No transactions yet...`);
    return;
  }

  if (!transactions.length) {
    return;
  }

  const transactionWalletAddresses = transactions.map((transaction) => {
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

// From https://svelte.dev/repl/d7b5f0d565a441cfac66e093ee6fe62d?version=3.19.1
export const User = (function () {
  const { subscribe, set } = writable("init");
  return {
    subscribe,
    signout: () => {
      set(null);
    },
    signin: () => {
      // TODO: delete
      set("Chris");
    },
  };
})();

// From https://svelte.dev/repl/cc54944f9c2f44209d6da7344ea4c101?version=3.17.2
export const authStore = writable({ isLoggedIn: false, name: "" });
