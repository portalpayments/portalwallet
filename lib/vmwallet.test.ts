import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { cleanPhrase } from "./phrase-cleaning";
import { SECONDS } from "./utils";
import { makeFullWalletWithTokens } from "./vmwallet";

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
  // skip because not running right now due to 429 in dev
  test.skip(
    `wallets can be restored using their seed phrases`,
    async () => {
      const initialBalance = await makeFullWalletWithTokens(
        dirtyPhrase,
        fullName,
        password
      );
      const laterBalance = await makeFullWalletWithTokens(
        dirtyPhrase,
        fullName,
        password
      );
      const difference = laterBalance - initialBalance;
      const expectedDifference = laterBalance - 1 * LAMPORTS_PER_SOL;
      expect(difference).toEqual(expectedDifference);
    },
    30 * SECONDS
  );
});
