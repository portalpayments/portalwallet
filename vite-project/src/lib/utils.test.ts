import {
  getFormattedMajorUnits,
  getFormattedMinorUnits,
  getMultiplier,
} from "./utils";

describe(`utils`, () => {
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
