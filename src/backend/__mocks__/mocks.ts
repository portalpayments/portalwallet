import { PublicKey } from "@solana/web3.js";
import type { writable } from "svelte/store";
import {
  MIKES_USDC_ACCOUNT,
  MIKES_WALLET,
  SOLANA_SYSTEM_PROGRAM,
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
