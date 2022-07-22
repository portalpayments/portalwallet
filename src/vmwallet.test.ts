import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  connect,
  convertPhraseToSeed,
  getAccountBalance,
  putSolIntoWallet,
  sendUSDCTokens,
  seedToKeypairs,
  createNewToken,
  checkAccountExists,
  getOrCreateAssociatedTokenAddress,
} from "./vmwallet";

import { deepClone, log, stringify } from "./functions";
import { expectedCleanedPhrase } from "./__mocks__/mocks";
import { getAccount, getMint } from "@solana/spl-token";
import { getABetterErrorMessage } from "./errors";
import { SECONDS } from "./constants";

const firstName = `Joe`;
const lastName = `Cottoneye`;

// Quiet functions.log() during tests
jest.mock("./functions", () => ({
  ...jest.requireActual("./functions"),
  log: jest.fn(),
}));

const fullName = `${firstName} ${lastName}`;
const password = `${new Date().toString()}`;

// TODO: reducing this to 1_000 makes wallets not visible
// which seems to be the rent requirement -
// see https://docs.solana.com/developing/programming-model/accounts#rent
// but too many lamports may hit airdrop limit for some test networks.
const DEPOSIT = 1_000_000;
// Likewise 1_000_000 isn't enough to make a new token
const NOT_ENOUGH_TO_MAKE_A_NEW_TOKEN = 1_000_000;
const ENOUGH_TO_MAKE_A_NEW_TOKEN = 1_000_000_000;

describe(`restoration`, () => {
  let connection: Connection;
  let keypairs: Array<Keypair>;
  beforeAll(async () => {
    connection = await connect("localhost");
  });

  afterAll(async () => {
    // TODO: close connection?
  });
  test(`wallets can be created`, async () => {
    const seed = await convertPhraseToSeed(expectedCleanedPhrase, fullName);
    keypairs = await seedToKeypairs(seed, password);

    // IMPORTANT: if we don't deposit any Sol the wallet won't exist
    const firstWallet = keypairs[0];
    await putSolIntoWallet(connection, firstWallet.publicKey, DEPOSIT);

    const accountBalance = await getAccountBalance(
      connection,
      firstWallet.publicKey
    );
    expect(accountBalance).toEqual(DEPOSIT);
  });

  test(`wallets can be restored using their seed phrases`, async () => {
    const firstWallet = keypairs[0];
    const balanceBefore = await getAccountBalance(
      connection,
      firstWallet.publicKey
    );
    await putSolIntoWallet(connection, firstWallet.publicKey, DEPOSIT);
    const balanceAfter = await getAccountBalance(
      connection,
      firstWallet.publicKey
    );

    const difference = balanceAfter - balanceBefore;
    expect(difference).toEqual(DEPOSIT);
  });

  test(`custom program error`, () => {
    const errorMessage = getABetterErrorMessage(
      "failed to send transaction: Transaction simulation failed: Error processing Instruction 0: custom program error: 0x1"
    );
    expect(errorMessage).toEqual("Insufficient funds");
  });

  test(`produces a good error when not enough funds to make a new token`, async () => {
    const testUSDCAuthority = new Keypair();
    await putSolIntoWallet(
      connection,
      testUSDCAuthority.publicKey,
      NOT_ENOUGH_TO_MAKE_A_NEW_TOKEN
    );

    expect(
      createNewToken(connection, testUSDCAuthority, testUSDCAuthority.publicKey)
    ).rejects.toThrow("Insufficient funds");
  });
});

describe("minting", () => {
  let connection: Connection;
  let testUSDCAuthority: Keypair;
  let mintAccount: PublicKey;
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

      mintAccount = await createNewToken(
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
        decimals: 2,
        freezeAuthority: null,
        isInitialized: true,
        mintAuthority: testUSDCAuthority.publicKey,
        supply: expect.any(BigInt),
      });
    },
    30 * SECONDS
  );

  test(`getOrCreateAssociatedTokenAddress for a test wallet`, async () => {
    const wallet = new Keypair();
    const tokenAccountPublicKey = await getOrCreateAssociatedTokenAddress(
      connection,
      mintAccount,
      testUSDCAuthority,
      mintAccount,
      wallet.publicKey
    );
    expect(tokenAccountPublicKey).toBeInstanceOf(PublicKey);

    const tokenAccountInformation = await getAccount(
      connection,
      tokenAccountPublicKey
    );

    expect(tokenAccountInformation).toEqual({
      address: expect.any(PublicKey),
      amount: expect.any(BigInt),
      closeAuthority: null,
      delegate: null,
      delegatedAmount: expect.any(BigInt),
      isFrozen: false,
      isInitialized: true,
      isNative: false,
      mint: expect.any(PublicKey),
      owner: expect.any(PublicKey),
      rentExemptReserve: null,
    });
  });
});
