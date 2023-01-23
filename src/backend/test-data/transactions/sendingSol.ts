import { PublicKey } from "@solana/web3.js";
import {
  MIKES_WALLET,
  YCOMBINATOR_DEMO_WALLET_FOR_JARED,
  SOLANA_SYSTEM_PROGRAM,
  MEMO_PROGRAM,
  MIKES_USDC_ACCOUNT,
  SPL_TOKEN_PROGRAM,
  USDC_MAINNET_MINT_ACCOUNT,
  PORTAL_IDENTITY_TOKEN_ISSUER_WALLET,
  VAHEHS_WALLET,
  JOHN_TESTUSER_DEMO_WALLET,
  NOTE_PROGRAM,
} from "../../constants";

export const sendingSol = {
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
          programId: new PublicKey(new PublicKey(SOLANA_SYSTEM_PROGRAM)),
        },
      ],
      recentBlockhash: "BU6JsZVcu75QzX1PCkcemSvdJ2vNSj4zVyfbkqwoss3q",
    },
    signatures: [
      "5KKQASDKTxoViRWYzN7Rf8X9n3wiiNVztpgpNG1oyyZbkNiai1JVcD4rAV2XYzFPgRP4dXQv7A3Bku68UT4j2FZk",
    ],
  },
};

export const sendingSolWithNote = {
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
          pubkey: new PublicKey(PORTAL_IDENTITY_TOKEN_ISSUER_WALLET),
          signer: true,
          source: "transaction",
          writable: true,
        },
        {
          pubkey: new PublicKey(JOHN_TESTUSER_DEMO_WALLET),
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
              destination: JOHN_TESTUSER_DEMO_WALLET,
              lamports: 100000000,
              source: PORTAL_IDENTITY_TOKEN_ISSUER_WALLET,
            },
            type: "transfer",
          },
          program: "system",
          programId: new PublicKey(new PublicKey(SOLANA_SYSTEM_PROGRAM)),
        },
        {
          accounts: [PORTAL_IDENTITY_TOKEN_ISSUER_WALLET],
          data: "6gSyHNFjBXyEDMuyiCeg8zGC2Rm353osfgQBegM11Qe8",
          programId: new PublicKey(NOTE_PROGRAM),
        },
      ],
      recentBlockhash: "2USXPRQx9uvLHByd18QqdyXHYPuogwgDRdoqyeadmSfU",
    },
    signatures: [
      "PdX96DWpeMRqjxP7tQHU7aVMkjongnQz7mmkLPmvtezvWoJzqnVfJpYu3xxmRWSTngKDQ9A7a4UP4s4Tj463jr4",
    ],
  },
};

export const sendingSolWithMemo = {
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
        owner: VAHEHS_WALLET,
        programId: new PublicKey(SPL_TOKEN_PROGRAM),
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
        programId: new PublicKey(SPL_TOKEN_PROGRAM),
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
        owner: VAHEHS_WALLET,
        programId: new PublicKey(SPL_TOKEN_PROGRAM),
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
        programId: new PublicKey(SPL_TOKEN_PROGRAM),
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
          programId: new PublicKey(new PublicKey(SPL_TOKEN_PROGRAM)),
        },
        {
          parsed: "basketball",
          program: "spl-memo",
          programId: new PublicKey(new PublicKey(MEMO_PROGRAM)),
        },
      ],
      recentBlockhash: "BtkKAM3cfvNfjWM3rR2DkRvM4cW6zRsTGYhyKzZJuABk",
    },
    signatures: [
      "3JRTJXcdu17Br4wFG2RmrYWyueEjHTQXPY8kt9rzM9AM7outauUNLcxAs5yjSFsEvaXbwa4fJVwPyG5srgK8cySM",
    ],
  },
};
