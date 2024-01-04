// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import { Keypair } from "@solana/web3.js";
import { cleanPhrase, secretKeyToBase58 } from "./solana-functions";
import { dirtyPersonalPhrase, slightlyDifferentDirtyPersonalPhrase } from "./test-data/transactions/test-phrases";
import mime from "mime";

jest.mock("./functions");

export const expectedCleanedPersonalPhrase = `say your prayers little one dont forget my son to include everyone i tuck you in warm within keep you free from sin til the sandman he comes`;

describe(`restoration`, () => {
  test(`personal phrases are normalised for punctuation`, () => {
    const cleanedPersonalPhrase = cleanPhrase(dirtyPersonalPhrase);
    expect(cleanedPersonalPhrase).toEqual(expectedCleanedPersonalPhrase);
  });

  test(`two dirty phrases end up the same when cleaned`, () => {
    const cleanedPersonalPhrase1 = cleanPhrase(dirtyPersonalPhrase);
    const cleanedPersonalPhrase2 = cleanPhrase(slightlyDifferentDirtyPersonalPhrase);
    expect(cleanedPersonalPhrase1).toEqual(cleanedPersonalPhrase2);
  });
});

describe(`secretKeyToBase58`, () => {
  test(`secretKeyToBase58 is accurate`, () => {
    const keyPair = new Keypair();
    const result = secretKeyToBase58(keyPair.secretKey);
    // Base58 representation can be either 87 or 88 characters
    expect(result.length).toBeGreaterThanOrEqual(87);
    expect(result.length).toBeLessThan(89);
  });
});

describe(`mime.getType`, () => {
  test(`gets content types correct`, () => {
    const contentType = mime.getType("individual-identity-token-for-mike.svg");
    expect(contentType).toEqual("image/svg+xml");
  });

  test(`returns no content type for no extension`, () => {
    // We could actually download the file but network IO may slow us down
    // Let's set set type null and assume an image in the front end
    const contentType = mime.getType(
      "https://bafybeibguawpykqjhe42ym7qcp5766u2cukvdhq55nuqww6vh77ub6c4mm.ipfs.nftstorage.link/"
    );
    expect(contentType).toEqual(null);
  });
});
