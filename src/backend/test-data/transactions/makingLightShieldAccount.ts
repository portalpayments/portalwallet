import { PublicKey } from "@solana/web3.js";
import { LIGHT_PROGRAM } from "../../constants";

export const makingLightShieldAccount = {
  blockTime: 1673461335,
  meta: {
    err: null,
    fee: 5000,
    innerInstructions: [],
    logMessages: [
      "Program 11111111111111111111111111111111 invoke [1]",
      "Program 11111111111111111111111111111111 success",
      "Program 2c54pLrGpQdGxJWUAoME6CReBrtDbsx5Tqx4nLZZo6av invoke [1]",
      "Program 2c54pLrGpQdGxJWUAoME6CReBrtDbsx5Tqx4nLZZo6av consumed 3011 of 400000 compute units",
      "Program 2c54pLrGpQdGxJWUAoME6CReBrtDbsx5Tqx4nLZZo6av success",
    ],
    postBalances: [146922253904, 1572960, 1, 1141440, 1009200],
    postTokenBalances: [],
    preBalances: [146923831864, 0, 1, 1141440, 1009200],
    preTokenBalances: [],
    rewards: [],
    status: {
      Ok: null,
    },
  },
  slot: 171973996,
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
          pubkey: new PublicKey("7ePbj5NeQsjQQ8pRd6H62XfktbytpCicbEAzhiyNYjkL"),
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
          pubkey: new PublicKey(LIGHT_PROGRAM),
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
      ],
      addressTableLookups: null,
      instructions: [
        {
          parsed: {
            info: {
              base: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
              lamports: 1572960,
              newAccount: "7ePbj5NeQsjQQ8pRd6H62XfktbytpCicbEAzhiyNYjkL",
              owner: LIGHT_PROGRAM,
              seed: "lightLookup",
              source: "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
              space: 98,
            },
            type: "createAccountWithSeed",
          },
          program: "system",
          programId: new PublicKey("11111111111111111111111111111111"),
        },
        {
          accounts: [
            "5FHwkrdxntdK24hgQU8qgBjn35Y1zwhz1GZwCkP2UJnM",
            "7ePbj5NeQsjQQ8pRd6H62XfktbytpCicbEAzhiyNYjkL",
            "SysvarRent111111111111111111111111111111111",
          ],
          data: "11111111g14VBrqegAkHgkiR4WUVZojNLdG7TTaQN3UbQ3dLWakrsiKABgiq715d2wfx4ZLkoGNTmrJ9ShLaeZmJV9psFNfkNs",
          programId: new PublicKey(LIGHT_PROGRAM),
        },
      ],
      recentBlockhash: "B7rHvsrW7NBmYAi8bHDTFGgXXYDtXB3vaG5V3ynjR4ad",
    },
    signatures: [
      "5egDQUg2pvuTyvdyEnUVmQg3zXr2ZrLWAC33rS7rDxmWJGuprohY8Bj25PAfpwyN3iT6KU5eFg9AojBgC1dRxsq8",
    ],
  },
  version: "legacy",
};
