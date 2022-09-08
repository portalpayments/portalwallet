import { cleanPhrase } from "./phrase-cleaning";
import { expectedCleanedPhrase, dirtyPhrase } from "./__mocks__/mocks";

// Quiet utils.log() during tests
jest.mock("./functions", () => ({
  ...jest.requireActual("./functions"),
  log: jest.fn(),
}));

describe(`restoration`, () => {
  test(`seed phrases are normalised for punctuation`, () => {
    const cleaned = cleanPhrase(dirtyPhrase);
    expect(cleaned).toEqual(expectedCleanedPhrase);
  });
});
