import { PublicKey } from "@solana/web3.js";
import {
  MIKES_WALLET,
  SOLANA_SYSTEM_PROGRAM,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM,
  SPL_TOKEN_PROGRAM,
} from "../../constants";

export const sendingUSDH = {
  blockTime: 1667306128,
  meta: {
    err: null,
    fee: 10000,
    innerInstructions: [
      {
        index: 0,
        instructions: [
          {
            parsed: {
              info: {
                extensionTypes: ["immutableOwner"],
                mint: "USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX",
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
                newAccount: "6TE68teBQqydhWDze8MzUsySWo926Hs5nFSTXVFszx2",
                owner: SPL_TOKEN_PROGRAM,
                source: "4DEUD7bafTTotDQ2mroQCdDp4hYLXCepuw4xyzZXUSXu",
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
                account: "6TE68teBQqydhWDze8MzUsySWo926Hs5nFSTXVFszx2",
              },
              type: "initializeImmutableOwner",
            },
            program: "spl-token",
            programId: new PublicKey(SPL_TOKEN_PROGRAM),
          },
          {
            parsed: {
              info: {
                account: "6TE68teBQqydhWDze8MzUsySWo926Hs5nFSTXVFszx2",
                mint: "USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX",
                owner: MIKES_WALLET,
              },
              type: "initializeAccount3",
            },
            program: "spl-token",
            programId: new PublicKey(SPL_TOKEN_PROGRAM),
          },
        ],
      },
    ],
    logMessages: [
      "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL invoke [1]",
      "Program log: Create",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
      "Program log: Instruction: GetAccountDataSize",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1595 of 394408 compute units",
      "Program return: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA pQAAAAAAAAA=",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program 11111111111111111111111111111111 invoke [2]",
      "Program 11111111111111111111111111111111 success",
      "Program log: Initialize the associated token account",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
      "Program log: Instruction: InitializeImmutableOwner",
      "Program log: Please upgrade to SPL Token 2022 for immutable owner support",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 1405 of 387945 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [2]",
      "Program log: Instruction: InitializeAccount3",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4214 of 384061 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
      "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL consumed 20491 of 400000 compute units",
      "Program ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL success",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]",
      "Program log: Instruction: Transfer",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA consumed 4645 of 379509 compute units",
      "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success",
    ],
    postBalances: [
      10719280800, 0, 2039280, 2039280, 1, 2476520, 731913600, 1009200,
      934087680, 1461600,
    ],
    postTokenBalances: [
      {
        accountIndex: 2,
        mint: "USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX",
        owner: MIKES_WALLET,
        programId: new PublicKey(SPL_TOKEN_PROGRAM),
        uiTokenAmount: {
          amount: "1000000",
          decimals: 6,
          uiAmount: 1,
          uiAmountString: "1",
        },
      },
      {
        accountIndex: 3,
        mint: "USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX",
        owner: "BfkRD3gGQGLjHxUw7oqhizkaxrDrw7itHT98f9j2gh6t",
        programId: new PublicKey(SPL_TOKEN_PROGRAM),
        uiTokenAmount: {
          amount: "0",
          decimals: 6,
          uiAmount: null,
          uiAmountString: "0",
        },
      },
    ],
    preBalances: [
      10721330080, 0, 0, 2039280, 1, 2476520, 731913600, 1009200, 934087680,
      1461600,
    ],
    preTokenBalances: [
      {
        accountIndex: 3,
        mint: "USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX",
        owner: "BfkRD3gGQGLjHxUw7oqhizkaxrDrw7itHT98f9j2gh6t",
        programId: new PublicKey(SPL_TOKEN_PROGRAM),
        uiTokenAmount: {
          amount: "1000000",
          decimals: 6,
          uiAmount: 1,
          uiAmountString: "1",
        },
      },
    ],
    rewards: [],
    status: {
      Ok: null,
    },
  },
  slot: 158652634,
  transaction: {
    message: {
      accountKeys: [
        {
          pubkey: new PublicKey("4DEUD7bafTTotDQ2mroQCdDp4hYLXCepuw4xyzZXUSXu"),
          signer: true,
          source: "transaction",
          writable: true,
        },
        {
          pubkey: new PublicKey("BfkRD3gGQGLjHxUw7oqhizkaxrDrw7itHT98f9j2gh6t"),
          signer: true,
          source: "transaction",
          writable: false,
        },
        {
          pubkey: new PublicKey("6TE68teBQqydhWDze8MzUsySWo926Hs5nFSTXVFszx2"),
          signer: false,
          source: "transaction",
          writable: true,
        },
        {
          pubkey: new PublicKey("ELbj3dfQsN1Hb3mqjd9LnDjfPMW2QnoxKtaL2WkXeWY5"),
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
          pubkey: new PublicKey(MIKES_WALLET),
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
          pubkey: new PublicKey("USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX"),
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
              account: "6TE68teBQqydhWDze8MzUsySWo926Hs5nFSTXVFszx2",
              mint: "USDH1SM1ojwWUga67PGrgFWUHibbjqMvuMaDkRJTgkX",
              rentSysvar: "SysvarRent111111111111111111111111111111111",
              source: "4DEUD7bafTTotDQ2mroQCdDp4hYLXCepuw4xyzZXUSXu",
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
              amount: "1000000",
              authority: "BfkRD3gGQGLjHxUw7oqhizkaxrDrw7itHT98f9j2gh6t",
              destination: "6TE68teBQqydhWDze8MzUsySWo926Hs5nFSTXVFszx2",
              source: "ELbj3dfQsN1Hb3mqjd9LnDjfPMW2QnoxKtaL2WkXeWY5",
            },
            type: "transfer",
          },
          program: "spl-token",
          programId: new PublicKey(SPL_TOKEN_PROGRAM),
        },
      ],
      recentBlockhash: "Gz36swvExGLXaUQEhaqJzgymNA8oyukSbrcv1RGJaDFn",
    },
    signatures: [
      "4gknQh12svZHqrZN9sKCHetaP87TbPns6pd83jknZPA3vEjN7jQ53sA3xpVs7ZH2oeCKnjrgHDqVMMxf3vBMoTwz",
      "4NN6Zzzzzma1qD38k8WokFQ9qrnAP6TRLuWm17R7u59yZJKA7RjKoJWYe5rfJ1Ya7T9zSzkNZY31JkkZ36NbnXZ1",
    ],
  },
};
