// localforage doesn't work in node, so simulate it

const fakeLocalForageStore: Record<string, any> = {};

// Exported to allow import * as localforage to work
export const getItem = (key) => {
  return fakeLocalForageStore[key] || null;
};

// Exported to allow import * as localforage to work
export const setItem = (key, value) => {
  return (fakeLocalForageStore[key] = value);
};

export default {
  getItem,
  setItem,
};
