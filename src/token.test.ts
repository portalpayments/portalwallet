import { getMint, getAccount, Account } from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { USD_DECIMALS, SECONDS } from "./constants";
import { createMintAccount, createTokenAccount, mintTokens } from "./tokens";
import { connect, putSolIntoWallet, checkAccountExists } from "./vmwallet";

const ENOUGH_TO_MAKE_A_NEW_TOKEN = 1_000_000_000;

// Quiet functions.log() during tests
jest.mock("./functions", () => ({
  ...jest.requireActual("./functions"),
  log: jest.fn(),
}));

describe("minting", () => {
  let connection: Connection;
  let testUSDCAuthority: Keypair;
  let mintAccount: PublicKey;
  let tokenAccount: Account;
  beforeAll(async () => {
    connection = await connect("localhost");
  });
  test(
    `createNewToken makes a mint account and new tokens`,
    async () => {
      testUSDCAuthority = new Keypair();
      await putSolIntoWallet(
        connection,
        testUSDCAuthority.publicKey,
        ENOUGH_TO_MAKE_A_NEW_TOKEN
      );

      mintAccount = await createMintAccount(
        connection,
        testUSDCAuthority,
        testUSDCAuthority.publicKey
      );
      const doesMintAccountExist = await checkAccountExists(
        connection,
        mintAccount
      );
      expect(doesMintAccountExist).toBeTruthy();

      let mintInformation = await getMint(connection, mintAccount);

      expect(mintInformation).toEqual({
        address: expect.any(PublicKey),
        decimals: USD_DECIMALS,
        freezeAuthority: null,
        isInitialized: true,
        mintAuthority: testUSDCAuthority.publicKey,
        supply: expect.any(BigInt),
      });
    },
    30 * SECONDS
  );

  test(`getOrCreateAssociatedTokenAddress makes a token account`, async () => {
    tokenAccount = await createTokenAccount(
      connection,
      mintAccount,
      testUSDCAuthority,
      testUSDCAuthority.publicKey
    );

    expect(tokenAccount.address).toBeInstanceOf(PublicKey);

    const tokenAccountInformation = await getAccount(
      connection,
      tokenAccount.address
    );

    expect(tokenAccountInformation).toEqual({
      address: tokenAccount.address,
      amount: expect.any(BigInt),
      closeAuthority: null,
      delegate: null,
      delegatedAmount: expect.any(BigInt),
      isFrozen: false,
      isInitialized: true,
      isNative: false, // It's an SPL token, not Sol.
      mint: mintAccount,
      owner: testUSDCAuthority.publicKey,
      rentExemptReserve: null,
    });

    let tokenAmount = await connection.getTokenAccountBalance(
      tokenAccount.address
    );

    const NO_TOKENS_MINTED_YET = 0;
    expect(tokenAmount).toEqual({
      context: {
        slot: expect.any(Number),
      },
      value: {
        amount: String(NO_TOKENS_MINTED_YET),
        decimals: USD_DECIMALS,
        uiAmount: NO_TOKENS_MINTED_YET,
        uiAmountString: String(NO_TOKENS_MINTED_YET),
      },
    });
  });

  test(`Can mint tokens`, async () => {
    const MINT_AMOUNT = 420;
    const MINT_AMOUNT_UI = 4.2;

    const transactionHash = await mintTokens(
      connection,
      testUSDCAuthority,
      mintAccount,
      tokenAccount.address,
      testUSDCAuthority.publicKey,
      MINT_AMOUNT
    );

    expect(transactionHash).toEqual(expect.any(String));

    let tokenAmount = await connection.getTokenAccountBalance(
      tokenAccount.address
    );

    expect(tokenAmount).toEqual({
      context: {
        slot: expect.any(Number),
      },
      value: {
        amount: String(MINT_AMOUNT),
        decimals: USD_DECIMALS,
        uiAmount: MINT_AMOUNT_UI,
        uiAmountString: String(MINT_AMOUNT_UI),
      },
    });
  });

  // test(`Can send tokens to our test user`, async () => {
  //   const testUser = new Keypair();
  //   const x = sendUSDCTokens(connection, tokenAccount, testUser, 69);

  //   const accountBalance = await getAccountBalance(
  //     connection,
  //     testUser.publicKey
  //   );
  //   expect(accountBalance).toEqual(DEPOSIT);
  // });
});
