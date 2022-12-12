export const log = console.log.bind(console);

export const stringify = (object: any) => {
  return JSON.stringify(object, null, 2);
};
