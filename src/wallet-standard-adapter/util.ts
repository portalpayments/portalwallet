// This is copied from @wallet-standard/wallet

import type { IdentifierString } from "@wallet-standard/base";
import { SOLANA_CHAINS } from "./solana-chains";
import type { SolanaChain } from "./types";

export function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  return isArrayEqual(a, b);
}

interface Indexed<T> {
  length: number;
  [index: number]: T;
}

export function isArrayEqual<T>(a: Indexed<T>, b: Indexed<T>): boolean {
  if (a === b) return true;

  const length = a.length;
  if (length !== b.length) return false;

  for (let i = 0; i < length; i++) {
    if (a[i] !== b[i]) return false;
  }

  return true;
}

// Check if a chain corresponds with one of the Solana clusters.
export function isSolanaChain(chain: IdentifierString): chain is SolanaChain {
  return SOLANA_CHAINS.includes(chain as SolanaChain);
}

// Convert a Solana 'message to sign' (like "Accept our terms of service") to a string
export const convertSolanaMessageToString = (message: Uint8Array) => {
  // First, convert the Solana message to a string, but also 'message' is a confusing
  // variable name, since we already have window.postMessage() and 'message' is a different type of message
  const text = new TextDecoder().decode(message);
  return text;
};
