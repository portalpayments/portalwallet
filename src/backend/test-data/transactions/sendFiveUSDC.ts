import { PublicKey } from "@solana/web3.js";
import {
  MIKES_USDC_ACCOUNT,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM,
  SPL_TOKEN_PROGRAM,
  USDC_MAINNET_MINT_ACCOUNT,
  GREGS_WALLET,
  SOLANA_SYSTEM_PROGRAM,
  MIKES_WALLET,
  NOTE_PROGRAM,
} from "../../constants";

// Sending 5 USDC to a newly created wallet

// https://explorer.solana.com/tx/5e9xViaBigEX6G17PvHt9AizyJwRBHPdxCEkz2eLRYsanr53567SHzULhYT6zk63vbsZ4puN3WY7i5774HS7CneZ
export const sendFiveUSDC = {
  blockTime: 1669052844,
  meta: {
    err: null,
    fee: 5000,
    innerInstructions: [
      {
        index: 0,
        instructions: [
          {
            parsed: {
              info: {
                extensionTypes: ["immutableOwner"],
                mint: USDC_MAINNET_MINT_ACCOUNT,
              },
              type: "getAccountDataSize",
            },
            program: "spl-token",
            programId: new PublicKey(new PublicKey(SPL_TOKEN_PROGRAM)),
          },
          {
            parsed: {
              info: {
                lamports: 2039280,
                newAccount: new PublicKey(
                  "45hv5bBaXX9vK2zbdsZq526iHjhEPgsF3mascJDFoSuS"
                ),
                owner: SPL_TOKEN_PROGRAM,
                source: new PublicKey(MIKES_WALLET),
                space: 165,
              },
              type: "createAccount",
            },
            program: "system",
            programId: new PublicKey(new PublicKey(SOLANA_SYSTEM_PROGRAM)),
          },
          {
            parsed: {
              info: {
                account: "45hv5bBaXX9vK2zbdsZq526iHjhEPgsF3mascJDFoSuS",
              },
              type: "initializeImmutableOwner",
            },
            program: "spl-token",
            programId: new PublicKey(new PublicKey(SPL_TOKEN_PROGRAM)),
          },
          {
            parsed: {
              info: {
                account: "45hv5bBaXX9vK2zbdsZq526iHjhEPgsF3mascJDFoSuS",
                mint: USDC_MAINNET_MINT_ACCOUNT,
                owner: GREGS_WALLET,
              },
              type: "initializeAccount3",
            },
            program: "spl-token",
            programId: new PublicKey(new PublicKey(SPL_TOKEN_PROGRAM)),
          },
        ],
      },
    ],
    logMessages: [
      "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL invoke [1]",
      "Program log: Create",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
      "Program log: Instruction: GetAccountDataSize",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1622 of 594408 compute units",
      "Program return: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA pQAAAAAAAAA=",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program 11111111111111111111111111111111 invoke [2]",
      "Program 11111111111111111111111111111111 success",
      "Program log: Initialize the associated token account",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
      "Program log: Instruction: InitializeImmutableOwner",
      "Program log: Please upgrade to SPL Token 2022 for immutable owner support",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1405 of 587918 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
      "Program log: Instruction: InitializeAccount3",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4241 of 584034 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL consumed 20545 of 600000 compute units",
      "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL success",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]",
      "Program log: Instruction: TransferChecked",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 6199 of 579455 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93 invoke [1]",
      "Program noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93 consumed 737 of 573256 compute units",
      "Program noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93 success",
    ],
    postBalances: [
      446898195424, 2039280, 2039280, 1, 731913600, 0, 179719266068, 1009200,
      934087680, 1141440,
    ],
    postTokenBalances: [
      {
        accountIndex: 1,
        mint: USDC_MAINNET_MINT_ACCOUNT,
        owner: GREGS_WALLET,
        programId: new PublicKey(SPL_TOKEN_PROGRAM),
        uiTokenAmount: {
          amount: "5000000",
          decimals: 6,
          uiAmount: 5,
          uiAmountString: "5",
        },
      },
      {
        accountIndex: 2,
        mint: USDC_MAINNET_MINT_ACCOUNT,
        owner: MIKES_WALLET,
        programId: new PublicKey(SPL_TOKEN_PROGRAM),
        uiTokenAmount: {
          amount: "35933485",
          decimals: 6,
          uiAmount: 35.933485,
          uiAmountString: "35.933485",
        },
      },
    ],
    preBalances: [
      446900239704, 0, 2039280, 1, 731913600, 0, 179719266068, 1009200,
      934087680, 1141440,
    ],
    preTokenBalances: [
      {
        accountIndex: 2,
        mint: USDC_MAINNET_MINT_ACCOUNT,
        owner: MIKES_WALLET,
        programId: new PublicKey(SPL_TOKEN_PROGRAM),
        uiTokenAmount: {
          amount: "40933485",
          decimals: 6,
          uiAmount: 40.933485,
          uiAmountString: "40.933485",
        },
      },
    ],
    rewards: [],
    status: {
      Ok: null,
    },
  },
  slot: 162363388,
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
          pubkey: new PublicKey("45hv5bBaXX9vK2zbdsZq526iHjhEPgsF3mascJDFoSuS"),
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
          pubkey: new PublicKey(SOLANA_SYSTEM_PROGRAM),
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
          pubkey: new PublicKey(GREGS_WALLET),
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: new PublicKey(USDC_MAINNET_MINT_ACCOUNT),
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: new PublicKey("SysvarRent111111111111111111111111111111111"),
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
          pubkey: new PublicKey(NOTE_PROGRAM),
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
              account: "45hv5bBaXX9vK2zbdsZq526iHjhEPgsF3mascJDFoSuS",
              mint: USDC_MAINNET_MINT_ACCOUNT,
              source: MIKES_WALLET,
              systemProgram: SOLANA_SYSTEM_PROGRAM,
              tokenProgram: SPL_TOKEN_PROGRAM,
              wallet: GREGS_WALLET,
            },
            type: "create",
          },
          program: "spl-associated-token-account",
          programId: new PublicKey(
            new PublicKey(SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM)
          ),
        },
        {
          parsed: {
            info: {
              authority: MIKES_WALLET,
              destination: "45hv5bBaXX9vK2zbdsZq526iHjhEPgsF3mascJDFoSuS",
              mint: USDC_MAINNET_MINT_ACCOUNT,
              source: MIKES_USDC_ACCOUNT,
              tokenAmount: {
                amount: "5000000",
                decimals: 6,
                uiAmount: 5,
                uiAmountString: "5",
              },
            },
            type: "transferChecked",
          },
          program: "spl-token",
          programId: new PublicKey(new PublicKey(SPL_TOKEN_PROGRAM)),
        },
        {
          accounts: [new PublicKey(MIKES_WALLET), new PublicKey(GREGS_WALLET)],
          data: "AnWnJTR4tkAQv6QU6qhaVST1ddQ6CKYjbGFcr",
          programId: new PublicKey(NOTE_PROGRAM),
        },
      ],
      recentBlockhash: "CjNQgjXsnJx77HHUk9QjPYZgz1J9jyUs8paaMAuQ2pVj",
    },
    signatures: [
      "5e9xViaBigEX6G17PvHt9AizyJwRBHPdxCEkz2eLRYsanr53567SHzULhYT6zk63vbsZ4puN3WY7i5774HS7CneZ",
    ],
  },
};
