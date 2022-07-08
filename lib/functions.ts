import { promisify } from "util";

import { scrypt as scryptCallback } from "crypto";

// Convert `scrypt()` into a function that takes the
// same parameters but returns a promise.
export const scrypt = promisify(scryptCallback);

// TODO: can be replaced with https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
// once we upgrade to node 18 and later (we could also use a polyfill if we wanted)
// We need the 'any' below as using 'unknown' will cause cloned objects to have the wrong type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepClone = <Type extends Record<string, any> | Array<unknown>>(
  object: Type
): Type => {
  return JSON.parse(JSON.stringify(object));
};

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

export const asyncMap = async <T>(
  array: Array<T>,
  iterator: (value: T, index?: number) => Promise<unknown>
): Promise<Array<unknown>> => {
  const promises: Array<Promise<unknown>> = [];
  for (const [index, item] of array.entries()) {
    promises.push(iterator(item, index));
  }
  return Promise.all(promises);
};

export const sleep = async (timeInMs: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, timeInMs));
};

export const stringify = (object: Record<string, unknown>): string => {
  return JSON.stringify(object, null, 2);
};

export const isEmpty = (object: Record<string, unknown>): boolean => {
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

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message?: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_resolve, reject) => {
      setTimeout(() => {
        reject(
          message ??
            `Timeout! Operation did not complete within ${timeoutMs} ms`
        );
      }, timeoutMs);
    }),
  ]);
}

// From https://fettblog.eu/typescript-hasownproperty/
// TODO: node 18 and onwards can use
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn
// eslint-disable-next-line @typescript-eslint/ban-types
export function hasOwnProperty<X extends {}, Y extends PropertyKey>(
  object: X,
  property: Y
): object is X & Record<Y, unknown> {
  // eslint-disable-next-line no-prototype-builtins
  return object.hasOwnProperty(property);
}

export const log = console.log.bind(console);
