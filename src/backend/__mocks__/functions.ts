const actualFunctions = jest.requireActual("../functions");

// Mock this
export const log = jest.fn();

// Use actual implementation of everything else
export const toUnique = actualFunctions.toUnique;
export const adjustYear = actualFunctions.adjustYear;
export const encodeToBase64 = actualFunctions.encodeToBase64;
export const decodeFromBase64 = actualFunctions.decodeFromBase64;
export const asyncFilter = actualFunctions.asyncFilter;
export const minorUnitsToDecimal = actualFunctions.minorUnitsToDecimal;
export const asyncMap = actualFunctions.asyncMap;
export const sleep = actualFunctions.sleep;
export const stringify = actualFunctions.stringify;
export const isEmpty = actualFunctions.isEmpty;
export const nonNullable = actualFunctions.nonNullable;
export const makePromise = actualFunctions.makePromise;
export const hexToUtf8 = actualFunctions.hexToUtf8;
export const instructionDataToNote = actualFunctions.instructionDataToNote;
