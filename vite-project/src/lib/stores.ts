import { writable, type Writable } from "svelte/store";
import { PublicKey, type Connection, type Keypair } from "@solana/web3.js";
import { identityTokenIssuerPublicKeyString } from "./constants";
import { VAHEHS_WALLET } from "../../../src/constants";
import type { Contact } from "../lib/types";

// Our connection to Solana
export const connection: Writable<null | Connection> = writable(null);
export const keyPair: Writable<null | Keypair> = writable(null);

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
