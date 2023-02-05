// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { log } from "./functions";
import { convertLamportsToUSDOrEurCents } from "./currency-conversion";

describe(`Currency conversion`, () => {
  test(`Converts sol accurately`, async () => {
    const aBillionLamportsInCents = await convertLamportsToUSDOrEurCents(
      1 * LAMPORTS_PER_SOL
    );

    // 1 sol should be between 18-50 bucks
    expect(aBillionLamportsInCents).toBeGreaterThan(1800);
    expect(aBillionLamportsInCents).toBeLessThan(5000);
  });
});
