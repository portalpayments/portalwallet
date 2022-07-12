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
} from "./vmwallet";

import { log, stringify } from "./functions";
import { expectedCleanedPhrase } from "./__mocks__/mocks";
import { getMint } from "@solana/spl-token";

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

  test(`createNewToken makes new tokens`, async () => {
    const testUSDCAuthority = new Keypair();
    await putSolIntoWallet(
      connection,
      testUSDCAuthority.publicKey,
      ENOUGH_TO_MAKE_A_NEW_TOKEN
    );

    const mintAddress = await createNewToken(
      connection,
      testUSDCAuthority,
      testUSDCAuthority.publicKey
    );
    const doesExist = await checkAccountExists(connection, mintAddress);
    expect(doesExist).toBeTruthy();
    let mintAccount = await getMint(connection, mintAddress);

    expect(mintAccount).toEqual({
      // TODO: expect.any(String) and expect.any(PublicKey)
      // don't work
      address: expect.anything(),
      decimals: 2,
      freezeAuthority: null,
      isInitialized: true,
      mintAuthority: testUSDCAuthority.publicKey,
      supply: expect.any(BigInt),
    });
  });
});
