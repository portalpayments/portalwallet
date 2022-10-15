import { promisify } from "util";
import { inspect as originalInspect } from "util";

export const inspect = (object: any) => {
  return originalInspect(object, true, null, true);
};
