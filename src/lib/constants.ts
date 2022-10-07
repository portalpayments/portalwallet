export enum LabelColor {
  Grey = "grey",
  Green = "green",
  Yellow = "yellow",
  Red = "red",
}

export const HOW_MANY_TRANSACTIONS_TO_SHOW = 1;

// TODO: this is extracted from the private key in the backend .env file
export const identityTokenIssuerPublicKeyString =
  "FSVgrW58amFmH91ZKBic686qVhHayMt3wS8bCpisUph9";

export const warningUnverifiedAccount =
  "Only send money to verified recipients. We will notify you once the address is verified.";

// Used to validate 12, 12.34, etc.
export const NUMBERS_OPTIONAL_DECIMAL_PLACE_TWO_NUMBERS = "^d*(.d{0,2})?$";
