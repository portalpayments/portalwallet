import { TokenListProvider } from "@solana/spl-token-registry";
import { log, stringify } from "./src/backend/functions";
import { CurrencyDetails } from "./src/backend/types";
import { writeFile } from "fs/promises";

const tokenListProvider = new TokenListProvider();

const FILE_NAME = "src/backend/mint-to-currency-map.ts";

const main = async () => {
  const tokenListContainer = await tokenListProvider.resolve();
  const tokens = tokenListContainer
    .filterByClusterSlug("mainnet-beta")
    .getList();

  const currenciesDetails: Array<CurrencyDetails> = tokens.map((token) => {
    // Portal currencies includes all tokens as well as native Sol
    // Wrapped sol having the symbol "SOL" is dangerous,
    // as it stops wrapped Solana from being distinguishable from native Solana
    // Thankfully there is no token as of 20230117 with the symbol 'WSOL' so let's use 'WSOL'
    // for wrapped Sol and 'SOL' for native Sol
    if (token.symbol === "WSOL") {
      throw new Error(`This error should not occur, see the message above`);
    }

    let fixedSymbol: string = token.symbol;
    if (token.symbol === "SOL") {
      // Note there is no token with
      fixedSymbol = "WSOL";
    }

    return {
      mintAddress: token.address,
      decimals: token.decimals,
      symbol: fixedSymbol,
    };
  });

  // Add native Sol currency
  currenciesDetails.push({
    mintAddress: "native",
    symbol: "SOL",
    decimals: 9,
  });

  log(currenciesDetails.length);

  const mintToCurrencyMap: Record<string, CurrencyDetails> = Object.fromEntries(
    currenciesDetails.map((currencyDetails) => {
      return [currencyDetails.mintAddress, currencyDetails];
    })
  );

  const fileContents =
    // @prettier-ignore
    `import type { CurrencyDetails } from "./types";
    
export const mintToCurrencyMap: Record<string, CurrencyDetails> = ` +
    stringify(mintToCurrencyMap);

  await writeFile(FILE_NAME, fileContents);

  log(`Finished! Saved ${FILE_NAME} `);
};

main();
