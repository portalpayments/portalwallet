// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import type { JsonMetadata } from "@metaplex-foundation/js";
import type { PublicKey } from "@solana/web3.js";
import type { mintToCurrencyMap } from "../backend/mint-to-currency-map";

// Shouldn't be necessary but the metaplex will return an array of 3 possible data types
export interface ExpandedNFT {
  model: string;
  updateAuthorityAddress: string;
  json: any;
  jsonLoaded: boolean;
  name: string;
  symbol: string;
  uri: string;
  isMutable: boolean;
  primarySaleHappened: boolean;
  sellerFeeBasisPoints: number;
  editionNonce: number;
  creators: Array<{
    address: string;
    verified: boolean;
    share: number;
  }>;
  tokenStandard: number;
  collection: any;
  collectionDetails: any;
  uses: any;
  address: string;
  metadataAddress: string;
  mint: {
    model: string;
    address: string;
    mintAuthorityAddress: string;
    freezeAuthorityAddress: string;
    decimals: number;
    supply: {
      basisPoints: string;
      currency: {
        symbol: string;
        decimals: number;
        namespace: string;
      };
    };
    isWrappedSol: boolean;
    currency: {
      symbol: string;
      decimals: number;
      namespace: string;
    };
  };
  edition: {
    model: string;
    isOriginal: boolean;
    address: string;
    supply: string;
    maxSupply: string;
  };
}

// TODO: retire in favour of JsonMetadata
// Once we no longer use this for demos.
export interface OldNonStandardTokenMetaData {
  version: number;
  issuedAgainst: string;
  claims: VerifiedClaimsForIndividual | VerifiedClaimsForOrganization;
}

export interface CipherTextAndInitializationVector {
  cipherText: ArrayBuffer;
  initializationVector: Uint8Array;
}
export interface CipherTextAndInitializationVectorSerialized {
  cipherText: string;
  initializationVector: string;
}

// See https://docs.solflare.com/solflare/technical/profile-picture-protocol/get-a-wallets-profile-picture
export interface ProfilePictureResponse {
  isAvailable: boolean;
  url: string;
  name: string;
  metadata: JsonMetadata;
  tokenAccount: PublicKey;
  mintAccount: PublicKey;
}

// A token account, with just the properties we care about
export interface BasicTokenAccount {
  address: PublicKey;
  mint: PublicKey;
  amount: bigint;
}

export interface VerifiedClaimsForIndividual {
  type: "INDIVIDUAL";
  givenName: string;
  familyName: string;
  imageUrl: string;
}

export interface VerifiedClaimsForOrganization {
  type: "ORGANIZATION";
  legalName: string;
  jurisdiction: "Country" | "State";
  state: null | string;
  country: string;
  isNotable: boolean;
  imageUrl: string;
}

export interface RawDecafReceipt {
  props: {
    pageProps: {
      order: {
        restaurantId: string;
        discountItem: {};
        payingPubKey: string;
        squarePaymentIds: Array<string>;
        discountBreakdown: {
          "solana-or-not-financial-advice-tee": {
            appliedDiscountPubKey: string;
            appliedDiscountNFTName: string;
            appliedDiscountUSD: number;
            isMaxDiscount: boolean;
          };
        };
        squarePaymentId: string;
        refundStatus: string;
        tip: number;
        discount: number;
        subtotal: number;
        paymentStatus: string;
        creationTime: number;
        items: Array<{
          taxIds: Array<string>;
          productId: string;
          toAmount: number;
          candyMachineId: string;
          orderQuantity: number;
          specialInstructions: string;
          externalId: string;
          image: string;
          type: string;
          productName: string;
          unitPrice: number;
          addOns: Array<{
            stock: number;
            name: string;
            slug: string;
            id: string;
            categorySlug: string;
            externalId: string;
            sku: string;
            price: {
              value: number;
              currencyCode: string;
            };
            status: string;
          }>;
        }>;
        cashier: string;
        squareOrderId: string;
        orderReference: string;
        tax: number;
        functionError: any;
        requireSquareSync: boolean;
        txOutcome: {
          err: string;
          outcome: boolean;
          tx: string;
        };
        total: number;
        nativeTotal: number;
        name: string;
        status: string;
        attemptedPaymentNum: number;
        email: string;
        table: string;
        phoneNumber: string;
        fiatTotal: number;
        gateway: string;
        id: string;
      };
      shop: {
        notifications: Array<{
          priority: number;
          time: number;
          text: string;
          id: string;
        }>;
        settings: {
          solanaAddress: string;
          requireSquareSync: boolean;
          require2FA: boolean;
          bitcoinAddress: string;
          activeOrdering: boolean;
          acceptCard: boolean;
          requireTable: boolean;
          acceptSolanaInAppWalletPayment: boolean;
          acceptSolanaCounterWalletPayment: boolean;
          acceptSolana: boolean;
          currency: {
            id: string;
            name: string;
          };
          exchangeFeePercentageCard: number;
          exchangeWallet: {
            walletPublicKey: string;
            walletLabel: string;
          };
          isExchangeActive: boolean;
          tippingPercentage: number;
          acceptBitcoin: boolean;
          transactionFeesPaidFor: boolean;
          exchangeFeePercentageCash: number;
          solanaWalletFeePayer: {
            walletPublicKey: string;
            walletLabel: string;
          };
          taxPercentage: number;
          taxes: Array<any>;
          acceptCash: boolean;
        };
        contact: {
          number: string;
          name: string;
        };
        slug: string;
        logoUri: {
          firebase: string;
          cdn: string;
        };
        name: string;
      };
      dev: boolean;
    };
    __N_SSG: boolean;
  };
  page: string;
  query: {
    receiptId: string;
  };
  buildId: string;
  isFallback: boolean;
  gsp: boolean;
  scriptLoader: Array<any>;
}

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
  id: string;
  name: string;
  description: string;
  coverImage: string;
  media: string;
  type: string;
  attributes: Record<string, string | number | boolean>;
}

export interface Contact {
  walletAddress: string;
  isNew: boolean;
  isPending: boolean;
  verifiedClaims: VerifiedClaimsForIndividual | VerifiedClaimsForOrganization;
  profilePictureURL: string;
}

export interface AccountSummary {
  address: PublicKey;
  currency: Currency;
  balance: number;
  decimals: number;
  transactionSummaries: Array<SimpleTransaction>;
  lastUpdated: number;
}

export enum Direction {
  "sent",
  "recieved",
  "swapped",
}

export type Currency = keyof typeof mintToCurrencyMap;

export type CurrencyDetails = {
  mintAddress: Currency;
  symbol: string;
  decimals: number;
  logo: string | null;
};

export interface ReceiptSummary {
  shop: string;
  items: Array<{
    quantity: number;
    name: string;
    price: number;
  }>;
}
export interface SimpleTransaction {
  id: string;
  date: number;
  status: boolean;
  networkFee: number;
  direction: Direction;
  currency: Currency;
  amount: number;
  from: string;
  to: string;
  counterParty: string | null;
  memo: string | null;
  receipt: ReceiptSummary | null;
  swapAmount: number | null;
  swapCurrency: Currency;
  isMultisig: boolean;
}

export interface SimpleWalletMessage {
  id: string;
  date: number;
  memo: string | null;
  direction: Direction;
  isDialectMessage: true;
}

export interface TransactionsByDay {
  isoDate: string;
  totalSpending: number;
  totalSpendingDisplay: string | null;
  transactions: Array<SimpleTransaction>;
}

export type Jurisdiction = "State" | "Country";
