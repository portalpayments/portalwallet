import type { VerifiedClaims } from "../backend/types";

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
  walletAddress: string;
  date: number;
  amount: number;
  isReceived: boolean;
}