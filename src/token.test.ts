import {
  getMint,
  getAccount,
  Account,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { USD_DECIMALS, SECONDS, DEPOSIT } from "./constants";
import { log } from "./functions";
import {
  createMintAccount,
  createTokenAccount,
  mintTokens,
  makeTokenAccount,
} from "./tokens";
import {
  connect,
  putSolIntoWallet,
  checkAccountExists,
  getAccountBalance,
} from "./vmwallet";

const ENOUGH_TO_MAKE_A_NEW_TOKEN = 1_000_000_000;

// Quiet functions.log() during tests
jest.mock("./functions", () => ({
  ...jest.requireActual("./functions"),
  log: jest.fn(),
}));

describe("minting", () => {
  let connection: Connection;
  let testUSDCAuthority: Keypair;
  let mintAccountPublicKey: PublicKey;
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

      mintAccountPublicKey = await createMintAccount(
        connection,
        testUSDCAuthority,
        testUSDCAuthority.publicKey
      );
      const doesMintAccountExist = await checkAccountExists(
        connection,
        mintAccountPublicKey
      );
      expect(doesMintAccountExist).toBeTruthy();

      let mintInformation = await getMint(connection, mintAccountPublicKey);

      expect(mintInformation).toEqual({
        address: expect.any(PublicKey),
        decimals: USD_DECIMALS,
        freezeAuthority: null,
        isInitialized: true,
        mintAuthority: testUSDCAuthority.publicKey,
        // Tokens when initially created by spl-token have no supply
        supply: 0n,
      });
    },
    30 * SECONDS
  );

  test(`getOrCreateAssociatedTokenAddress makes a token account`, async () => {
    tokenAccount = await createTokenAccount(
      connection,
      mintAccountPublicKey,
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
      mint: mintAccountPublicKey,
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
      mintAccountPublicKey,
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

  test(`Can make a token account for our test user`, async () => {
    const recipient = new Keypair();
    await putSolIntoWallet(connection, recipient.publicKey, 1_000_000_000);

    const balanceOfPayerBeforeMakingRecipientTokenAccount =
      await connection.getBalance(testUSDCAuthority.publicKey);

    const recipientTokenAccount = await makeTokenAccount(
      connection,
      testUSDCAuthority,
      mintAccountPublicKey,
      recipient
    );

    log(`Made associated token account`, recipientTokenAccount);

    expect(recipientTokenAccount).toBeTruthy();

    const balanceOfPayerAfterMakingRecipientTokenAccount =
      await connection.getBalance(testUSDCAuthority.publicKey);

    log(
      `Balance of token account`,
      balanceOfPayerBeforeMakingRecipientTokenAccount,
      balanceOfPayerAfterMakingRecipientTokenAccount
    );

    const costOfMakingBobsTokenAccount =
      balanceOfPayerBeforeMakingRecipientTokenAccount -
      balanceOfPayerAfterMakingRecipientTokenAccount;

    const EXPECTED_COST_TO_MAKE_ACCOUNT = 2_044_280;

    expect(costOfMakingBobsTokenAccount).toEqual(EXPECTED_COST_TO_MAKE_ACCOUNT);
  });
});
