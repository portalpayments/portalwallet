// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import { cleanPhrase } from "./phrase-cleaning";

jest.mock("./functions");

// Put these at the top to avoid indentation issues
export const dirtyPersonalPhrase = `Say your prayers, little one, don't forget, my son
To include everyone
I tuck you in, warm within, keep you free from sin
'Til the Sandman, he comes
`;

// Interestingly these lyrics had 'Till' rather than 'Til'
// Lesson? Archaic words like till may have alternate spellings
// This is why we need to test users to make sure they can recover
// outside of emergency scenarios
export const slightlyDifferentDirtyPersonalPhrase = `Say your prayers, little one
Don't forget, my son
To include everyone

I tuck you in, warm within
Keep you free from sin
Til the Sandman he comes
`;

export const expectedCleanedPersonalPhrase = `say your prayers little one dont forget my son to include everyone i tuck you in warm within keep you free from sin till the sandman he comes`;

describe(`restoration`, () => {
  test(`seed phrases are normalised for punctuation`, () => {
    const cleanedPersonalPhrase = cleanPhrase(dirtyPersonalPhrase);
    expect(cleanedPersonalPhrase).toEqual(expectedCleanedPersonalPhrase);
  });

  test(`two dirty phrases end up the same when cleaned`, () => {
    const cleanedPersonalPhrase1 = cleanPhrase(dirtyPersonalPhrase);
    const cleanedPersonalPhrase2 = cleanPhrase(
      slightlyDifferentDirtyPersonalPhrase
    );
    expect(cleanedPersonalPhrase1).toEqual(cleanedPersonalPhrase2);
  });
});
