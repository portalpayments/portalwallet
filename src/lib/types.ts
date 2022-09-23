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

export enum Direction {
  "sent",
  "recieved",
}

export enum Currency {
  "USDC",
  "SOL",
}

export interface TransactionSummary {
  date: number;
  status: boolean;
  networkFee: number;
  direction: Direction;
  currency: Currency;
  amount: number;
  from: string;
  to: string;
}
