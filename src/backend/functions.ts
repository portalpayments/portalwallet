// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
// Generic JavaScript functions for browser and node

// TODO
// Duplicate, but depending on constants brings is too many additional dependencies for service worker
const MINUTES = 60 * 1000;
const HOUR = 60 * MINUTES;

export const getFromEnv = (variableName) => {
  const value = process.env[variableName];
  if (!value) {
    throw new Error(`Please set '${variableName}' in .env or GitHub Secrets`);
  }
  return value;
};

export const toUnique = function <T>(array: Array<T>): Array<T> {
  return Array.from(new Set(array));
};

export const isFresh = (lastUpdated: number, maximumAge: number) => {
  const now = Date.now();
  const difference = now - lastUpdated;
  if (difference < maximumAge) {
    return true;
  }
  return false;
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

export const isIncludedCaseInsensitive = (string: string, substring: string) => {
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
    return -1;
  }
  if (a.date < b.date) {
    return 1;
  }
  return 0;
};

export const isCamelCase = (string: string) => {
  return /[a-z]+[A-Z][a-z]/.test(string);
};

export const camelToSentenceCase = (string: string) => {
  const spaced = string
    // Remove underscores
    .replace("_", " ")
    // Add space before uppercase camelHumps
    .replace(/([A-Z])/g, " $1");

  // Convert first character to uppercase and join it to the final string
  const result = spaced.charAt(0).toUpperCase() + spaced.slice(1);
  return result;
};

export const formatObjectKeys = (object: Record<string, unknown>) => {
  const IS_CAMELCASE_THRESHHOLD = 0.6;
  const keys = Object.keys(object);
  const keyCount = keys.length;
  const camelCaseKeyCount = keys.map((key) => isCamelCase(key)).length;
  // Check if it's camelcase
  if (camelCaseKeyCount / keyCount > IS_CAMELCASE_THRESHHOLD) {
    const formattedObject = Object.fromEntries(
      keys.map((key) => {
        return [camelToSentenceCase(key), object[key]];
      })
    );
    return formattedObject;
  }
  return object;
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
  const results: boolean[] = await Promise.all(array.map((value, index) => filter(value, index)));
  return array.filter((_, index) => results[index]);
};

export const asyncMap = async <ArrayItemType, IteratorReturnType>(
  array: Array<ArrayItemType>,
  iterator: (value: ArrayItemType, index?: number) => Promise<IteratorReturnType>
): Promise<Array<IteratorReturnType>> => {
  return Promise.all(array.map(iterator));
};

export const sleep = async (timeInMs: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, timeInMs));
};

export const runWithTimeout = <T>(promise: Promise<T>, timeout: number): Promise<T | void> => {
  const timeoutPromise: Promise<void> = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout! Operation did not complete within ${timeout} ms`));
    }, timeout);
  });

  return Promise.race([promise, timeoutPromise]);
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

export const repeat = async (functionToRun: Function, interval: number) => {
  // Run the fnction on the 'leading edge', ie now
  functionToRun();
  // Do this every interval
  return setInterval(() => {
    functionToRun();
  }, interval);
};

// https://stackoverflow.com/questions/8609289/convert-a-binary-nodejs-buffer-to-javascript-arraybuffer/31394257#31394257
export const toArrayBuffer = (buffer: Buffer) => {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
};

// node has 'btoa' and 'atob' but the node docs tells us to do this instead
export const stringToBase64 = (string: string): string => {
  return Buffer.from(string).toString("base64");
};

export const base64ToString = (base64: string): string => {
  return Buffer.from(base64, "base64").toString();
};

export const formatURL = (string: String) => {
  return string.replace(/\/$/, "");
};
