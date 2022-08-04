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
