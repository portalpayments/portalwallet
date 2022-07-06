import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { cleanPhrase } from "./phrase-cleaning";
import { SECONDS } from "./utils";
import {
  connect,
  convertPhraseToSeed,
  getAccountBalance,
  putSolIntoWallet,
  seedToKeypair,
} from "./vmwallet";

const firstName = `Joe`;
const lastName = `Cottoneye`;

// Put these at the top to avoid indentation issues
const dirtyPhrase = `Say your prayers, little one
Don't forget, my son
To include everyone

I tuck you in, warm within
Keep you free from sin
Till the Sandman he comes
`;

const expectedCleanedPhrase = `say your prayers little one dont forget my son to include everyone i tuck you in warm within keep you free from sin till the sandman he comes`;

const fullName = `${firstName} ${lastName}`;
const password = `${new Date().toString()}`;

// TODO: reducing this seems to make wallets not visible
// but too many lamports may hit airdrop limit
const DEPOSIT = 1 * LAMPORTS_PER_SOL;

describe(`restoration`, () => {
  test(`seed phrases are normalised for punctuation`, () => {
    const cleaned = cleanPhrase(dirtyPhrase);

    expect(cleaned).toEqual(expectedCleanedPhrase);
  });
});

describe(`restoration`, () => {
  let connection: Connection;
  let keypair: Keypair;
  beforeAll(async () => {
    connection = await connect("localhost");
  });

  afterAll(async () => {
    // TODO: close connection?
  });
  test(`wallets can be created`, async () => {
    const seed = await convertPhraseToSeed(expectedCleanedPhrase, fullName);
    keypair = await seedToKeypair(seed, password);

    // IMPORTANT: if we don't deposit any Sol the wallet won't exist
    await putSolIntoWallet(connection, keypair.publicKey, DEPOSIT);

    const accountBalance = await getAccountBalance(
      connection,
      keypair.publicKey
    );
    expect(accountBalance).toEqual(DEPOSIT);
  });

  test(`wallets can be restored using their seed phrases`, async () => {
    const balanceBefore = await getAccountBalance(
      connection,
      keypair.publicKey
    );
    await putSolIntoWallet(connection, keypair.publicKey, DEPOSIT);
    const balanceAfter = await getAccountBalance(connection, keypair.publicKey);

    const difference = balanceAfter - balanceBefore;
    expect(difference).toEqual(DEPOSIT);
  });
});
