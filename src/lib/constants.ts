// Frontend-specific constants
// Backend constants are in the backend constants file.

import usdcBlue from "../assets/Icons/usdc-coin.svg";
import usdcGrey from "../assets/Icons/usdc-coin-grey.svg";
import usdtBlue from "../assets/Icons/usdt-coin.svg";
import usdtGrey from "../assets/Icons/usdt-coin-grey.svg";
import usdhBlue from "../assets/Icons/usdh-coin.svg";
import usdhGrey from "../assets/Icons/usdh-coin-grey.svg";
import solBlue from "../assets/Icons/sol-coin.svg";
import solGrey from "../assets/Icons/sol-coin-grey.svg";

export const CURRENCY_ICONS = {
  USDC: {
    grey: usdcGrey,
    blue: usdcBlue,
  },
  USDT: {
    grey: usdtGrey,
    blue: usdtBlue,
  },
  USDH: {
    grey: usdhGrey,
    blue: usdhBlue,
  },
  SOL: {
    grey: solGrey,
    blue: solBlue,
  },
};

export enum LabelColor {
  Grey = "grey",
  Green = "green",
  Yellow = "yellow",
  Red = "red",
}

export const HOW_MANY_TRANSACTIONS_TO_SHOW = 30;

// TODO: this is extracted from the secret key in the backend .env file
export const identityTokenIssuerPublicKeyString =
  "FSVgrW58amFmH91ZKBic686qVhHayMt3wS8bCpisUph9";

export const warningUnverifiedAccount =
  "Only send money to verified recipients. We will notify you once the address is verified.";

// Used to validate 12, 12.34, etc.
export const NUMBERS_OPTIONAL_DECIMAL_PLACE_TWO_NUMBERS = "^d*(.d{0,2})?$";
