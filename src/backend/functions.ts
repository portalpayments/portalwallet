// Generic JavaScript functions for browser and node
const decoder = new TextDecoder("utf-8");

import base58 from "bs58";

export const toUnique = function <T>(array: Array<T>): Array<T> {
  return Array.from(new Set(array));
};

// Moves dates years back or forward, handling leap years (unlike '+ 1 * YEAR')
export const adjustYear = (date: Date, adjustYears: number): Date => {
  const newDate = new Date(date);
  newDate.setFullYear(date.getFullYear() + adjustYears);
  return newDate;
};

export const encodeToBase64 = (stringToEncode: string): string => {
  return Buffer.from(stringToEncode).toString("base64");
};

export const decodeFromBase64 = (stringToDecode: string): string => {
  return Buffer.from(stringToDecode, "base64").toString("ascii");
};

export const minorUnitsToDecimal = (minorUnits: number, decimal: number) => {
  // Quick note: we must use division instead of multiplicaton here to fix floating point issues:
  // > 420 / 1e6
  // 0.00042
  // > 420 * 1e-6
  // 0.00041999999999999996
  return minorUnits / Math.pow(10, decimal);
};

export const debug = (_ignored) => {};

export const solanaBlocktimeToJSTime = (blockTime: number) => {
  return blockTime * 1000;
};

export const isIncludedCaseInsensitive = (
  string: string,
  substring: string
) => {
  return string.toLowerCase().includes(substring.toLowerCase());
};

// May be unnecessary but 'absolute value' isn't necessaryilt a well known concept
export const removeSign = (number: number) => {
  return Math.abs(number);
};

export const invertNumber = (number: number) => {
  return -number;
};

export const flipZeroAndOne = (number: 0 | 1) => {
  return Number(!number);
};

export const isPositive = (number: number) => {
  return Math.sign(number) === 1;
};

export const dateToISODate = (date: number) => {
  return new Date(date).toISOString().slice(0, 10);
};

export const isoDateToFriendlyName = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

export const toLocalTime = (date: number | Date) => {
  if (typeof date === "number") {
    date = new Date(date);
  }
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};

export const byDateNewestToOldest = (a, b) => {
  if (a.date === b.date) {
    return 0;
  }
  if (a.date < b.date) {
    return 1;
  }
  return -1;
};

export const byDateOldestToNewest = (a, b) => {
  if (a.date === b.date) {
    return 0;
  }
  if (a.date < b.date) {
    return -1;
  }
  return 0;
};

// Adapted from https://github.com/mgenware/node-filter-async/blob/main/src/main.ts
// (which seems to have issues loading its ESM module)
export const asyncFilter = async <T>(
  array: Array<T>,
  filter: (value: T, index: number) => Promise<boolean>
): Promise<Array<T>> => {
  const results: boolean[] = await Promise.all(
    array.map((value, index) => filter(value, index))
  );
  return array.filter((_, index) => results[index]);
};

export const asyncMap = async <ArrayItemType, IteratorReturnType>(
  array: Array<ArrayItemType>,
  iterator: (
    value: ArrayItemType,
    index?: number
  ) => Promise<IteratorReturnType>
): Promise<Array<IteratorReturnType>> => {
  return Promise.all(array.map(iterator));
};

export const sleep = async (timeInMs: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, timeInMs));
};

// 'any' is OK - JSON.stringify itself uses 'any'
export const stringify = (object: any): string => {
  return JSON.stringify(object, null, 2);
};

export const isEmpty = (object: any): boolean => {
  if (object === undefined || object === null) {
    return true;
  }
  return Object.keys(object).length === 0;
};

// https://stackoverflow.com/questions/47632622/typescript-and-filter-boolean
export const nonNullable = <T>(value: T): value is NonNullable<T> => {
  return value !== null && value !== undefined;
};

// Used with mock Jest functions (though you may wish to use mockResolvedValue() instead)
// https://bit.ly/3bB7p4c
export const makePromise = <T>(item: unknown): Promise<T> => {
  return Promise.resolve(item as T);
};

export const log = console.log.bind(console);

// From https://stackoverflow.com/questions/60504945/javascript-encode-decode-utf8-to-hex-and-hex-to-utf8
export const hexToUtf8 = function (string) {
  return decodeURIComponent(
    string
      .replace(/\s+/g, "") // remove spaces
      .replace(/[0-9a-f]{2}/g, "%$&") // add '%' before each 2 characters
  );
};

export const instructionDataToNote = (string: string) => {
  const binaryArray = base58.decode(string);
  return decoder.decode(Buffer.from(binaryArray));
};
