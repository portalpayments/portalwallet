import { promisify } from "util";
import { inspect as originalInspect } from "util";
import { scrypt as scryptCallback } from "crypto";

// Convert `scrypt()` into a function that takes the
// same parameters but returns a promise.
export const scrypt = promisify(scryptCallback);

export const inspect = (object: any) => {
  return originalInspect(object, true, null, true);
};
