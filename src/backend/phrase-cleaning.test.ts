import { cleanPhrase } from "./phrase-cleaning";

jest.mock("./functions");

// Put these at the top to avoid indentation issues
export const dirtyPersonalPhrase = `Say your prayers, little one
Don't forget, my son
To include everyone

I tuck you in, warm within
Keep you free from sin
Till the Sandman he comes
`;

export const expectedCleanedPersonalPhrase = `say your prayers little one dont forget my son to include everyone i tuck you in warm within keep you free from sin till the sandman he comes`;

describe(`restoration`, () => {
  test(`seed phrases are normalised for punctuation`, () => {
    const cleaned = cleanPhrase(dirtyPersonalPhrase);
    expect(cleaned).toEqual(expectedCleanedPersonalPhrase);
  });
});
