// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes
const WHITESPACE = /\s+/g;
const SINGLE_SPACE = " ";
const NON_ALPHA_NUMERIC = /[\n,']+/g;
const NOTHING = "";

// We could also use 'bs58' but have  to convert string to bytes first
export const cleanPhrase = (phrase: string) => {
  return phrase
    .toLowerCase()
    .trim()
    .replace(WHITESPACE, SINGLE_SPACE)
    .replace(NON_ALPHA_NUMERIC, NOTHING);
};
