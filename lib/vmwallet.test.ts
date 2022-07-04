import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { cleanPhrase } from "./phrase-cleaning";
import { SECONDS } from "./utils";
import {
  connect,
  convertPhraseToSeed,
  getAccountBalance,
  putSolIntoWallet,
  seedToWallet,
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

const fullName = "Alex Smith";

const password = "swag";

describe(`restoration`, () => {
  test(`seed phrases are normalised for punctuation`, () => {
    const cleaned = cleanPhrase(dirtyPhrase);

    expect(cleaned).toEqual(expectedCleanedPhrase);
  });
});

describe(`restoration`, () => {
  test(
    `wallets can be restored using their seed phrases`,
    async () => {
      const phrase = `Say your prayers, little one
Don't forget, my son
To include everyone

I tuck you in, warm within
Keep you free from sin
Till the Sandman he comes
`;

      const fullName = "19810321";

      const password = "swag";

      const seed = await convertPhraseToSeed(phrase, fullName);
      const wallet = await seedToWallet(seed, password);
      const connection = await connect();
      const balanceBefore = await getAccountBalance(
        connection,
        wallet.publicKey
      );
      const deposit = 1 * LAMPORTS_PER_SOL;
      await putSolIntoWallet(connection, wallet.publicKey, deposit);
      const balanceAfter = await getAccountBalance(
        connection,
        wallet.publicKey
      );

      const difference = balanceAfter - balanceBefore;
      expect(difference).toEqual(deposit);
    },
    30 * SECONDS
  );
});
