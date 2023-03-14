import { PublicKey } from "@solana/web3.js";
import {
  COMPUTE_BUDGET_PROGRAM,
  MIKES_USDC_ACCOUNT,
  MIKES_WALLET,
  SPL_TOKEN_PROGRAM,
  SQUADS_ADDRESS,
  USDC_MAINNET_MINT_ACCOUNT,
} from "../../constants";

// The Helius Multisig wallet sending us 200 USDC from Solana Sandstorm
export const multiSigTransaction = {
  blockTime: 1678286935,
  meta: {
    err: null,
    fee: 5000,
    innerInstructions: [
      {
        index: 1,
        instructions: [
          {
            parsed: {
              info: {
                amount: "200000000",
                authority: "45xu19B21vnDMWGWb4M57Yu9D4xZfx5KYroVGhb5RnAF",
                destination: MIKES_USDC_ACCOUNT,
                source: "AZkgZMryFwK8255jB44DDn8jbjhrXzPAw6Ph9jk2BhtG",
              },
              type: "transfer",
            },
            program: "spl-token",
            programId: SPL_TOKEN_PROGRAM,
          },
        ],
      },
    ],
    logMessages: [
      "Program ComputeBudget111111111111111111111111111111 invoke [1]",
      "Program ComputeBudget111111111111111111111111111111 success",
      "Program SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu invoke [1]",
      "Program log: Instruction: ExecuteTransaction",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
      "Program log: Instruction: Transfer",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4645 of 1384144 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu consumed 24256 of 1400000 compute units",
      "Program SMPLecH534NA9acpos4G6x7uf3LWbCAwZQE9e8ZekMu success",
    ],
    postBalances: [
      15055787481, 2039280, 4189920, 4322160, 2039280, 1001000000, 1, 2018400,
      1141440, 934087680,
    ],
    postTokenBalances: [
      {
        accountIndex: 1,
        mint: USDC_MAINNET_MINT_ACCOUNT,
        owner: "45xu19B21vnDMWGWb4M57Yu9D4xZfx5KYroVGhb5RnAF",
        programId: SPL_TOKEN_PROGRAM,
        uiTokenAmount: {
          amount: "72202261000",
          decimals: 6,
          uiAmount: 72202.261,
          uiAmountString: "72202.261",
        },
      },
      {
        accountIndex: 4,
        mint: USDC_MAINNET_MINT_ACCOUNT,
        owner: MIKES_WALLET,
        programId: SPL_TOKEN_PROGRAM,
        uiTokenAmount: {
          amount: "330257057",
          decimals: 6,
          uiAmount: 330.257057,
          uiAmountString: "330.257057",
        },
      },
    ],
    preBalances: [
      15055792481, 2039280, 4189920, 4322160, 2039280, 1001000000, 1, 2018400,
      1141440, 934087680,
    ],
    preTokenBalances: [
      {
        accountIndex: 1,
        mint: USDC_MAINNET_MINT_ACCOUNT,
        owner: "45xu19B21vnDMWGWb4M57Yu9D4xZfx5KYroVGhb5RnAF",
        programId: SPL_TOKEN_PROGRAM,
        uiTokenAmount: {
          amount: "72402261000",
          decimals: 6,
          uiAmount: 72402.261,
          uiAmountString: "72402.261",
        },
      },
      {
        accountIndex: 4,
        mint: USDC_MAINNET_MINT_ACCOUNT,
        owner: MIKES_WALLET,
        programId: SPL_TOKEN_PROGRAM,
        uiTokenAmount: {
          amount: "130257057",
          decimals: 6,
          uiAmount: 130.257057,
          uiAmountString: "130.257057",
        },
      },
    ],
    rewards: [],
    status: {
      Ok: null,
    },
  },
  slot: 181463802,
  transaction: {
    message: {
      accountKeys: [
        {
          pubkey: new PublicKey("8cRrU1NzNpjL3k2BwjW3VixAcX6VFc29KHr4KZg8cs2Y"),
          signer: true,
          source: "transaction",
          writable: true,
        },
        {
          pubkey: new PublicKey("AZkgZMryFwK8255jB44DDn8jbjhrXzPAw6Ph9jk2BhtG"),
          signer: false,
          source: "transaction",
          writable: true,
        },
        {
          pubkey: new PublicKey("DAuyEpod92zGw5DZo3uUnwg6ih1naXpQZhsXG8CYtwu6"),
          signer: false,
          source: "transaction",
          writable: true,
        },
        {
          pubkey: new PublicKey("Dub7HNhfQ88uv9CA68W4ozkg8AzPoAULT6JWPWEpdKHy"),
          signer: false,
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
          pubkey: new PublicKey("45xu19B21vnDMWGWb4M57Yu9D4xZfx5KYroVGhb5RnAF"),
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: new PublicKey(COMPUTE_BUDGET_PROGRAM),
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: new PublicKey("GyBLTY2Nhsy3ALJpYGMMgEQimKzKy8Rx9C3SN9tTUsbT"),
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: new PublicKey(SQUADS_ADDRESS),
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
          accounts: [],
          data: "1ZB8YLb1LPZq",
          programId: new PublicKey(COMPUTE_BUDGET_PROGRAM),
        },
        {
          accounts: [
            "DAuyEpod92zGw5DZo3uUnwg6ih1naXpQZhsXG8CYtwu6",
            "Dub7HNhfQ88uv9CA68W4ozkg8AzPoAULT6JWPWEpdKHy",
            "8cRrU1NzNpjL3k2BwjW3VixAcX6VFc29KHr4KZg8cs2Y",
            "GyBLTY2Nhsy3ALJpYGMMgEQimKzKy8Rx9C3SN9tTUsbT",
            SPL_TOKEN_PROGRAM,
            "AZkgZMryFwK8255jB44DDn8jbjhrXzPAw6Ph9jk2BhtG",
            MIKES_USDC_ACCOUNT,
            "45xu19B21vnDMWGWb4M57Yu9D4xZfx5KYroVGhb5RnAF",
          ],
          data: "3BGkcegFF7kZwTkyshsyFX4o",
          programId: new PublicKey(SQUADS_ADDRESS),
        },
      ],
      recentBlockhash: "3yPk1gEAe3LyQgcmsPukqcBMBkHxKaEexixcPo1WqBsV",
    },
    signatures: [
      "2ctGNBdXCVtNkKtcPNZqe2QtMxkCCU9fHU6HkHwKraf2YEgK3Adfbd9pb2CifvKfys5apJSSrUP9W4LbRjUpmjc8",
    ],
  },
  version: "legacy",
};
