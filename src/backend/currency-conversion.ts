import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import CoinGecko from "coingecko-api";
import { log } from "console";

const CoinGeckoClient = new CoinGecko();

const convertLamportsToUSDOrEurCents = async (
  lamports: number,
  usdOrEur: "USD" | "EUR" = "USD"
) => {
  // const result = await CoinGeckoClient.ping();

  const solanaCoinGeckoResult = await CoinGeckoClient.coins.fetch("solana", {});
  const currentPrice = solanaCoinGeckoResult.data.market_data.current_price;
  const lamportPriceInUSDOrEurCents =
    usdOrEur === "USD" ? currentPrice.usd * 100 : currentPrice.eur * 100;

  log(`lamportPriceInUSDOrEurCents is`, lamportPriceInUSDOrEurCents);

  // Remember the price is for a Sol, not a Lamport
  const lamportPriceInCents =
    (lamports * lamportPriceInUSDOrEurCents) / LAMPORTS_PER_SOL;
  return lamportPriceInCents;
};

const main = async () => {
  const aBillionLamportsInCents = await convertLamportsToUSDOrEurCents(
    1 * LAMPORTS_PER_SOL
  );
  log(aBillionLamportsInCents);

  const tinyAmountOfSolInCents = await convertLamportsToUSDOrEurCents(23000);
  log(tinyAmountOfSolInCents);
};

main();
// 1 solana is 2200 cents
// 2200 cents = 1_000_000_000 lamports
// 1_000_000_000 = 2200
