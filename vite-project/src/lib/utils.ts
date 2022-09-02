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
  const parts = balanceString.split(".");
  const major = parts[0];
  const minor = parts[1].slice(0, 2);
  return [major, minor];
};

export const formatUSDCBalanceNumber = (balanceNumber: number) => {
  const dollars = balanceNumber / 100;
  return dollars.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
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
