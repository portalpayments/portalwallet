// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes
const WHITESPACE = /\s+/g;
const SINGLE_SPACE = " ";
const NON_ALPHA_NUMERIC = /[\n,']+/g;
const NOTHING = "";

export const cleanPhrase = (phrase: string) => {
  return phrase
    .toLowerCase()
    .trim()
    .replace(WHITESPACE, SINGLE_SPACE)
    .replace(NON_ALPHA_NUMERIC, NOTHING);
};
