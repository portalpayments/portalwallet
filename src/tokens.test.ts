import {
  getMint,
  getAccount,
  Account,
  getOrCreateAssociatedTokenAccount,
  transfer,
  AccountLayout,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { USD_DECIMALS, SECONDS, DEPOSIT } from "./constants";
import { getABetterErrorMessage } from "./errors";
import { log, stringify, deepClone } from "./functions";
import {
  createMintAccount,
  createTokenAccount,
  mintTokens,
  makeTokenAccount,
  sendUSDC,
} from "./tokens";
import {
  connect,
  putSolIntoWallet,
  checkAccountExists,
  getAccountBalance,
} from "./vmwallet";

const ENOUGH_TO_MAKE_A_NEW_TOKEN = 1_000_000_000;

const AMOUNT_OF_USDC_TO_SEND = 50;

// Quiet functions.log() during tests
jest.mock("./functions", () => ({
  ...jest.requireActual("./functions"),
  log: jest.fn(),
}));

describe("minting", () => {
  let connection: Connection;
  let testUSDCAuthority: Keypair;
  let mintAccountPublicKey: PublicKey;
  const alice = new Keypair();
  const bob = new Keypair();
  let alicesTokenAccount: Account;
  let bobsTokenAccount: Account;
  beforeAll(async () => {
    connection = await connect("localhost");
  });

  afterAll(async () => {
    // Close connection?
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

  test(`we can make a token account for Alice`, async () => {
    alicesTokenAccount = await createTokenAccount(
      connection,
      mintAccountPublicKey,
      testUSDCAuthority,
      alice.publicKey
    );

    expect(alicesTokenAccount.address).toBeInstanceOf(PublicKey);

    const alicesTokenAccountInformation = await getAccount(
      connection,
      alicesTokenAccount.address
    );

    expect(alicesTokenAccountInformation).toEqual({
      address: alicesTokenAccount.address,
      amount: 0n,
      closeAuthority: null,
      delegate: null,
      delegatedAmount: 0n,
      isFrozen: false,
      isInitialized: true,
      isNative: false, // It's an SPL token, not Sol.
      mint: mintAccountPublicKey,
      owner: alice.publicKey,
      rentExemptReserve: null,
    });

    // TODO: not sure if we need to do this as we already have .amount above - we should check later once we have transfers working
    let tokenAmount = await connection.getTokenAccountBalance(
      alicesTokenAccount.address
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

  test(`Can mint tokens into Alice's token account`, async () => {
    const MINT_AMOUNT = 420;
    const MINT_AMOUNT_UI = 4.2;

    const transactionHash = await mintTokens(
      connection,
      testUSDCAuthority,
      mintAccountPublicKey,
      alicesTokenAccount.address,
      testUSDCAuthority.publicKey,
      MINT_AMOUNT
    );

    expect(transactionHash).toEqual(expect.any(String));

    let alicesTokens = await connection.getTokenAccountBalance(
      alicesTokenAccount.address
    );

    expect(alicesTokens).toEqual({
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

  test(`Can make a token account for bob`, async () => {
    await putSolIntoWallet(connection, bob.publicKey, 1_000_000_000);

    const balanceOfPayerBeforeMakingRecipientTokenAccount =
      await connection.getBalance(testUSDCAuthority.publicKey);

    bobsTokenAccount = await makeTokenAccount(
      connection,
      testUSDCAuthority,
      mintAccountPublicKey,
      bob
    );

    log(
      `🆕 Made associated token account for Bob at address ${bobsTokenAccount.address}`
    );

    expect(bobsTokenAccount).toBeTruthy();

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

  test(`Can send token from Alice's token account to Bob's token account`, async () => {
    // Alice needs some money to make Bob's token account
    await putSolIntoWallet(
      connection,
      alice.publicKey,
      ENOUGH_TO_MAKE_A_NEW_TOKEN
    );

    const signature = await sendUSDC(
      connection,
      alice,
      alicesTokenAccount,
      bobsTokenAccount,
      AMOUNT_OF_USDC_TO_SEND
    );

    expect(signature);
  });

  test(`Can find Mike's USDC account from his regular account`, async () => {
    // See https://solana.stackexchange.com/questions/1685/how-do-i-prevent-open-handles-issues-when-using-the-solana-connection-object
    let parsedTokenAccountsByOwner =
      await connection.getParsedTokenAccountsByOwner(bob.publicKey, {
        mint: mintAccountPublicKey,
      });

    const firstAccount = parsedTokenAccountsByOwner.value[0];

    expect(firstAccount).toEqual({
      // Bob's first (and only) USDC account
      account: {
        data: {
          parsed: {
            info: {
              isNative: false,
              // This is a USDC account
              mint: mintAccountPublicKey.toString(),
              // It is owned by Bob
              owner: bob.publicKey.toString(),
              state: "initialized",
              tokenAmount: {
                // Bob has recievd the fifty cents
                amount: String(AMOUNT_OF_USDC_TO_SEND),
                decimals: 2,
                uiAmount: AMOUNT_OF_USDC_TO_SEND / 100,
                uiAmountString: String(AMOUNT_OF_USDC_TO_SEND / 100),
              },
            },
            type: "account",
          },
          program: "spl-token",
          space: 165,
        },
        executable: false,
        lamports: 2039280,
        // The SPL token program
        owner: TOKEN_PROGRAM_ID,
        rentEpoch: expect.any(Number),
      },
      // Tested above
      pubkey: bobsTokenAccount.address,
    });
  });

  test(`Get all Bob's token accounts`, async () => {
    // See https://solana.stackexchange.com/questions/1685/how-do-i-prevent-open-handles-issues-when-using-the-solana-connection-object
    const tokenAccounts = await connection.getTokenAccountsByOwner(
      bob.publicKey,
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );

    const tokenAccount = tokenAccounts.value[0];
    const rawAccount = AccountLayout.decode(tokenAccount.account.data);
    expect(rawAccount.mint).toEqual(mintAccountPublicKey);
    expect(rawAccount.amount).toEqual(50n);
  });
});
