import { cleanPhrase } from "./phrase-cleaning";
import {
  expectedCleanedPersonalPhrase,
  dirtyPersonalPhrase,
} from "./__mocks__/mocks";

describe(`restoration`, () => {
  test(`seed phrases are normalised for punctuation`, () => {
    const cleaned = cleanPhrase(dirtyPersonalPhrase);
    expect(cleaned).toEqual(expectedCleanedPersonalPhrase);
  });
});
