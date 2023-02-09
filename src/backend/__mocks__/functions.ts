// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
const actualFunctions = jest.requireActual("../functions");

// Mock this, so we don't get logs during tests.
export const log = jest.fn();

// Use actual implementation of everything else
export const debug = actualFunctions.debug;
export const solanaBlocktimeToJSTime = actualFunctions.solanaBlocktimeToJSTime;
export const isIncludedCaseInsensitive =
  actualFunctions.isIncludedCaseInsensitive;
export const removeSign = actualFunctions.removeSign;
export const invertNumber = actualFunctions.invertNumber;
export const flipZeroAndOne = actualFunctions.flipZeroAndOne;
export const isPositive = actualFunctions.isPositive;
export const dateToISODate = actualFunctions.dateToISODate;
export const isoDateToFriendlyName = actualFunctions.isoDateToFriendlyName;
export const byDateNewestToOldest = actualFunctions.byDateNewestToOldest;
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
export const toArrayBuffer = actualFunctions.toArrayBuffer;
export const addItemsAndStayUnique = actualFunctions.addItemsAndStayUnique;
