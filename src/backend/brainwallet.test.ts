import { Connection, Keypair } from "@solana/web3.js";
import { personalPhraseToSeed, seedToKeypairs } from "./brainwallet";
import { DEPOSIT, NOT_ENOUGH_TO_MAKE_A_NEW_TOKEN } from "./constants";
import { getABetterErrorMessage } from "./errors";
import { log, stringify } from "./functions";
import { createMintAccount } from "./tokens";
import { connect, getAccountBalance, putSolIntoWallet } from "./vmwallet";
import { expectedCleanedPersonalPhrase } from "./__mocks__/mocks";

const firstName = `Joe`;
const lastName = `Cottoneye`;

const fullName = `${firstName} ${lastName}`;
const password = `${new Date().toString()}`;

// Quiet utils.log() during tests
jest.mock("./functions", () => ({
  ...jest.requireActual("./functions"),
  log: jest.fn(),
}));

describe(`restoration`, () => {
  let connection: Connection;
  let keypairs: Array<Keypair>;
  let restoredKeypairs: Array<Keypair>;
  beforeAll(async () => {
    connection = await connect("localhost");
  });

  test(`wallets can be created`, async () => {
    const seed = await personalPhraseToSeed(
      expectedCleanedPersonalPhrase,
      fullName
    );
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
    // Lets re-make the keypairs from the seed
    const seed = await personalPhraseToSeed(
      expectedCleanedPersonalPhrase,
      fullName
    );
    restoredKeypairs = await seedToKeypairs(seed, password);

    const originalWallet = keypairs[0];
    const restoredWallet = restoredKeypairs[0];
    expect(restoredWallet.secretKey).toEqual(originalWallet.secretKey);
    expect(restoredWallet.publicKey.toBase58()).toEqual(
      originalWallet.publicKey.toBase58()
    );
  });

  test(`wallets can be deposited into`, async () => {
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

  test(`We turn program errors into more readable errors`, () => {
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
      createMintAccount(
        connection,
        testUSDCAuthority,
        testUSDCAuthority.publicKey
      )
    ).rejects.toThrow(
      "failed to send transaction: Transaction simulation failed: Attempt to debit an account but found no record of a prior credit."
    );
  });
});
