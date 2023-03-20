import { log, stringify } from "./backend/functions";
import { PublicKey } from "@solana/web3.js";
// From https://github.com/solana-labs/wallet-standard/blob/master/WALLET.md

// Import the `initialize` function from your wallet-standard package.
import { MIKES_WALLET } from "./backend/constants";

// Methods borrowed from window.solana since the docs are non-existent:
// https://github.com/solana-labs/wallet-standard/issues/17

// See /home/mike/Code/portal/portal-standard-wallet/src/window.ts
// (which is not our code but rather a clone of https://github.com/solana-labs/wallet-standard)

// Note: deliberately uses undefined instead of null

const mikesPublicKey = new PublicKey(MIKES_WALLET);

// log("Hello from conntent script", mikesPublicKey.toBase58());
console.log("Hello from content script", mikesPublicKey);
