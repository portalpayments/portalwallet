import {
  asyncMap,
  sleep,
  stringify,
  nonNullable,
  makePromise,
  isEmpty,
  toUnique,
  encodeToBase64,
  decodeFromBase64,
  adjustYear,
} from "./functions";
import { SECOND, SECONDS } from "./constants";

jest.mock("./functions");

describe(`print`, () => {
  it(`formats objects nicely`, () => {
    const result = stringify({ location: { city: "London" } });
    expect(result).toMatchSnapshot();
  });
});

describe(`sleep`, () => {
  it(`sleeps for the time specified`, async () => {
    await sleep(100);
    // Entire test should run in 100ms plus some leeway
  }, 150);
});

describe(`asyncMap`, () => {
  it(`runs 3 items in parallel and returns results`, async () => {
    const result = await asyncMap([1, 2, 3], async (item: number) => {
      await sleep(item * 100);
      return `Finished ${item}`;
    });
    expect(result).toEqual(["Finished 1", "Finished 2", "Finished 3"]);
    // Each item takes 100, 200 and 300ms
    // So restricting this test to 300ms plus some leeway
  }, 320);
});

describe(`nonNullable`, () => {
  it(`removes nullable items`, async () => {
    const animals = ["cat", null, "dog", undefined];
    const filteredAnimals = animals.filter(nonNullable);
    expect(filteredAnimals).toEqual(["cat", "dog"]);
  });
});

describe(`makePromise`, () => {
  it(`Makes promises`, async () => {
    const promise: Promise<string> = makePromise("some Value");
    expect(await promise).toEqual("some Value");
  });
});

describe(`toUnique`, () => {
  it(`returns a unique set of items`, () => {
    const items = toUnique(["one", "two", "one"]);
    expect(items).toEqual(["one", "two"]);
  });
});

describe(`isEmpty`, () => {
  it(`returns true for empty objects`, () => {
    expect(isEmpty({})).toBeTruthy();
  });

  it(`returns false for objects with some keys`, () => {
    expect(isEmpty({ key: "value" })).toBeFalsy();
  });
});

describe(`encodeToBase64`, () => {
  it(`encodes accurately`, () => {
    expect(encodeToBase64("a string")).toEqual("YSBzdHJpbmc=");
  });
});

describe(`decodeFromBase64`, () => {
  it(`decodes accurately`, () => {
    expect(decodeFromBase64("YSBzdHJpbmc=")).toEqual("a string");
  });
});

describe(`adjustYear`, () => {
  it(`doesn't modify the original date`, () => {
    const aDate = new Date("2022-04-20T16:20:00.000Z");
    const firstResult = adjustYear(aDate, -1);
    const secondSResult = adjustYear(aDate, -2);
    expect(firstResult).toEqual(new Date("2021-04-20T16:20:00.000Z"));
    expect(secondSResult).toEqual(new Date("2020-04-20T16:20:00.000Z"));
    expect(aDate).toEqual(new Date("2022-04-20T16:20:00.000Z"));
  });

  it(`handles leap days`, () => {
    const dateAfterALeapDay = new Date("2024-04-20T16:20:00.000Z");
    const aYearAgo = adjustYear(dateAfterALeapDay, -1);
    expect(aYearAgo).toEqual(new Date("2023-04-20T16:20:00.000Z"));
  });
});
