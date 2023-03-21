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

/**
 * Check if a chain corresponds with one of the Solana clusters.
 */
export function isSolanaChain(chain: IdentifierString): chain is SolanaChain {
  return SOLANA_CHAINS.includes(chain as SolanaChain);
}
