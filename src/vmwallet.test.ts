import { Connection, Keypair } from "@solana/web3.js";
import {
  connect,
  convertPhraseToSeed,
  getAccountBalance,
  putSolIntoWallet,
  sendUSDCTokens,
  seedToKeypairs,
} from "./vmwallet";

import { log, stringify } from "./functions";
import { expectedCleanedPhrase } from "./__mocks__/mocks";

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

  // test(`We can add 69 USDC`, async () => {
  //   const firstWallet = keypairs[0];
  //   const secondWallet = keypairs[1];

  //   let firstWalletBefore = await connection.getAccountInfo(
  //     secondWallet.publicKey
  //   );

  //   let secondWalletBefore = await connection.getAccountInfo(
  //     secondWallet.publicKey
  //   );

  //   log("firstWalletBefore", stringify(firstWalletBefore));
  //   log("secondWalletBefore", stringify(secondWalletBefore));

  //   // TODO: can we airdrop USDC into devnet wallet1
  //   // THEN send the USDC to wallet 2?
  //   // TODO - where does the USCD come from
  //   await sendUSDCTokens(connection, firstWallet, secondWallet, 69);

  //   let firstWalletAfter = await connection.getAccountInfo(
  //     secondWallet.publicKey
  //   );

  //   let secondWalletAfter = await connection.getAccountInfo(
  //     secondWallet.publicKey
  //   );

  //   log("firstWalletAfter", stringify(firstWalletAfter));
  //   log("secondWalletAfter", stringify(secondWalletAfter));

  //   expect({}).toEqual({});
  // });
});
