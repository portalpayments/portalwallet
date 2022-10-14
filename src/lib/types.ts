import type { VerifiedClaims } from "../backend/types";

export interface User {
  name: string;
  isVerified: boolean;
}

export interface Settings {
  secretKey: Uint8Array;
  version: number;
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

export enum Direction {
  "sent",
  "recieved",
}

export enum Currency {
  "USDC",
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
  total: number;
  transactions: Array<TransactionSummary>;
}

// From https://github.com/squelix/svelte-portfolio/blob/213edd42797625a537f4f167bd934c2e99ee503c/src/models/forms/svelte-html-props.interface.ts
export type EventHandler<
  E extends Event = Event,
  T extends EventTarget = HTMLElement
> = (event: E & { currentTarget: EventTarget & T }) => any;

export type MouseEventHandler<T extends EventTarget> = EventHandler<
  MouseEvent,
  T
>;
