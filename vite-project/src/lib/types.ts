import type { VerifiedClaims } from "../../../src/types";

export interface Creator {
  address: string;
  verified: boolean;
  share: number;
}

export interface Collectable {
  name: string;
  description: string;
  image: string;
}

export interface Contact {
  walletAddress: string;
  isNew: boolean;
  isPending: boolean;
  verifiedClaims: VerifiedClaims;
}

export interface Transaction {
  date: number;
  amount: number;
  isReceived: boolean;
}
