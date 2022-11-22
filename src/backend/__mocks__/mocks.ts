import { PublicKey } from "@solana/web3.js";
import {
  MEMO_PROGRAM,
  MIKES_USDC_ACCOUNT,
  MIKES_WALLET,
  SOLANA_SYSTEM_PROGRAM,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM,
  SPL_TOKEN_PROGRAM,
  USDC_MAINNET_MINT_ACCOUNT,
  YCOMBINATOR_DEMO_WALLET_FOR_JARED,
} from "../constants";

// Put these at the top to avoid indentation issues
export const dirtyPersonalPhrase = `Say your prayers, little one
Don't forget, my son
To include everyone

I tuck you in, warm within
Keep you free from sin
Till the Sandman he comes
`;

export const expectedCleanedPersonalPhrase = `say your prayers little one dont forget my son to include everyone i tuck you in warm within keep you free from sin till the sandman he comes`;

export const MOCK_SENDER_PUBLIC_KEY =
  "AfpdXGBdFiyQfXdf4x3yYWiJgPqp6xBNvy3UwHyuLgGn";
export const MOCK_RECIPIENT_PUBLIC_KEY =
  "2DCC44zP2BDxTKzgi4yYScEJmbyhW2G8aYCQUrEcABts";

// https://explorer.solana.com/tx/5e9xViaBigEX6G17PvHt9AizyJwRBHPdxCEkz2eLRYsanr53567SHzULhYT6zk63vbsZ4puN3WY7i5774HS7CneZ
export const transactionSendingFiveUSDCGlow = {
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
                mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
              },
              type: "getAccountDataSize",
            },
            program: "spl-token",
            programId: new PublicKey(
              "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            ),
          },
          {
            parsed: {
              info: {
                lamports: 2039280,
                newAccount: "45hv5bBaXX9vK2zbdsZq526iHjhEPgsF3mascJDFoSuS",
                owner: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
                source: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
                space: 165,
              },
              type: "createAccount",
            },
            program: "system",
            programId: new PublicKey("11111111111111111111111111111111"),
          },
          {
            parsed: {
              info: {
                account: "45hv5bBaXX9vK2zbdsZq526iHjhEPgsF3mascJDFoSuS",
              },
              type: "initializeImmutableOwner",
            },
            program: "spl-token",
            programId: new PublicKey(
              "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            ),
          },
          {
            parsed: {
              info: {
                account: "45hv5bBaXX9vK2zbdsZq526iHjhEPgsF3mascJDFoSuS",
                mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
                owner: "CnBEqiUpz9iK45GTsfu3Ckgp9jnjpoCNrRjSPSdQbqGs",
              },
              type: "initializeAccount3",
            },
            program: "spl-token",
            programId: new PublicKey(
              "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            ),
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
        mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        owner: "CnBEqiUpz9iK45GTsfu3Ckgp9jnjpoCNrRjSPSdQbqGs",
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        uiTokenAmount: {
          amount: "5000000",
          decimals: 6,
          uiAmount: 5,
          uiAmountString: "5",
        },
      },
      {
        accountIndex: 2,
        mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        owner: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
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
        mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
        owner: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
        programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
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
          pubkey: new PublicKey("5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM"),
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
          pubkey: new PublicKey("Tig6ugKWyQqyRgs8CeDCuC3AaenQzRJ5eVpmT5bboDc"),
          signer: false,
          source: "transaction",
          writable: true,
        },
        {
          pubkey: new PublicKey("11111111111111111111111111111111"),
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
          pubkey: new PublicKey("CnBEqiUpz9iK45GTsfu3Ckgp9jnjpoCNrRjSPSdQbqGs"),
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"),
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
          pubkey: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: new PublicKey("noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93"),
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
              mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
              source: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
              systemProgram: "11111111111111111111111111111111",
              tokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
              wallet: "CnBEqiUpz9iK45GTsfu3Ckgp9jnjpoCNrRjSPSdQbqGs",
            },
            type: "create",
          },
          program: "spl-associated-token-account",
          programId: new PublicKey(SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM),
        },
        {
          parsed: {
            info: {
              authority: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
              destination: "45hv5bBaXX9vK2zbdsZq526iHjhEPgsF3mascJDFoSuS",
              mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
              source: "Tig6ugKWyQqyRgs8CeDCuC3AaenQzRJ5eVpmT5bboDc",
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
          programId: new PublicKey(
            "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
          ),
        },
        {
          accounts: [
            new PublicKey("5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM"),
            new PublicKey("CnBEqiUpz9iK45GTsfu3Ckgp9jnjpoCNrRjSPSdQbqGs"),
          ],
          data: "AnWnJTR4tkAQv6QU6qhaVST1ddQ6CKYjbGFcr",
          programId: new PublicKey(
            "noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93"
          ),
        },
      ],
      recentBlockhash: "CjNQgjXsnJx77HHUk9QjPYZgz1J9jyUs8paaMAuQ2pVj",
    },
    signatures: [
      "5e9xViaBigEX6G17PvHt9AizyJwRBHPdxCEkz2eLRYsanr53567SHzULhYT6zk63vbsZ4puN3WY7i5774HS7CneZ",
    ],
  },
};

export const transactionResponseMakeAccountAndSend = {
  blockTime: 1668770097,
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
            programId: SPL_TOKEN_PROGRAM,
          },
          {
            parsed: {
              info: {
                lamports: 2039280,
                newAccount: "JBArixarujq7y213FLvnsuS9Wb28FgQeK55GZX7Dshvk",
                owner: SPL_TOKEN_PROGRAM,
                source: MIKES_WALLET,
                space: 165,
              },
              type: "createAccount",
            },
            program: "system",
            programId: "11111111111111111111111111111111",
          },
          {
            parsed: {
              info: {
                account: "JBArixarujq7y213FLvnsuS9Wb28FgQeK55GZX7Dshvk",
              },
              type: "initializeImmutableOwner",
            },
            program: "spl-token",
            programId: SPL_TOKEN_PROGRAM,
          },
          {
            parsed: {
              info: {
                account: "JBArixarujq7y213FLvnsuS9Wb28FgQeK55GZX7Dshvk",
                mint: USDC_MAINNET_MINT_ACCOUNT,
                owner: "23sV4gXUQBGsAdcHBJ4tRwApXF5Md5XyKwUitNQecgBD",
              },
              type: "initializeAccount3",
            },
            program: "spl-token",
            programId: SPL_TOKEN_PROGRAM,
          },
        ],
      },
    ],
    logMessages: [
      "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL invoke [1]",
      "Program log: Create",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
      "Program log: Instruction: GetAccountDataSize",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1622 of 588408 compute units",
      "Program return: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA pQAAAAAAAAA=",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program 11111111111111111111111111111111 invoke [2]",
      "Program 11111111111111111111111111111111 success",
      "Program log: Initialize the associated token account",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
      "Program log: Instruction: InitializeImmutableOwner",
      "Program log: Please upgrade to SPL Token 2022 for immutable owner support",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1405 of 581918 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
      "Program log: Instruction: InitializeAccount3",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4241 of 578034 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL consumed 26545 of 600000 compute units",
      "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL success",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]",
      "Program log: Instruction: TransferChecked",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 6199 of 573455 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93 invoke [1]",
      "Program noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93 consumed 737 of 567256 compute units",
      "Program noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93 success",
    ],
    postBalances: [
      447656226144, 2039280, 2039280, 1, 30000000, 731913600, 179719266068,
      1009200, 934087680, 1141440,
    ],
    postTokenBalances: [
      {
        accountIndex: 1,
        mint: USDC_MAINNET_MINT_ACCOUNT,
        owner: "23sV4gXUQBGsAdcHBJ4tRwApXF5Md5XyKwUitNQecgBD",
        programId: SPL_TOKEN_PROGRAM,
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
        programId: SPL_TOKEN_PROGRAM,
        uiTokenAmount: {
          amount: "5563485",
          decimals: 6,
          uiAmount: 5.563485,
          uiAmountString: "5.563485",
        },
      },
    ],
    preBalances: [
      447658270424, 0, 2039280, 1, 30000000, 731913600, 179719266068, 1009200,
      934087680, 1141440,
    ],
    preTokenBalances: [
      {
        accountIndex: 2,
        mint: USDC_MAINNET_MINT_ACCOUNT,
        owner: MIKES_WALLET,
        programId: SPL_TOKEN_PROGRAM,
        uiTokenAmount: {
          amount: "10563485",
          decimals: 6,
          uiAmount: 10.563485,
          uiAmountString: "10.563485",
        },
      },
    ],
    rewards: [],
    status: {
      Ok: null,
    },
  },
  slot: 161726839,
  transaction: {
    message: {
      accountKeys: [
        {
          pubkey: MIKES_WALLET,
          signer: true,
          source: "transaction",
          writable: true,
        },
        {
          pubkey: "JBArixarujq7y213FLvnsuS9Wb28FgQeK55GZX7Dshvk",
          signer: false,
          source: "transaction",
          writable: true,
        },
        {
          pubkey: "Tig6ugKWyQqyRgs8CeDCuC3AaenQzRJ5eVpmT5bboDc",
          signer: false,
          source: "transaction",
          writable: true,
        },
        {
          pubkey: "11111111111111111111111111111111",
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: "23sV4gXUQBGsAdcHBJ4tRwApXF5Md5XyKwUitNQecgBD",
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM,
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: USDC_MAINNET_MINT_ACCOUNT,
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: "SysvarRent111111111111111111111111111111111",
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: SPL_TOKEN_PROGRAM,
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: "noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93",
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
              account: "JBArixarujq7y213FLvnsuS9Wb28FgQeK55GZX7Dshvk",
              mint: USDC_MAINNET_MINT_ACCOUNT,
              source: MIKES_WALLET,
              systemProgram: "11111111111111111111111111111111",
              tokenProgram: SPL_TOKEN_PROGRAM,
              wallet: "23sV4gXUQBGsAdcHBJ4tRwApXF5Md5XyKwUitNQecgBD",
            },
            type: "create",
          },
          program: "spl-associated-token-account",
          programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM,
        },
        {
          parsed: {
            info: {
              authority: MIKES_WALLET,
              destination: "JBArixarujq7y213FLvnsuS9Wb28FgQeK55GZX7Dshvk",
              mint: USDC_MAINNET_MINT_ACCOUNT,
              source: "Tig6ugKWyQqyRgs8CeDCuC3AaenQzRJ5eVpmT5bboDc",
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
          programId: SPL_TOKEN_PROGRAM,
        },
        {
          accounts: [
            MIKES_WALLET,
            "23sV4gXUQBGsAdcHBJ4tRwApXF5Md5XyKwUitNQecgBD",
          ],
          data: "W8vHV872oMT2bNtBMWFVbVc3hBT6kgrczv",
          programId: "noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93",
        },
      ],
      recentBlockhash: "4Gx18ZfMCXGZYHWFYYAGUVhkqZRTPME4BQEuSj8yKfxn",
    },
    signatures: [
      "2Nqkv1E6ktnr93v3MqbdbYMZrPnMc5akgACdtfMyuaXZkVBX7JefkAjsxuLh9BexNfMEJJEhghPDfhEQLiMByVY",
    ],
  },
};

export const transactionResponseSenderComesFirst = {
  blockTime: 1663119635,
  meta: {
    err: null,
    fee: 5000,
    innerInstructions: [],
    logMessages: [
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]",
      "Program log: Instruction: Transfer",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 3199 of 200000 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
    ],
    postBalances: [999995000, 2039280, 2039280, 1],
    postTokenBalances: [
      {
        accountIndex: 1,
        mint: "kp2Fz8PctAEZd7Mk6XMhz5aZ7kxwvHBrvRfcaokLo6s",
        owner: MOCK_SENDER_PUBLIC_KEY,
        uiTokenAmount: {
          amount: "370",
          decimals: 2,
          uiAmount: 3.7,
          uiAmountString: "3.7",
        },
      },
      {
        accountIndex: 2,
        mint: "kp2Fz8PctAEZd7Mk6XMhz5aZ7kxwvHBrvRfcaokLo6s",
        owner: MOCK_RECIPIENT_PUBLIC_KEY,
        uiTokenAmount: {
          amount: "50",
          decimals: 2,
          uiAmount: 0.5,
          uiAmountString: "0.5",
        },
      },
    ],
    preBalances: [1000000000, 2039280, 2039280, 1],
    preTokenBalances: [
      {
        accountIndex: 1,
        mint: "kp2Fz8PctAEZd7Mk6XMhz5aZ7kxwvHBrvRfcaokLo6s",
        owner: MOCK_SENDER_PUBLIC_KEY,
        uiTokenAmount: {
          amount: "420",
          decimals: 2,
          uiAmount: 4.2,
          uiAmountString: "4.2",
        },
      },
      {
        accountIndex: 2,
        mint: "kp2Fz8PctAEZd7Mk6XMhz5aZ7kxwvHBrvRfcaokLo6s",
        owner: MOCK_RECIPIENT_PUBLIC_KEY,
        uiTokenAmount: {
          amount: "0",
          decimals: 2,
          uiAmount: null,
          uiAmountString: "0",
        },
      },
    ],
    rewards: [],
    status: {
      Ok: null,
    },
  },
  slot: 86144,
  transaction: {
    message: {
      accountKeys: [
        {
          pubkey: new PublicKey(MOCK_SENDER_PUBLIC_KEY),
          signer: true,
          writable: true,
        },
        {
          pubkey: new PublicKey("12dDNgiaFfebHtoZo1p43gYUPpnoPbHXngMSDBUbXwtf"),
          signer: false,
          writable: true,
        },
        {
          pubkey: new PublicKey("E477JFPCYqp5RyPNzeaCP1XP2ExaroBwufAwNPu17UVu"),
          signer: false,
          writable: true,
        },
        {
          pubkey: new PublicKey(SPL_TOKEN_PROGRAM),
          signer: false,
          writable: false,
        },
      ],
      instructions: [
        {
          parsed: {
            info: {
              amount: "50",
              authority: MOCK_SENDER_PUBLIC_KEY,
              destination: "E477JFPCYqp5RyPNzeaCP1XP2ExaroBwufAwNPu17UVu",
              source: "12dDNgiaFfebHtoZo1p43gYUPpnoPbHXngMSDBUbXwtf",
            },
            type: "transfer",
          },
          program: "spl-token",
          programId: new PublicKey(SPL_TOKEN_PROGRAM),
        },
      ],
      recentBlockhash: "5kVFBB8dLXho4YWUgCMP4c4Hrrrzor9RkcAciePWjgtf",
    },
    signatures: [
      "2PF9JkUYfARqWbxFv5fBNLK7VhQ9NTsSA5QYcUUNDTQZyX4JATE8TjnLBhoaMNsZ1F1ETUxmM8LUygqRUBtbhgFS",
    ],
  },
};

export const transactionResponseSenderComesSecond = {
  blockTime: 1663120787,
  meta: {
    err: null,
    fee: 5000,
    innerInstructions: [],
    logMessages: [
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]",
      "Program log: Instruction: Transfer",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 3199 of 200000 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
    ],
    postBalances: [999995000, 2039280, 2039280, 1],
    postTokenBalances: [
      {
        accountIndex: 1,
        mint: "3gQx1MzTPkfJCyr6grUrLZYXJ9vQKD2Vzbvnt8zLyW26",
        owner: MOCK_RECIPIENT_PUBLIC_KEY,
        uiTokenAmount: {
          amount: "50",
          decimals: 2,
          uiAmount: 0.5,
          uiAmountString: "0.5",
        },
      },
      {
        accountIndex: 2,
        mint: "3gQx1MzTPkfJCyr6grUrLZYXJ9vQKD2Vzbvnt8zLyW26",
        owner: MOCK_SENDER_PUBLIC_KEY,
        uiTokenAmount: {
          amount: "370",
          decimals: 2,
          uiAmount: 3.7,
          uiAmountString: "3.7",
        },
      },
    ],
    preBalances: [1000000000, 2039280, 2039280, 1],
    preTokenBalances: [
      {
        accountIndex: 1,
        mint: "3gQx1MzTPkfJCyr6grUrLZYXJ9vQKD2Vzbvnt8zLyW26",
        owner: MOCK_RECIPIENT_PUBLIC_KEY,
        uiTokenAmount: {
          amount: "0",
          decimals: 2,
          uiAmount: null,
          uiAmountString: "0",
        },
      },
      {
        accountIndex: 2,
        mint: "3gQx1MzTPkfJCyr6grUrLZYXJ9vQKD2Vzbvnt8zLyW26",
        owner: MOCK_SENDER_PUBLIC_KEY,
        uiTokenAmount: {
          amount: "420",
          decimals: 2,
          uiAmount: 4.2,
          uiAmountString: "4.2",
        },
      },
    ],
    rewards: [],
    status: {
      Ok: null,
    },
  },
  slot: 87296,
  transaction: {
    message: {
      accountKeys: [
        {
          pubkey: new PublicKey(MOCK_SENDER_PUBLIC_KEY),
          signer: true,
          writable: true,
        },
        {
          pubkey: new PublicKey("6ZyWQ1aA8Sbsz2oFyzNWmb6ik7Wy1Qz4CYuvRqGsTzwy"),
          signer: false,
          writable: true,
        },
        {
          pubkey: new PublicKey("FQbodcdPR23po6ePZPZDkp8EWdbYb3d9m27DFH3h6N94"),
          signer: false,
          writable: true,
        },
        {
          pubkey: new PublicKey(SPL_TOKEN_PROGRAM),
          signer: false,
          writable: false,
        },
      ],
      instructions: [
        {
          parsed: {
            info: {
              amount: "50",
              authority: MOCK_SENDER_PUBLIC_KEY,
              destination: "6ZyWQ1aA8Sbsz2oFyzNWmb6ik7Wy1Qz4CYuvRqGsTzwy",
              source: "FQbodcdPR23po6ePZPZDkp8EWdbYb3d9m27DFH3h6N94",
            },
            type: "transfer",
          },
          program: "spl-token",
          programId: new PublicKey(SPL_TOKEN_PROGRAM),
        },
      ],
      recentBlockhash: "78p2CW4M12K7CuZrH5YE2pT31K8oX4Q1nXew9BDAtDok",
    },
    signatures: [
      "3VsPLbEgjT2YTGp6PWXBDDc6kMFd4UwLHNWWNzjvf1QMutAihtDYzmfUY6Wdr2MffBDmNhP1YPR681d9Y9CgXe2V",
    ],
  },
};
export const mikeSendingHimselfMoneyTransaction = {
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

export const mikeSendingJaredSomeLamportsTransaction = {
  blockTime: 1662733089,
  meta: {
    err: null,
    fee: 5000,
    innerInstructions: [],
    logMessages: [
      "Program 11111111111111111111111111111111 invoke [1]",
      "Program 11111111111111111111111111111111 success",
    ],
    postBalances: [4630800, 30000000, 1],
    postTokenBalances: [],
    preBalances: [34635800, 0, 1],
    preTokenBalances: [],
    rewards: [],
    status: {
      Ok: null,
    },
  },
  slot: 149892413,
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
          pubkey: new PublicKey(YCOMBINATOR_DEMO_WALLET_FOR_JARED),
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
      ],
      addressTableLookups: null,
      instructions: [
        {
          parsed: {
            info: {
              destination: YCOMBINATOR_DEMO_WALLET_FOR_JARED,
              lamports: 30000000,
              source: MIKES_WALLET,
            },
            type: "transfer",
          },
          program: "system",
          programId: new PublicKey(SOLANA_SYSTEM_PROGRAM),
        },
      ],
      recentBlockhash: "BU6JsZVcu75QzX1PCkcemSvdJ2vNSj4zVyfbkqwoss3q",
    },
    signatures: [
      "5KKQASDKTxoViRWYzN7Rf8X9n3wiiNVztpgpNG1oyyZbkNiai1JVcD4rAV2XYzFPgRP4dXQv7A3Bku68UT4j2FZk",
    ],
  },
};
export const sendingLamportsWithNoteTransaction = {
  blockTime: 1665584732,
  meta: {
    err: null,
    fee: 5000,
    innerInstructions: [],
    logMessages: [
      "Program 11111111111111111111111111111111 invoke [1]",
      "Program 11111111111111111111111111111111 success",
      "Program noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93 invoke [1]",
      "Program noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93 consumed 486 of 400000 compute units",
      "Program noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93 success",
    ],
    postBalances: [364512941, 100000000, 1, 1141440],
    postTokenBalances: [],
    preBalances: [464517941, 0, 1, 1141440],
    preTokenBalances: [],
    rewards: [],
    status: {
      Ok: null,
    },
  },
  slot: 154968700,
  transaction: {
    message: {
      accountKeys: [
        {
          pubkey: new PublicKey("FSVgrW58amFmH91ZKBic686qVhHayMt3wS8bCpisUph9"),
          signer: true,
          source: "transaction",
          writable: true,
        },
        {
          pubkey: new PublicKey("8N7ek7FydYYt7GfhM8a3PLjj1dh9fTftdVLHnbJdThe7"),
          signer: false,
          source: "transaction",
          writable: true,
        },
        {
          pubkey: new PublicKey("11111111111111111111111111111111"),
          signer: false,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: new PublicKey("noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93"),
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
              destination: "8N7ek7FydYYt7GfhM8a3PLjj1dh9fTftdVLHnbJdThe7",
              lamports: 100000000,
              source: "FSVgrW58amFmH91ZKBic686qVhHayMt3wS8bCpisUph9",
            },
            type: "transfer",
          },
          program: "system",
          programId: new PublicKey("11111111111111111111111111111111"),
        },
        {
          accounts: ["FSVgrW58amFmH91ZKBic686qVhHayMt3wS8bCpisUph9"],
          data: "6gSyHNFjBXyEDMuyiCeg8zGC2Rm353osfgQBegM11Qe8",
          programId: new PublicKey(
            "noteD9tEFTDH1Jn9B1HbpoC7Zu8L9QXRo7FjZj3PT93"
          ),
        },
      ],
      recentBlockhash: "2USXPRQx9uvLHByd18QqdyXHYPuogwgDRdoqyeadmSfU",
    },
    signatures: [
      "PdX96DWpeMRqjxP7tQHU7aVMkjongnQz7mmkLPmvtezvWoJzqnVfJpYu3xxmRWSTngKDQ9A7a4UP4s4Tj463jr4",
    ],
  },
};

export const transactionWithMemo = {
  blockTime: 1665683493,
  meta: {
    err: null,
    fee: 5000,
    innerInstructions: [],
    logMessages: [
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]",
      "Program log: Instruction: Transfer",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4644 of 400000 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr invoke [1]",
      "Program log: Signed by 5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
      'Program log: Memo (len 10): "basketball"',
      "Program MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr consumed 18677 of 395356 compute units",
      "Program MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr success",
    ],
    postBalances: [2506520, 2039280, 2039280, 521498880, 934087680],
    postTokenBalances: [
      {
        accountIndex: 1,
        mint: USDC_MAINNET_MINT_ACCOUNT,
        owner: "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG",
        programId: SPL_TOKEN_PROGRAM,
        uiTokenAmount: {
          amount: "7430220",
          decimals: 6,
          uiAmount: 7.43022,
          uiAmountString: "7.43022",
        },
      },
      {
        accountIndex: 2,
        mint: USDC_MAINNET_MINT_ACCOUNT,
        owner: MIKES_WALLET,
        programId: SPL_TOKEN_PROGRAM,
        uiTokenAmount: {
          amount: "12863485",
          decimals: 6,
          uiAmount: 12.863485,
          uiAmountString: "12.863485",
        },
      },
    ],
    preBalances: [2511520, 2039280, 2039280, 521498880, 934087680],
    preTokenBalances: [
      {
        accountIndex: 1,
        mint: USDC_MAINNET_MINT_ACCOUNT,
        owner: "6PCANXw778iMrBzLUVK4c9q6Xc2X9oRUCvLoa4tfsLWG",
        programId: SPL_TOKEN_PROGRAM,
        uiTokenAmount: {
          amount: "7220220",
          decimals: 6,
          uiAmount: 7.22022,
          uiAmountString: "7.22022",
        },
      },
      {
        accountIndex: 2,
        mint: USDC_MAINNET_MINT_ACCOUNT,
        owner: MIKES_WALLET,
        programId: SPL_TOKEN_PROGRAM,
        uiTokenAmount: {
          amount: "13073485",
          decimals: 6,
          uiAmount: 13.073485,
          uiAmountString: "13.073485",
        },
      },
    ],
    rewards: [],
    status: {
      Ok: null,
    },
  },
  slot: 155156751,
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
          pubkey: new PublicKey("Bz2GC7qwvrQDLnhHvysYpbGsLPMtJmC4bWQZQqs9Hb8N"),
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
          pubkey: new PublicKey(MEMO_PROGRAM),
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
              amount: "210000",
              authority: MIKES_WALLET,
              destination: "Bz2GC7qwvrQDLnhHvysYpbGsLPMtJmC4bWQZQqs9Hb8N",
              source: MIKES_USDC_ACCOUNT,
            },
            type: "transfer",
          },
          program: "spl-token",
          programId: new PublicKey(SPL_TOKEN_PROGRAM),
        },
        {
          parsed: "basketball",
          program: "spl-memo",
          programId: new PublicKey(MEMO_PROGRAM),
        },
      ],
      recentBlockhash: "BtkKAM3cfvNfjWM3rR2DkRvM4cW6zRsTGYhyKzZJuABk",
    },
    signatures: [
      "3JRTJXcdu17Br4wFG2RmrYWyueEjHTQXPY8kt9rzM9AM7outauUNLcxAs5yjSFsEvaXbwa4fJVwPyG5srgK8cySM",
    ],
  },
};
