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

// Put these at the top to avoid indentation issues
const dirtyPhrase = `Say your prayers, little one
Don't forget, my son
To include everyone

I tuck you in, warm within
Keep you free from sin
Till the Sandman he comes
`;

const expectedCleanedPhrase = `say your prayers little one dont forget my son to include everyone i tuck you in warm within keep you free from sin till the sandman he comes`;

describe(`restoration`, () => {
  test(`seed phrases are normalised for punctuation`, () => {
    const cleaned = cleanPhrase(dirtyPhrase);

    expect(cleaned).toEqual(expectedCleanedPhrase);
  });
});

describe(`restoration`, () => {
  let connection: Connection;
  beforeAll(async () => {
    connection = await connect();
  });

  afterAll(async () => {
    // TODO: close connection?
  });
  test(
    `wallets can be created`,
    async () => {
      const fullName = "Joe Cottoneye 2";
      const password = "where did you come from";
      // TODO
      // If I change any details for the wallet creation the test doesn't work
      // I suspect it's not actually making the wallet
      // It maybe made a wallet in the past and is reconnecting to it now

      const seed = await convertPhraseToSeed(expectedCleanedPhrase, fullName);
      const keypair = await seedToKeypair(seed, password);

      // Generate a new wallet keypair and airdrop SOL
      var airdropSignature = await connection.requestAirdrop(
        keypair.publicKey,
        LAMPORTS_PER_SOL
      );

      await connection.confirmTransaction(airdropSignature);

      const accountBalance = await getAccountBalance(
        connection,
        keypair.publicKey
      );
      console.log(accountBalance);
    },
    30 * SECONDS
  );

  // test(
  //   `wallets can be restored using their seed phrases`,
  //   async () => {
  //     const balanceBefore = await getAccountBalance(
  //       connection,
  //       keypair.publicKey
  //     );
  //     const deposit = 1 * LAMPORTS_PER_SOL;
  //     await putSolIntoWallet(connection, keypair.publicKey, deposit);
  //     const balanceAfter = await getAccountBalance(
  //       connection,
  //       keypair.publicKey
  //     );

  //     const difference = balanceAfter - balanceBefore;
  //     expect(difference).toEqual(deposit);
  //   },
  //   30 * SECONDS
  // );
});
