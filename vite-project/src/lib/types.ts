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
  isAnonymous: boolean;
  isNew: boolean;
  isPending: boolean;
}

export interface Transaction {
  date: number;
  amount: number;
  isReceived: boolean;
}
