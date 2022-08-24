import { writable, type Writable } from "svelte/store";
import type { Connection, Keypair } from "@solana/web3.js";

// Our connection to Solana
export const connection: Writable<null | Connection> = writable(null);
export const keyPair: Writable<null | Keypair> = writable(null);

// src https://svelte.dev/repl/d7b5f0d565a441cfac66e093ee6fe62d?version=3.19.1
export const User = function () {
	const { subscribe, set } = writable('init');
  return {
    subscribe,
    signout: () => { set(null) },
		signin:  () => { set('Chris') }
	}
}()

//src https://svelte.dev/repl/cc54944f9c2f44209d6da7344ea4c101?version=3.17.2
export const authStore = writable(null); 