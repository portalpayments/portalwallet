import { PublicKey } from "@solana/web3.js";
import {
  JUPITER,
  MIKES_USDC_ACCOUNT,
  MIKES_WALLET,
  ORCA_WHIRLPOOL_MAINNET_ACCOUNT,
  SOLANA_SYSTEM_PROGRAM,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM,
  SPL_TOKEN_PROGRAM,
  USDC_MAINNET_MINT_ACCOUNT,
  WRAPPED_SOL_MAINNET_MINT_ACCOUNT,
} from "../../constants";

export const swapSolWithUSDCOnJupiter = {
  blockTime: 1673260796,
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
                extensionTypes: ["immutableOwner"],
                mint: WRAPPED_SOL_MAINNET_MINT_ACCOUNT,
              },
              type: "getAccountDataSize",
            },
            program: "spl-token",
            programId: new PublicKey(SPL_TOKEN_PROGRAM),
          },
          {
            parsed: {
              info: {
                lamports: 2039280,
                newAccount: "3rkvt7CX3DcPqAcnU7w6eoruaYLLUp1gh3ZFaVKVDsBS",
                owner: SPL_TOKEN_PROGRAM,
                source: MIKES_WALLET,
                space: 165,
              },
              type: "createAccount",
            },
            program: "system",
            programId: new PublicKey(SOLANA_SYSTEM_PROGRAM),
          },
          {
            parsed: {
              info: {
                account: "3rkvt7CX3DcPqAcnU7w6eoruaYLLUp1gh3ZFaVKVDsBS",
              },
              type: "initializeImmutableOwner",
            },
            program: "spl-token",
            programId: new PublicKey(SPL_TOKEN_PROGRAM),
          },
          {
            parsed: {
              info: {
                account: "3rkvt7CX3DcPqAcnU7w6eoruaYLLUp1gh3ZFaVKVDsBS",
                mint: WRAPPED_SOL_MAINNET_MINT_ACCOUNT,
                owner: MIKES_WALLET,
              },
              type: "initializeAccount3",
            },
            program: "spl-token",
            programId: new PublicKey(SPL_TOKEN_PROGRAM),
          },
        ],
      },
      {
        index: 4,
        instructions: [
          {
            accounts: [
              SPL_TOKEN_PROGRAM,
              MIKES_WALLET,
              "7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm",
              "3rkvt7CX3DcPqAcnU7w6eoruaYLLUp1gh3ZFaVKVDsBS",
              "9RfZwn2Prux6QesG1Noo4HzMEBv3rPndJ2bN2Wwd6a7p",
              MIKES_USDC_ACCOUNT,
              "BVNo8ftg2LkkssnWT4ZWdtoFaevnfD6ExYeramwM27pe",
              "3G31V2gLaft2GsfchVJyLQnREeNGFZwoLfjQVskQkHyK",
              "3G31V2gLaft2GsfchVJyLQnREeNGFZwoLfjQVskQkHyK",
              "3G31V2gLaft2GsfchVJyLQnREeNGFZwoLfjQVskQkHyK",
              "6vK8gSiRHSnZzAa5JsvBF2ej1LrxpRX21Y185CzP4PeA",
            ],
            data: "59p8WydnSZtRpoLy1jH2AXMMgQqWZivjtGSZ8gNzHsF9399YZrTQZXJvB2",
            programId: new PublicKey(ORCA_WHIRLPOOL_MAINNET_ACCOUNT),
          },
          {
            parsed: {
              info: {
                amount: "2000000000",
                authority: MIKES_WALLET,
                destination: "9RfZwn2Prux6QesG1Noo4HzMEBv3rPndJ2bN2Wwd6a7p",
                source: "3rkvt7CX3DcPqAcnU7w6eoruaYLLUp1gh3ZFaVKVDsBS",
              },
              type: "transfer",
            },
            program: "spl-token",
            programId: new PublicKey(SPL_TOKEN_PROGRAM),
          },
          {
            parsed: {
              info: {
                amount: "32903572",
                authority: "7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm",
                destination: MIKES_USDC_ACCOUNT,
                source: "BVNo8ftg2LkkssnWT4ZWdtoFaevnfD6ExYeramwM27pe",
              },
              type: "transfer",
            },
            program: "spl-token",
            programId: new PublicKey(SPL_TOKEN_PROGRAM),
          },
        ],
      },
    ],
    logMessages: [
      "Program ComputeBudget111111111111111111111111111111 invoke [1]",
      "Program ComputeBudget111111111111111111111111111111 success",
      "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL invoke [1]",
      "Program log: Create",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
      "Program log: Instruction: GetAccountDataSize",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1569 of 1394633 compute units",
      "Program return: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA pQAAAAAAAAA=",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program 11111111111111111111111111111111 invoke [2]",
      "Program 11111111111111111111111111111111 success",
      "Program log: Initialize the associated token account",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
      "Program log: Instruction: InitializeImmutableOwner",
      "Program log: Please upgrade to SPL Token 2022 for immutable owner support",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1405 of 1388196 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
      "Program log: Instruction: InitializeAccount3",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 3158 of 1384314 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL consumed 19127 of 1400000 compute units",
      "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL success",
      "Program 11111111111111111111111111111111 invoke [1]",
      "Program 11111111111111111111111111111111 success",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]",
      "Program log: Instruction: SyncNative",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 3045 of 1380873 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB invoke [1]",
      "Program log: Instruction: Route",
      "Program whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc invoke [2]",
      "Program log: Instruction: Swap",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]",
      "Program log: Instruction: Transfer",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4736 of 1318723 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [3]",
      "Program log: Instruction: Transfer",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4645 of 1311080 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc consumed 56625 of 1359278 compute units",
      "Program whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc success",
      "Program log: UWzjvs3QCsQOA2hfjpCQU+RYEhxm9adq7cdwaqEcgviqlSqPK3h5qQabiFf+q4GE+2h/Y0YYwDXaxDncGus7VZig8AAAAAABAJQ1dwAAAADG+nrzvtutOj1l82qryXQxsbvkwtL24OR8pgIDRS9dYZQR9gEAAAAA",
      "Program JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB consumed 79219 of 1377828 compute units",
      "Program JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB success",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]",
      "Program log: Instruction: CloseAccount",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 2915 of 1298609 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
    ],
    postBalances: [
      146923831864, 0, 2039280, 70407360, 1, 731913600, 159369370341, 1,
      934087680, 1141440, 5435760, 7744680236820, 2039280, 1141440, 0,
    ],
    postTokenBalances: [
      {
        accountIndex: 2,
        mint: USDC_MAINNET_MINT_ACCOUNT,

        owner: MIKES_WALLET,
        programId: new PublicKey(SPL_TOKEN_PROGRAM),
        uiTokenAmount: {
          amount: "45087057",
          decimals: 6,
          uiAmount: 45.087057,
          uiAmountString: "45.087057",
        },
      },
      {
        accountIndex: 11,
        mint: WRAPPED_SOL_MAINNET_MINT_ACCOUNT,
        owner: "7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm",
        programId: new PublicKey(SPL_TOKEN_PROGRAM),
        uiTokenAmount: {
          amount: "7744678197540",
          decimals: 9,
          uiAmount: 7744.67819754,
          uiAmountString: "7744.67819754",
        },
      },
      {
        accountIndex: 12,
        mint: USDC_MAINNET_MINT_ACCOUNT,
        owner: "7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm",
        programId: new PublicKey(SPL_TOKEN_PROGRAM),
        uiTokenAmount: {
          amount: "476781976646",
          decimals: 6,
          uiAmount: 476781.976646,
          uiAmountString: "476781.976646",
        },
      },
    ],
    preBalances: [
      148923836864, 0, 2039280, 70407360, 1, 731913600, 159369370341, 1,
      934087680, 1141440, 5435760, 7742680236820, 2039280, 1141440, 0,
    ],
    preTokenBalances: [
      {
        accountIndex: 2,
        mint: USDC_MAINNET_MINT_ACCOUNT,
        owner: MIKES_WALLET,
        programId: new PublicKey(SPL_TOKEN_PROGRAM),
        uiTokenAmount: {
          amount: "12183485",
          decimals: 6,
          uiAmount: 12.183485,
          uiAmountString: "12.183485",
        },
      },
      {
        accountIndex: 11,
        mint: WRAPPED_SOL_MAINNET_MINT_ACCOUNT,
        owner: "7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm",
        programId: new PublicKey(SPL_TOKEN_PROGRAM),
        uiTokenAmount: {
          amount: "7742678197540",
          decimals: 9,
          uiAmount: 7742.67819754,
          uiAmountString: "7742.67819754",
        },
      },
      {
        accountIndex: 12,
        mint: USDC_MAINNET_MINT_ACCOUNT,
        owner: "7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm",
        programId: new PublicKey(SPL_TOKEN_PROGRAM),
        uiTokenAmount: {
          amount: "476814880218",
          decimals: 6,
          uiAmount: 476814.880218,
          uiAmountString: "476814.880218",
        },
      },
    ],
    rewards: [],
    status: {
      Ok: null,
    },
  },
  slot: 171586496,
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
          pubkey: new PublicKey("3rkvt7CX3DcPqAcnU7w6eoruaYLLUp1gh3ZFaVKVDsBS"),
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
          pubkey: new PublicKey("3G31V2gLaft2GsfchVJyLQnREeNGFZwoLfjQVskQkHyK"),
          signer: false,
          source: "transaction",
          writable: true,
        },
        {
          pubkey: new PublicKey("ComputeBudget111111111111111111111111111111"),
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: new PublicKey(SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM),
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: new PublicKey(WRAPPED_SOL_MAINNET_MINT_ACCOUNT),
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: new PublicKey(SOLANA_SYSTEM_PROGRAM),
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
        {
          pubkey: new PublicKey(JUPITER),
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: new PublicKey("7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm"),
          signer: false,
          source: "lookupTable",
          writable: true,
        },
        {
          pubkey: new PublicKey("9RfZwn2Prux6QesG1Noo4HzMEBv3rPndJ2bN2Wwd6a7p"),
          signer: false,
          source: "lookupTable",
          writable: true,
        },
        {
          pubkey: new PublicKey("BVNo8ftg2LkkssnWT4ZWdtoFaevnfD6ExYeramwM27pe"),
          signer: false,
          source: "lookupTable",
          writable: true,
        },
        {
          pubkey: new PublicKey(ORCA_WHIRLPOOL_MAINNET_ACCOUNT),
          signer: false,
          source: "lookupTable",
          writable: false,
        },
        {
          pubkey: new PublicKey("6vK8gSiRHSnZzAa5JsvBF2ej1LrxpRX21Y185CzP4PeA"),
          signer: false,
          source: "lookupTable",
          writable: false,
        },
      ],
      addressTableLookups: [
        {
          accountKey: new PublicKey(
            "HEHy7kNR3W8fHnA1a7jMBwHEZH3z2MKjaL8Xo69PrNAM"
          ),
          readonlyIndexes: [0, 152],
          writableIndexes: [146, 147, 148],
        },
      ],
      instructions: [
        {
          accounts: [],
          data: "K1FDJ7",
          programId: new PublicKey(
            "ComputeBudget111111111111111111111111111111"
          ),
        },
        {
          parsed: {
            info: {
              account: "3rkvt7CX3DcPqAcnU7w6eoruaYLLUp1gh3ZFaVKVDsBS",
              mint: WRAPPED_SOL_MAINNET_MINT_ACCOUNT,
              source: MIKES_WALLET,
              systemProgram: SOLANA_SYSTEM_PROGRAM,
              tokenProgram: SPL_TOKEN_PROGRAM,
              wallet: MIKES_WALLET,
            },
            type: "create",
          },
          program: "spl-associated-token-account",
          programId: new PublicKey(SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM),
        },
        {
          parsed: {
            info: {
              destination: "3rkvt7CX3DcPqAcnU7w6eoruaYLLUp1gh3ZFaVKVDsBS",
              lamports: 2000000000,
              source: MIKES_WALLET,
            },
            type: "transfer",
          },
          program: "system",
          programId: new PublicKey(SOLANA_SYSTEM_PROGRAM),
        },
        {
          parsed: {
            info: {
              account: "3rkvt7CX3DcPqAcnU7w6eoruaYLLUp1gh3ZFaVKVDsBS",
            },
            type: "syncNative",
          },
          program: "spl-token",
          programId: new PublicKey(SPL_TOKEN_PROGRAM),
        },
        {
          accounts: [
            SPL_TOKEN_PROGRAM,
            MIKES_WALLET,
            MIKES_USDC_ACCOUNT,
            ORCA_WHIRLPOOL_MAINNET_ACCOUNT,
            SPL_TOKEN_PROGRAM,
            MIKES_WALLET,
            "7qbRF6YsyGuLUVs6Y1q64bdVrfe4ZcUUz1JRdoVNUJnm",
            "3rkvt7CX3DcPqAcnU7w6eoruaYLLUp1gh3ZFaVKVDsBS",
            "9RfZwn2Prux6QesG1Noo4HzMEBv3rPndJ2bN2Wwd6a7p",
            MIKES_USDC_ACCOUNT,
            "BVNo8ftg2LkkssnWT4ZWdtoFaevnfD6ExYeramwM27pe",
            "3G31V2gLaft2GsfchVJyLQnREeNGFZwoLfjQVskQkHyK",
            "3G31V2gLaft2GsfchVJyLQnREeNGFZwoLfjQVskQkHyK",
            "3G31V2gLaft2GsfchVJyLQnREeNGFZwoLfjQVskQkHyK",
            "6vK8gSiRHSnZzAa5JsvBF2ej1LrxpRX21Y185CzP4PeA",
          ],
          data: "PrpFmsY4d26dBnk1dCzKygdiio7bjKPa7pJgbpfBzrxA2WEb",
          programId: new PublicKey(JUPITER),
        },
        {
          parsed: {
            info: {
              account: "3rkvt7CX3DcPqAcnU7w6eoruaYLLUp1gh3ZFaVKVDsBS",
              destination: MIKES_WALLET,
              owner: MIKES_WALLET,
            },
            type: "closeAccount",
          },
          program: "spl-token",
          programId: new PublicKey(SPL_TOKEN_PROGRAM),
        },
      ],
      recentBlockhash: "BpthFfBG1JBJCMQLf8eRjWETKHM3KjwWDoNuoHVsSAf",
    },
    signatures: [
      "4SBiyR6rrie4M78S2dLQjkcb8Ja1mFmuAL4furw5NcpKZkYjsC31EWtycLY3WdatngkiLPEqGwTPncAg41fQATFW",
    ],
  },
  version: 0,
};
