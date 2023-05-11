import localforage from "localforage";
import { log } from "../backend/functions";

interface SavedItem {
  savedTime: number;
  [key: string]: unknown;
}

export const getFromLocalStorageIfFresh = async (key: string, maximumAge: number): Promise<SavedItem | null> => {
  const savedItem = (await localforage.getItem("key")) as SavedItem;
  if (!Object.hasOwn(savedItem, "savedTime")) {
    throw new Error(
      `Cannot determine freshness of item with key ${key} from localforage - item is missing 'savedTime' key`
    );
  }
  const oldestFreshTime = Date.now() - maximumAge;
  if (savedItem.savedTime < oldestFreshTime) {
    log(`Found an item with key ${key} in localforage but it's too old`);
    return null;
  }
  log(`Found an item with key ${key} in localforage and it's fresh`);
  return savedItem;
};

export const setItemToLocalStorageWithSavedTime = async (key: string, object: Record<string, unknown>) => {
  object.savedTime = Date.now();
  const result = await localforage.setItem(key, object);
  return result;
};
