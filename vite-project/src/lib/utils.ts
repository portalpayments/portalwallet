const WALLET_CHARACTERS_TO_SHOW = 5;

// Adds commas to numbers
// https://stackoverflow.com/questions/149055/how-to-format-numbers-as-currency-strings
const numberFormatter = new Intl.NumberFormat("en-US", {
  // Do not show fractions - front end should only handle whole numbers
  maximumFractionDigits: 0,
});

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

export const truncateWallet = (wallet: string): string => {
  const start = wallet.slice(0, WALLET_CHARACTERS_TO_SHOW);
  const lastCharacter = wallet.length - 1;
  const end = wallet.slice(
    lastCharacter - WALLET_CHARACTERS_TO_SHOW,
    lastCharacter
  );
  return `${start}...${end}`;
};
