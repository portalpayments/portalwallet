import {
  amountAndDecimalsToMajorAndMinor,
  getFormattedMajorUnits,
  getFormattedMinorUnits,
  getMultiplier,
} from "./utils";

jest.mock("../backend/functions");

describe(`utils`, () => {
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
});
