// Shouldn't be necessary but the metaplex will return an awway of 3 possible data types
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

export interface TokenMetaData {
  version: number;
  issuedAgainst: string;
  claims: VerifiedClaims;
}

export interface VerifiedClaims {
  type: "INDIVIDUAL" | "ORGANIZATION";
  givenName: string;
  familyName: string;
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
