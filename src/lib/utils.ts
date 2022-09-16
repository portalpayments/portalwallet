import { PublicKey } from "@solana/web3.js";
import { log } from "../backend/functions";

const WALLET_CHARACTERS_TO_SHOW = 5;

// Adds commas to numbers
// https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
const numberFormatter = new Intl.NumberFormat("en-US", {
  // Do not show fractions - front end should only handle whole numbers
  maximumFractionDigits: 0,
});

export const getPrivateKey = () => {
  return localStorage.getItem("PORTAL_PRIVATE_KEY");
};

export const httpGet = async (uri: string) => {
  const response = await fetch(uri, {
    method: "GET",
  });
  return response.json();
};

export const formatMajorUnits = (number: number | string) => {
  const asNumber = Number(number);
  return numberFormatter.format(asNumber);
};

export const getMultiplier = (digits = 2) => {
  return Number(`10e${digits - 1}`);
};

export const amountAndDecimalsToMajorAndMinor = (
  // Amount is astring because that's what web3.js uses
  amount: string,
  decimals: number
) => {
  const multiplier = getMultiplier(decimals);
  const major = String(Math.floor(Number(amount) / multiplier));
  let minor = String(Number(amount) % multiplier);
  // Normalize '6' to be '000006' etc.
  const minorPadded = minor.padStart(decimals, "0");

  // Cut off first two decimals for USD-like resolution
  return [major, minorPadded.slice(0, 2)];
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
  const lastCharacter = wallet.length - 1;
  const end = wallet.slice(
    lastCharacter - WALLET_CHARACTERS_TO_SHOW,
    lastCharacter
  );
  return `${start}...${end}`;
};