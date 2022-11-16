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
  "There's no proof this account belongs to any known person. Request verification so the recipient is proven with their government ID. ";

// Used to validate 12, 12.34, etc.
export const NUMBERS_OPTIONAL_DECIMAL_PLACE_TWO_NUMBERS = "^d*(.d{0,2})?$";
