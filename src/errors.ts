// Some Solana transactions will give
// errors like 'custom program error: 0x1'
// These are what those errors mean (eg, 1 means "Insufficient funds")

// TODO: fix upstream. The TS SDK should give real errors.

// https://github.com/solana-labs/solana-program-library/blob/cd8d79a2b4aa4f90c02514d762ab21023449b6cb/token/program/src/error.rs#L9
enum customProgramErrors {
  "Lamport balance below rent-exempt threshold",
  "Insufficient funds",
  "Invalid Mint",
  "Account not associated with this Mint",
  "Owner does not match",
  "Fixed supply",
  "Already in use",
  "Invalid number of provided signers",
  "Invalid number of required signers",
  "State is unititialized",
  "Instruction does not support native tokens",
  "Non-native account can only be closed if its balance is zero",
  "Invalid instruction",
  "State is invalid for requested operation",
  "Operation overflowed",
  "Account does not support specified authority type",
  "This token mint cannot freeze accounts",
  "Account is frozen",
  "The provided decimals value different from the Mint decimals",
  "Instruction does not support non-native tokens",
}

export const getABetterErrorMessage = (errorMessage: string) => {
  const customErrorExpression =
    /.*custom program error: 0x(?<errorNumber>[0-9ABCDEF])/;

  let match = customErrorExpression.exec(errorMessage);
  const errorNumberFound = match?.groups?.errorNumber;
  if (!errorNumberFound) {
    return null;
  }
  const errorNumber = Number(errorNumberFound);
  return customProgramErrors[errorNumber] || null;
};
