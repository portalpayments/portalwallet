// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import { MIKES_WALLET } from "../../constants";

export const rawReceipt = {
  props: {
    pageProps: {
      order: {
        restaurantId: "mtJcsdB9ETLJdmjrOLff",
        discountItem: {},
        payingPubKey: MIKES_WALLET,
        squarePaymentIds: ["LNkSvZUuVADHFaAXHpFoS3uqEt9YY"],
        discountBreakdown: {
          "solana-or-not-financial-advice-tee": {
            appliedDiscountPubKey: "",
            appliedDiscountNFTName: "",
            appliedDiscountUSD: 0,
            isMaxDiscount: false,
          },
        },
        squarePaymentId: "LNkSvZUuVADHFaAXHpFoS3uqEt9YY",
        refundStatus: "notRefunded",
        tip: 0,
        discount: 0,
        subtotal: 32,
        paymentStatus: "paid",
        creationTime: 1667678976911,
        items: [
          {
            taxIds: ["YX7PHIKISGZU53WNHSFE6BT6"],
            productId: "solana-or-not-financial-advice-tee",
            toAmount: 0,
            candyMachineId: "",
            orderQuantity: 1,
            specialInstructions: "",
            externalId: "VJ6CQI2ABZUOKZMVO44KYDB2",
            image:
              "https://items-images-production.s3.us-west-2.amazonaws.com/files/48b95aff5cbfc2087daeac70e1037728f4180867/original.png",
            type: "product",
            productName: "Solana | Not Financial Advice Tee",
            unitPrice: 32,
            addOns: [
              {
                stock: 87,
                name: "Medium, White",
                slug: "solana-or-not-financial-advice-tee-medium-white",
                id: "solana-or-not-financial-advice-tee-medium-white",
                categorySlug: "solana-or-not-financial-advice-tee-variants",
                externalId: "4AGMD3ZOHMU3J5V5XGCGUMFO",
                sku: "695202K",
                price: {
                  value: 32,
                  currencyCode: "usd",
                },
                status: "publish",
              },
            ],
          },
        ],
        cashier: "Tessa",
        squareOrderId: "hhe5I60wV1ZqHrU4ge5vFrR03QSZY",
        orderReference: "A64u27MpYAYNJvpgnKjEHwTuJBBNfNphco4f46S752ZA",
        tax: 0,
        functionError: null,
        requireSquareSync: true,
        txOutcome: {
          err: "",
          outcome: true,
          tx: "2Wgzyv1fFFiF4jd8ckPvSJa2eRBHF7pj3wbeTpEzMvqzpfx1jpUgWUZbJW9h915rxWccNqZ9ksFjP7PVVckArZtX",
        },
        total: 32,
        nativeTotal: 0,
        name: "Admin",
        status: "completed",
        attemptedPaymentNum: 1,
        email: "",
        table: "",
        phoneNumber: "",
        fiatTotal: 32,
        gateway: "solana_counter",
        id: "qqS5qxxEjMg7mSup0rBI",
      },
      shop: {
        notifications: [
          {
            priority: 1,
            time: 1667844487802,
            text: "Wallet balance is low for Breakpoint Prod Fee Payer",
            id: "DhF84xpim3cPL53vcNRNfJByBKNn73jTaAghSpe3DwRH",
          },
          {
            text: "Wallet balance is low for Breakpoint Prod Fee Payer",
            priority: 1,
            id: "DhF84xpim3cPL53vcNRNfJByBKNn73jTaAghSpe3DwRH",
            time: 1667934392665,
          },
        ],
        settings: {
          solanaAddress: "4iDRFnp2N4UAsZEePHAxs7ozBanQcGtLYd12HG2HJm4s",
          requireSquareSync: true,
          require2FA: false,
          bitcoinAddress: "",
          activeOrdering: false,
          acceptCard: false,
          requireTable: false,
          acceptSolanaInAppWalletPayment: false,
          acceptSolanaCounterWalletPayment: false,
          acceptSolana: true,
          currency: {
            id: "usd",
            name: "USD",
          },
          exchangeFeePercentageCard: 0,
          exchangeWallet: {
            walletPublicKey: "DhF84xpim3cPL53vcNRNfJByBKNn73jTaAghSpe3DwRH",
            walletLabel: "Breakpoint Prod Fee Payer",
          },
          isExchangeActive: true,
          tippingPercentage: 0,
          acceptBitcoin: false,
          transactionFeesPaidFor: true,
          exchangeFeePercentageCash: 0,
          solanaWalletFeePayer: {
            walletPublicKey: "DhF84xpim3cPL53vcNRNfJByBKNn73jTaAghSpe3DwRH",
            walletLabel: "Breakpoint Prod Fee Payer",
          },
          taxPercentage: 0,
          taxes: [],
          acceptCash: true,
        },
        contact: {
          number: "",
          name: "Solana Spaces Breakpoint",
        },
        slug: "spacesbreakpoint",
        logoUri: {
          firebase:
            "https://firebasestorage.googleapis.com/v0/b/decaf-c57a3.appspot.com/o/images%2Fusers%2FMZcVyOrfU8dWUd7U5lKVWDAJX1k1%2Flogo%2F4b8ce112-0a84-4f26-a3f7-6b094f46635a-Solana_logo.png?alt=media",
          cdn: "https://ik.imagekit.io/r3y94jb5zai/firebasePROD/o/images%2Fusers%2FMZcVyOrfU8dWUd7U5lKVWDAJX1k1%2Flogo%2F4b8ce112-0a84-4f26-a3f7-6b094f46635a-Solana_logo.png?alt=media",
        },
        name: "Solana Spaces Breakpoint",
      },
      dev: false,
    },
    __N_SSG: true,
  },
  page: "/receipt/[receiptId]",
  query: {
    receiptId: "XgVU1qK4i4zXKanjHZpr",
  },
  buildId: "s_U2jOX4q6ShosslyfVMJ",
  isFallback: false,
  gsp: true,
  scriptLoader: [],
};
