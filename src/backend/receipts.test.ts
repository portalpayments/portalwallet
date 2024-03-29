// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import {
  getDecafReceiptMessage,
  getRawReceiptFromMessage,
  getReceiptForSimpleTransaction,
  getReceiptSummaryFromRawReceipt,
} from "./receipts";
import { stringify, log } from "./functions";
import { mikesKeypair } from "./get-mikes-keypair";
import { ThreadMemberScope } from "@dialectlabs/sdk";
import { rawReceipt } from "./test-data/transactions/receipt";
import { DECAF_APP, MIKES_WALLET, SECONDS } from "./constants";
import { getMintAddressBySymbol } from "./solana-functions";

jest.mock("./functions");
jest.mock("./html-extract");

describe(`dialect`, () => {
  test(
    `getting messages`,
    async () => {
      // Date Mike bought a t shirt
      const transactionDate = new Date("November 05, 2022 20:10:02").valueOf();

      const receiptMessage = await getDecafReceiptMessage(
        mikesKeypair,
        transactionDate
      );

      expect(receiptMessage).toEqual({
        author: {
          address: DECAF_APP,
          scopes: ["ADMIN", "WRITE"],
        },
        timestamp: expect.anything(),
        text: "Thank you for your order! You can find your receipt here: https://www.decaf.so/receipt/XgVU1qK4i4zXKanjHZpr",
      });
    },
    10 * SECONDS
  );

  test(
    `Getting receipts from messages`,
    async () => {
      const rawReceipt = await getRawReceiptFromMessage({
        author: {
          address: DECAF_APP,
          scopes: [ThreadMemberScope.ADMIN, ThreadMemberScope.WRITE],
        },
        timestamp: expect.anything(),
        text: "Thank you for your order! You can find your receipt here: https://www.decaf.so/receipt/XgVU1qK4i4zXKanjHZpr",
      });

      expect(rawReceipt).toMatchSnapshot({
        buildId: expect.any(String),
      });
    },
    // This can be slow
    10 * SECONDS
  );

  test(`Getting receiptSummary from raw receipts`, async () => {
    const receiptSummary = getReceiptSummaryFromRawReceipt(rawReceipt);
    expect(receiptSummary).toMatchObject({
      items: [
        {
          name: "Not Financial Advice Tee",
          price: 32,
          quantity: 1,
        },
      ],
      shop: "Solana Spaces Breakpoint",
    });
  });

  test(
    `Adds receipts to transaction that have them`,
    async () => {
      const simpleTransaction = {
        id: "2Wgzyv1fFFiF4jd8ckPvSJa2eRBHF7pj3wbeTpEzMvqzpfx1jpUgWUZbJW9h915rxWccNqZ9ksFjP7PVVckArZtX",
        date: 1667679002000,
        status: true,
        networkFee: 10000,
        direction: 0,
        amount: 32000000,
        currency: getMintAddressBySymbol("USDC"),
        from: MIKES_WALLET,
        to: "4iDRFnp2N4UAsZEePHAxs7ozBanQcGtLYd12HG2HJm4s",
        memo: "qqS5qxxEjMg7mSup0rBI",
      };

      const receipt = await getReceiptForSimpleTransaction(
        mikesKeypair,
        simpleTransaction.memo,
        simpleTransaction.date
      );
      expect(receipt).toMatchObject({});
    },
    // TODO, really slow but may be a Dialect network issue
    15 * SECONDS
  );
});
