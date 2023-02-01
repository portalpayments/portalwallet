import { LAMPORTS_PER_SOL } from "@solana/web3.js";
// import CoinGecko from "coingecko-api";
import { log } from "./functions";

// TODO: re-enable coingecko (currently failing in browser due to querystring bits)
// const CoinGeckoClient = new CoinGecko();

export const convertLamportsToUSDOrEurCents = async (
  lamports: number,
  usdOrEur: "USD" | "EUR" = "USD"
) => {
  // TODO: see above
  // const result = await CoinGeckoClient.ping();
  // const solanaCoinGeckoResult = await CoinGeckoClient.coins.fetch("solana", {});
  // const currentPrice = solanaCoinGeckoResult.data.market_data.current_price;
  const currentPrice = {
    usd: 24.91,
    eur: 22.68,
  };
  const lamportPriceInUSDOrEurCents =
    usdOrEur === "USD" ? currentPrice.usd * 100 : currentPrice.eur * 100;

  // Remember the price is for a Sol, not a Lamport
  const lamportPriceInCents =
    (lamports * lamportPriceInUSDOrEurCents) / LAMPORTS_PER_SOL;
  return lamportPriceInCents;
};

// // 1 solana is 2200 cents
// // 2200 cents = 1_000_000_000 lamports
// // 1_000_000_000 = 2200
