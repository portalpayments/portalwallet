// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import { PublicKey } from "@solana/web3.js";

const WALLET_CHARACTERS_TO_SHOW = 5;

const LARGE_NUMBER_MAJOR_DIGITS = 3;

// Adds commas to numbers
// https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
const numberFormatter = new Intl.NumberFormat("en-US", {
  // Do not show fractions - front end should only handle whole numbers
  maximumFractionDigits: 0,
});

export const formatMajorUnits = (number: number | string) => {
  const asNumber = Number(number);
  return numberFormatter.format(asNumber);
};

export const getMultiplier = (digits = 2) => {
  return Number(`10e${digits - 1}`);
};

export const toUniqueStringArray = (array: Array<string>): Array<string> => {
  return [...new Set(array)].filter(function (item) {
    return item !== null;
  });
};

// TODO: Maybe change this to return { major: x, minor: y}
export const amountAndDecimalsToMajorAndMinor = (
  amount: number,
  decimals: number
): Array<string | null> => {
  const multiplier = getMultiplier(decimals);
  const major = String(Math.floor(amount / multiplier));
  let minor = String(Number(amount) % multiplier);

  // For fractions of a cent
  if (minor.startsWith("0.")) {
    minor = "0";
  }

  // Normalize '6' to be '000006' etc.
  const minorPadded = minor.padStart(decimals, "0");

  // Cut off first two decimals for USD-like resolution
  return [major, minorPadded.slice(0, 2)];
};

export const amountAndDecimalsToString = (amount: number, decimals: number) => {
  const [major, minor] = amountAndDecimalsToMajorAndMinor(amount, decimals);
  return `${major}.${minor}`;
};

export const formatNumber = (
  isRecievedOrSwapped: boolean,
  amount: number,
  decimals: number,
  hideMinorIfLarge = false
) => {
  const [major, minor] = amountAndDecimalsToMajorAndMinor(amount, decimals);

  let formattedAmount = "";

  if (isRecievedOrSwapped) {
    formattedAmount += "+";
  }

  formattedAmount += major;

  if (hideMinorIfLarge) {
    if (major.length >= LARGE_NUMBER_MAJOR_DIGITS) {
      return formattedAmount;
    }
  }

  formattedAmount += `.${minor}`;

  return formattedAmount;
};

export const getFormattedMajorUnits = (minorUnits: number, digits = 2) => {
  const multiplier = getMultiplier(digits);
  const majorPart = Math.floor(minorUnits / multiplier);
  return String(majorPart.toLocaleString("en-US"));
};

export const getFormattedMinorUnits = (
  totalInMinorUnits: number,
  digits = 2
) => {
  const multiplier = getMultiplier(digits);
  const minorUnitsRemainder = totalInMinorUnits % multiplier;
  // Don't show .00, just show whole number
  if (!minorUnitsRemainder) {
    return "";
  }

  if (minorUnitsRemainder % 10 === 0) {
    `.${minorUnitsRemainder}0`;
  }
  return `.${minorUnitsRemainder}`;
};

export const checkIfValidWalletAddress = (walletAddress: string) => {
  try {
    new PublicKey(walletAddress);
    return true;
  } catch {
    return false;
  }
};

export const truncateWallet = (wallet: string): string => {
  const start = wallet.slice(0, WALLET_CHARACTERS_TO_SHOW);
  const lastCharacter = wallet.length;
  const end = wallet.slice(
    lastCharacter - WALLET_CHARACTERS_TO_SHOW,
    lastCharacter
  );
  return `${start}...${end}`;
};

export const copyToClipboard = (string: string) => {
  // From https://developer.mozilla.org/en-US/docs/Web/API/Navigator/clipboard
  return navigator.clipboard.writeText(string);
};
