import { writable, type Writable } from "svelte/store";
import { PublicKey, type Connection, type Keypair } from "@solana/web3.js";
import { identityTokenIssuerPublicKeyString } from "./constants";
import {
  JOE_MCCANNS_WALLET,
  KEVIN_ROSES_WALLET,
  SHAQS_WALLET,
  VAHEHS_WALLET,
} from "../backend/constants";
import type { Contact, TransactionSummary } from "../lib/types";

// Our connection to Solana
export const connectionStore: Writable<null | Connection> = writable(null);

// The active users's keypair
export const keyPairStore: Writable<null | Keypair> = writable(null);

export const transactionsStore: Writable<Array<TransactionSummary>> = writable([
  {
    date: 1662136510630,
    status: true,
    networkFee: 5000,
    direction: "recieved",
    amount: 40000,
    from: SHAQS_WALLET,
    // HACK - implement real check on this wallet
    to: "this wallet",
  },
  {
    date: 1662136510630,
    status: true,
    networkFee: 5000,
    direction: "sent",
    amount: 3000,
    from: "this wallet",
    // HACK - implement real check on this wallet
    to: JOE_MCCANNS_WALLET,
  },
]);

// Their contacts
export const contactsStore: Writable<Array<Contact>> = writable([
  {
    walletAddress: SHAQS_WALLET,
    isNew: false,
    isPending: false,
    verifiedClaims: {
      type: "INDIVIDUAL",
      givenName: "Shaquille",
      familyName: "O'Neal",
      imageUrl: "/ProfilePics/shaq.jpg",
    },
  },
  {
    walletAddress: JOE_MCCANNS_WALLET,
    isNew: false,
    isPending: false,
    verifiedClaims: {
      type: "INDIVIDUAL",
      givenName: "Joseph Isaac",
      familyName: "McCann",
      imageUrl: "/ProfilePics/joe.jpg",
    },
  },
  {
    walletAddress: KEVIN_ROSES_WALLET,
    isNew: false,
    isPending: false,
    verifiedClaims: null,
  },
]);

// From https://svelte.dev/repl/d7b5f0d565a441cfac66e093ee6fe62d?version=3.19.1
export const User = (function () {
  const { subscribe, set } = writable("init");
  return {
    subscribe,
    signout: () => {
      set(null);
    },
    signin: () => {
      set("Chris");
    },
  };
})();

// From https://svelte.dev/repl/cc54944f9c2f44209d6da7344ea4c101?version=3.17.2
export const authStore = writable({ isLoggedIn: false, name: "" });

export const identityTokenIssuerPublicKey = new PublicKey(
  identityTokenIssuerPublicKeyString
);
