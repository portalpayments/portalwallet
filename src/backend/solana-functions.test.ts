// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import { Keypair } from "@solana/web3.js";
import { cleanPhrase, secretKeyToHex } from "./solana-functions";
import {
  dirtyPersonalPhrase,
  slightlyDifferentDirtyPersonalPhrase,
} from "./test-data/transactions/test-phrases";

jest.mock("./functions");

export const expectedCleanedPersonalPhrase = `say your prayers little one dont forget my son to include everyone i tuck you in warm within keep you free from sin til the sandman he comes`;

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

describe(`secretKeyToHex`, () => {
  test(`secretKeyToHex is accurate`, () => {
    const keyPair = new Keypair();
    const result = secretKeyToHex(keyPair.secretKey);
    expect(result.length).toEqual(88);
  });
});
