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
