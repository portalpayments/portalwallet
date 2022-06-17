import { promisify } from "util";
// Convert `scrypt()` into a function that takes the
// same parameters but returns a promise.
import { scrypt as scryptCallback } from "crypto";

export const scrypt = promisify(scryptCallback);

export const log = console.log.bind(console);

export const print = (object: unknown) => {
  return JSON.stringify(object, null, 2);
};

export const SECOND = 1000;
export const SECONDS = SECOND;

export const MINUTE = 60 * SECONDS;
export const MINUTES = MINUTE;
