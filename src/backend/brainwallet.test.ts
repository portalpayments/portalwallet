import type { Connection, Keypair } from "@solana/web3.js";
import { personalPhraseToSeed, seedToKeypairs } from "./brainwallet";
import { DEPOSIT } from "./constants";
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
});
