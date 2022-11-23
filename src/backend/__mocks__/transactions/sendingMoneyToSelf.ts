import { PublicKey } from "@solana/web3.js";
import {
  USDC_MAINNET_MINT_ACCOUNT,
  MIKES_WALLET,
  SPL_TOKEN_PROGRAM,
  MIKES_USDC_ACCOUNT,
} from "../../constants";

// Mike sending money to his own account
// Which he did once. Mainly this is just to make sure we don't choke on this silly transaction.
export const sendingMoneyToSelf = {
  blockTime: 1662985447,
  meta: {
    err: null,
    fee: 5000,
    innerInstructions: [],
    logMessages: [
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]",
      "Program log: Instruction: TransferChecked",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 5929 of 200000 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
    ],
    postBalances: [4620800, 2039280, 146540071068, 934087680],
    postTokenBalances: [
      {
        accountIndex: 1,
        mint: USDC_MAINNET_MINT_ACCOUNT,
        owner: MIKES_WALLET,
        programId: SPL_TOKEN_PROGRAM,
        uiTokenAmount: {
          amount: "25263485",
          decimals: 6,
          uiAmount: 25.263485,
          uiAmountString: "25.263485",
        },
      },
    ],
    preBalances: [4625800, 2039280, 146540071068, 934087680],
    preTokenBalances: [
      {
        accountIndex: 1,
        mint: USDC_MAINNET_MINT_ACCOUNT,
        owner: MIKES_WALLET,
        programId: SPL_TOKEN_PROGRAM,
        uiTokenAmount: {
          amount: "25263485",
          decimals: 6,
          uiAmount: 25.263485,
          uiAmountString: "25.263485",
        },
      },
    ],
    rewards: [],
    status: {
      Ok: null,
    },
  },
  slot: 150330435,
  transaction: {
    message: {
      accountKeys: [
        {
          pubkey: new PublicKey(MIKES_WALLET),
          signer: true,
          source: "transaction",
          writable: true,
        },
        {
          pubkey: new PublicKey(MIKES_USDC_ACCOUNT),
          signer: false,
          source: "transaction",
          writable: true,
        },
        {
          pubkey: new PublicKey(USDC_MAINNET_MINT_ACCOUNT),
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: new PublicKey(SPL_TOKEN_PROGRAM),
          signer: false,
          source: "transaction",
          writable: false,
        },
      ],
      addressTableLookups: null,
      instructions: [
        {
          parsed: {
            info: {
              authority: MIKES_WALLET,
              destination: MIKES_USDC_ACCOUNT,
              mint: USDC_MAINNET_MINT_ACCOUNT,
              source: MIKES_USDC_ACCOUNT,
              tokenAmount: {
                amount: "1000000",
                decimals: 6,
                uiAmount: 1,
                uiAmountString: "1",
              },
            },
            type: "transferChecked",
          },
          program: "spl-token",
          programId: new PublicKey(SPL_TOKEN_PROGRAM),
        },
      ],
      recentBlockhash: "7hATKZN4oKGzmU1x9iMTDJ12Nv6PGfUSoKJkLBtY8Edy",
    },
    signatures: [
      "V7jqDfAeaLniy2crKHHu18LXCivjTczDr1ciFLKNTd7aBA2BC11TrKyzrV8cf9jpgn1UiznuhkuHUJvbAifJQJ6",
    ],
  },
};
