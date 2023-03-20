// localforage doesn't work in node, so simulate it

const fakeLocalForageStore: Record<string, any> = {};

export const getItem = (key) => {
  return fakeLocalForageStore[key] || null;
};

export const setItem = (key, value) => {
  return (fakeLocalForageStore[key] = value);
};

export const localforage = {
  getItem,
  setItem,
};

export default localforage;
