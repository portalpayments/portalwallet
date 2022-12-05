import { PublicKey } from "@solana/web3.js";
import { log } from "../backend/functions";
const WALLET_CHARACTERS_TO_SHOW = 5;

const CONTENT_TYPES = {
  JSON: "application/json",
  TEXT: "text/plain",
  HTML: "text/html",
};

// Adds commas to numbers
// https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
const numberFormatter = new Intl.NumberFormat("en-US", {
  // Do not show fractions - front end should only handle whole numbers
  maximumFractionDigits: 0,
});

export const httpGet = async (
  uri: string,
  forceContentType: string | null = null
) => {
  const response = await fetch(uri, {
    method: "GET",
  });

  let contentType = forceContentType || CONTENT_TYPES.JSON;
  let contentTypeHeader = response.headers.get("Content-Type");
  if (contentTypeHeader) {
    contentType = contentTypeHeader.split(";").at(0);
  } else {
    log(`No Content Type header. Weird`);
  }

  if (
    contentType === CONTENT_TYPES.TEXT ||
    contentType === CONTENT_TYPES.HTML
  ) {
    const htmlOrText = await response.text();
    return htmlOrText;
  }
  if (contentType === "application/json") {
    return response.json();
  }
  throw new Error(`Don't know ho to decode this contentType: ${contentType}`);
};

export const formatMajorUnits = (number: number | string) => {
  const asNumber = Number(number);
  return numberFormatter.format(asNumber);
};

export const getMultiplier = (digits = 2) => {
  return Number(`10e${digits - 1}`);
};

export const toUniqueStringArray = (array: Array<string>): Array<string> => {
  return [...new Set(array)];
};

export const amountAndDecimalsToMajorAndMinor = (
  amount: number,
  decimals: number
) => {
  const multiplier = getMultiplier(decimals);
  const major = String(Math.floor(amount / multiplier));
  let minor = String(Number(amount) % multiplier);
  // Normalize '6' to be '000006' etc.
  const minorPadded = minor.padStart(decimals, "0");

  // Cut off first two decimals for USD-like resolution
  return [major, minorPadded.slice(0, 2)];
};

export const amountAndDecimalsToString = (amount: number, decimals: number) => {
  const [major, minor] = amountAndDecimalsToMajorAndMinor(amount, decimals);
  return `${major}.${minor}`;
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
