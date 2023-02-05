// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import {
  amountAndDecimalsToMajorAndMinor,
  amountAndDecimalsToString,
  getFormattedMajorUnits,
  getFormattedMinorUnits,
  getMultiplier,
  truncateWallet,
} from "./utils";

jest.mock("../backend/functions");

describe(`amountAndDecimalsToString`, () => {
  test(`amountAndDecimalsToString is accurate`, () => {
    const string = amountAndDecimalsToString(900, 2);
    expect(string).toEqual("9.00");
  });

  test(`amountAndDecimalsToString is accurate`, () => {
    const string = amountAndDecimalsToString(900, 2);
    expect(string).toEqual("9.00");
  });
});
describe(`amountAndDecimalsToMajorAndMinor`, () => {
  test(`handles majors and minors properly`, async () => {
    const [major, minor] = amountAndDecimalsToMajorAndMinor(9500000, 6);
    expect(major).toEqual("9");
    expect(minor).toEqual("50");
  });

  test(`shows 00 for whole number amounts`, async () => {
    const [major, minor] = amountAndDecimalsToMajorAndMinor(9000000, 6);
    expect(major).toEqual("9");
    expect(minor).toEqual("00");
  });

  test(`leads with zero for cent amounts`, async () => {
    const [major, minor] = amountAndDecimalsToMajorAndMinor(900000, 6);
    expect(major).toEqual("0");
    expect(minor).toEqual("90");
  });

  test(`leads with zero for tiny cent amounts`, async () => {
    const [major, minor] = amountAndDecimalsToMajorAndMinor(90000, 6);
    expect(major).toEqual("0");
    expect(minor).toEqual("09");
  });
});

test(`getMultiplier for 2 digits is 100`, async () => {
  expect(getMultiplier(2)).toEqual(100);
});

test(`getFormattedMajorUnits formats major units correctly`, async () => {
  expect(getFormattedMajorUnits(12345678)).toEqual("123,456");
});

test(`getFormattedMinorUnits formats minor units correctly`, async () => {
  expect(getFormattedMinorUnits(12345678)).toEqual(".78");
});

test(`getFormattedMinorUnits shows .70 not .7`, async () => {
  expect(getFormattedMinorUnits(12345670)).toEqual(".70");
});

test(`getFormattedMinorUnits returns nothing for .00`, async () => {
  expect(getFormattedMinorUnits(12345600)).toEqual("");
});

test(`truncateWallet truncates wallets properly`, () => {
  expect(
    truncateWallet("BfkRD3gGQGLjHxUw7oqhizkaxrDrw7itHT98f9j2gh6t")
  ).toEqual("BfkRD...2gh6t");
});
