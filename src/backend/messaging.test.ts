import { getTransactionsAndMessagesByDays } from "./messaging";
import type { SimpleTransaction, SimpleWalletMessage } from "./types";
import { log, stringify } from "./functions";

const transactionsAndMessages = [
  {
    id: "5QraiYPYaZbCaX8nBMNbrGuTtyHXatzH1HCqgD5ZwcgnBUaYujrBYrnQT5DxHnaagjF8XFSc6RP4cpF261SXiEpi",
    date: new Date("2023-01-20T11:13:40.000Z").valueOf(),
    status: true,
    networkFee: 5000,
    direction: 0,
    amount: 500000,
    currency: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
    to: VAHEHS_WALLET,
    memo: "Demo for David",
    receipt: null,
    swapAmount: null,
    swapCurrency: null,
  } as SimpleTransaction,
  {
    id: "4FatToRKsWFvYKoXVB6jmN99WFc4hqsvRWeGJobN9y4TkKuqKca1rrapC7UNrqsWTXq8BfVs3aa9dNBP4LTUjBg4",
    date: new Date("2022-12-19T16:47:57.000Z").valueOf(),
    status: true,
    networkFee: 5000,
    direction: 0,
    amount: 50000,
    currency: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
    to: VAHEHS_WALLET,
    memo: "Recording a demo to show off Portal ✨",
    receipt: null,
    swapAmount: null,
    swapCurrency: null,
  } as SimpleTransaction,
  {
    id: "4FatToRKsWFvYKoXVB6jmN99WFc4hqsvRWeGJobN9y4TkKuqKca1rrapC7UNrqsWTXq8BfVs3aa9dNBP4LTUjBg4",
    date: new Date("2022-12-19T10:47:57.000Z").valueOf(),
    status: true,
    networkFee: 5000,
    direction: 0,
    amount: 50000,
    currency: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
    to: VAHEHS_WALLET,
    memo: "Recording a demo to show off Portal ✨",
    receipt: null,
    swapAmount: null,
    swapCurrency: null,
  } as SimpleTransaction,
  {
    // TODO - fix
    id: "dialect-undefined",
    date: new Date("2023-01-19T19:06:38.831Z").valueOf(),
    memo: "hello",
    direction: 0,
    isDialectMessage: true,
  } as SimpleWalletMessage,
];

describe(`sorting`, () => {
  test(`sorting by day`, () => {
    const transactionsAndMessagesByDays = getTransactionsAndMessagesByDays(
      transactionsAndMessages
    );
    expect(transactionsAndMessagesByDays).toEqual([
      {
        isoDate: "2022-12-19",
        transactionsAndMessages: [
          {
            id: "4FatToRKsWFvYKoXVB6jmN99WFc4hqsvRWeGJobN9y4TkKuqKca1rrapC7UNrqsWTXq8BfVs3aa9dNBP4LTUjBg4",
            date: 1671446877000,
            status: true,
            networkFee: 5000,
            direction: 0,
            amount: 50000,
            currency: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
            to: VAHEHS_WALLET,
            memo: "Recording a demo to show off Portal ✨",
            receipt: null,
            swapAmount: null,
            swapCurrency: null,
          },
          {
            id: "4FatToRKsWFvYKoXVB6jmN99WFc4hqsvRWeGJobN9y4TkKuqKca1rrapC7UNrqsWTXq8BfVs3aa9dNBP4LTUjBg4",
            date: 1671468477000,
            status: true,
            networkFee: 5000,
            direction: 0,
            amount: 50000,
            currency: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
            to: VAHEHS_WALLET,
            memo: "Recording a demo to show off Portal ✨",
            receipt: null,
            swapAmount: null,
            swapCurrency: null,
          },
        ],
      },
      {
        isoDate: "2023-01-19",
        transactionsAndMessages: [
          {
            id: "dialect-undefined",
            date: 1674155198831,
            memo: "hello",
            direction: 0,
            isDialectMessage: true,
          },
        ],
      },
      {
        isoDate: "2023-01-20",
        transactionsAndMessages: [
          {
            id: "5QraiYPYaZbCaX8nBMNbrGuTtyHXatzH1HCqgD5ZwcgnBUaYujrBYrnQT5DxHnaagjF8XFSc6RP4cpF261SXiEpi",
            date: 1674213220000,
            status: true,
            networkFee: 5000,
            direction: 0,
            amount: 500000,
            currency: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            from: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
            to: VAHEHS_WALLET,
            memo: "Demo for David",
            receipt: null,
            swapAmount: null,
            swapCurrency: null,
          },
        ],
      },
    ]);
  });
});
