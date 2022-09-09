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

export const formatNumber = (
  number: number | string,
  isMajorUnits: boolean
) => {
  const asNumber = Number(number);
  if (!isMajorUnits) {
    return asNumber;
  }
  return numberFormatter.format(asNumber);
};

export const formatUSDCBalanceString = (balanceString: string) => {
  // Balances of say 10.00 will have a balanceString of '10'
  log(`balanceString is ${balanceString}`)
  if ( ! balanceString.includes('.' ) ) {
    return balanceString
  }
  const parts = balanceString.split(".");
  const major = parts[0];
  const minor = parts[1].slice(0, 2);
  return [major, minor];
};

export const getMultiplier = (digits = 2) => {
  return Number(`10e${digits - 1}`);
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
