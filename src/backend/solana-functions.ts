// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes
const WHITESPACE = /\s+/g;
const SINGLE_SPACE = " ";
const NON_ALPHA_NUMERIC = /[\n,']+/g;
const NOTHING = "";

import { Keypair } from "@solana/web3.js";
import base58 from "bs58";
import { mintToCurrencyMap } from "./mint-to-currency-map";
import type { ContentType, CurrencyDetails } from "./types";

// We could also use 'bs58' but have to convert string to bytes first
export const cleanPhrase = (phrase: string) => {
  return phrase
    .toLowerCase()
    .trim()
    .replace(WHITESPACE, SINGLE_SPACE)
    .replace(NON_ALPHA_NUMERIC, NOTHING);
};

export const secretKeyToHex = (secretKey: Uint8Array) => {
  return base58.encode(secretKey);
};

export const getKeypairFromString = (secretKeyString: string) => {
  let decodedSecretKey: Uint8Array;
  try {
    decodedSecretKey = base58.decode(secretKeyString);
  } catch (throwObject) {
    const error = throwObject as Error;
    throw new Error("Invalid secret key! See README.md");
  }
  return Keypair.fromSecretKey(decodedSecretKey);
};

export const getCurrencyBySymbol = (symbol: string) => {
  return (
    Object.values(mintToCurrencyMap).find(
      (currencyDetails: CurrencyDetails) => {
        return currencyDetails.symbol === symbol;
      }
    ) || null
  );
};

export const getMintAddressBySymbol = (symbol: string) => {
  return getCurrencyBySymbol(symbol).mintAddress;
};

export const getCurrencyByMint = (mint: string) => {
  const isKnownCurrency = Object.hasOwn(mintToCurrencyMap, mint);
  if (!isKnownCurrency) {
    throw new Error(`Unknown currency for mint '${mint}'`);
  }
  return mintToCurrencyMap[mint];
};

export const getCurrencySymbolByMint = (mint: string) => {
  const currency = getCurrencyByMint(mint);
  return currency.symbol;
};

export const fileNameToContentType = (fileName: string): ContentType => {
  const extension = fileName.split(".").at(-1);

  if (extension === "png") {
    return "image/png";
  }

  if (extension === "jpg" || extension === "jpeg") {
    return "image/jpeg";
  }

  if (extension === "svg") {
    return "image/svg+xml";
  }

  throw new Error(`Could not determine Content Type for ${fileName}`);
};
