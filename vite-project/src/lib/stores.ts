import { writable, type Writable } from "svelte/store";
import type { Connection, Keypair } from "@solana/web3.js";

// Our connection to Solana
export const connection: Writable<null | Connection> = writable(null);
export const keyPair: Writable<null | Keypair> = writable(null);
