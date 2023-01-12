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
  "swapped",
}

export enum Currency {
  "USDC",
  "USDH",
  "USDT",
  "SOL",
  "WSOL",
}

export type CurrencyDetails = {
  id: Currency;
  name: string;
  decimals: number;
};

export interface ReceiptSummary {
  shop: string;
  items: Array<{
    quantity: number;
    name: string;
    price: number;
  }>;
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
  receipt: ReceiptSummary | null;
  swapAmount: number | null;
  swapCurrency: Currency;
}

export interface TransactionsByDay {
  isoDate: string;
  totalSpending: number;
  totalSpendingDisplay: string;
  transactions: Array<TransactionSummary>;
}
