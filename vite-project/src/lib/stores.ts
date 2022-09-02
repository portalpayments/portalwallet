import { writable, type Writable } from "svelte/store";
import { PublicKey, type Connection, type Keypair } from "@solana/web3.js";
import { identityTokenIssuerPublicKeyString } from "./constants";
import {
  JOE_MCCANNS_WALLET,
  SHAQS_WALLET,
  VAHEHS_WALLET,
} from "../../../src/constants";
import type { Contact, Transaction } from "../lib/types";

// Our connection to Solana
export const connectionStore: Writable<null | Connection> = writable(null);

// The active users's keypair
export const keyPairStore: Writable<null | Keypair> = writable(null);

export const transactionsStore: Writable<Array<Transaction>> = writable([
  {
    walletAddress: VAHEHS_WALLET,
    date: 1662136510630,
    amount: 40000,
    isReceived: true,
  },
  {
    walletAddress: SHAQS_WALLET,
    date: 1662136510630,
    amount: 350,
    isReceived: false,
  },
  {
    walletAddress: JOE_MCCANNS_WALLET,
    date: 1662136510630,
    amount: 3000,
    isReceived: false,
  },
]);

// Their contacts
export const contactsStore: Writable<Array<Contact>> = writable([
  {
    walletAddress: VAHEHS_WALLET,
    isNew: false,
    isPending: false,
    verifiedClaims: {
      type: "INDIVIDUAL",
      givenName: "Vaheh",
      familyName: "Hatami",
      imageUrl: "/src/assets/ProfilePics/john.png",
    },
  },
  {
    walletAddress: SHAQS_WALLET,
    isNew: false,
    isPending: false,
    verifiedClaims: {
      type: "INDIVIDUAL",
      givenName: "Shaquille",
      familyName: "O'Neal",
      imageUrl: "/src/assets/ProfilePics/ewan.png",
    },
  },
  {
    walletAddress: JOE_MCCANNS_WALLET,
    isNew: false,
    isPending: false,
    verifiedClaims: {
      type: "INDIVIDUAL",
      givenName: "Josepl",
      familyName: "McCann",
      imageUrl: "/src/assets/ProfilePics/greg.png",
    },
  },
  // A verified business we've done transactions with before
  // {
  //   address: "cccccccccccccccccccccccccccccccccccccccccccc",
  //   image: proteinLand,
  //   name: "ProteinLand",
  //   isAnonymous: false,
  //   isNew: false,
  //   isPending: false,
  // },
  // // An anonymous wallet (Joe McCann) pending verification
  // {
  //   address: JOE_MCCANNS_WALLET,
  //   image: null,
  //   name: null,
  //   isAnonymous: true,
  //   isNew: false,
  //   isPending: true,
  // },
  // {
  //   address: SHAQS_WALLET,
  //   image: jane,
  //   name: "Jane Taylor",
  //   isAnonymous: false,
  //   isNew: false,
  //   isPending: false,
  // },
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
