import type { PublicKey } from "@solana/web3.js";
import type { VerifiedClaims } from "../backend/types";

export interface Settings {
  version: number;
  secretKey: Uint8Array;
  personalPhrase: string | null;
  mnemonic: string | null;
}

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

export interface AccountSummary {
  address: PublicKey;
  currency: Currency;
  balance: number;
  decimals: number;
  transactionSummaries: Array<TransactionSummary>;
}

export enum Direction {
  "sent",
  "recieved",
}

export enum Currency {
  "USDC",
  "USDH",
  "USDT",
  "SOL",
}

export interface TransactionSummary {
  id: string;
  date: number;
  status: boolean;
  networkFee: number;
  direction: Direction;
  currency: Currency;
  amount: number;
  from: string;
  to: string;
  memo: string | null;
}

export interface TransactionsByDay {
  isoDate: string;
  totalSpending: number;
  transactions: Array<TransactionSummary>;
}
