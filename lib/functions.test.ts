import {
  runInSequence,
  deepClone,
  asyncMap,
  sleep,
  print,
  nonNullable,
  makePromise,
  withTimeout,
  hasOwnProperty,
  isEmpty,
  toUnique,
  encodeToBase64,
  decodeFromBase64,
  adjustYear,
} from "./functions";
import { SECOND, SECONDS } from "./utils";

describe(`deepClone`, () => {
  it(`Deep clones object`, () => {
    const names = ["frank"];
    const original = { names };
    const clone = deepClone(original);
    names.push("nancy");
    expect(clone.names).toEqual(["frank"]);
  });

  it(`Deep clones arrays`, () => {
    const shopping = [
      {
        bananas: {
          isPurchased: false,
        },
      },
    ];
    const original = shopping;
    const clone = deepClone(original);
    shopping[0].bananas.isPurchased = true;
    expect(clone[0].bananas.isPurchased).toBeFalsy();
  });
});

describe(`print`, () => {
  it(`formats objects nicely`, () => {
    const result = print({ location: { city: "London" } });
    expect(result).toMatchSnapshot();
  });
});

describe(`sleep`, () => {
  it(`sleeps for the time specified`, async () => {
    await sleep(100);
    // Entire test should run in 100ms plus some leeway
  }, 120);
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

describe(`runInSequence`, () => {
  const doubleNumber = async (aNumber: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve(aNumber * 2);
      }, 100);
    });
  };

  it(`runs the async function over every item in the array`, async () => {
    const array = [1, 2, 3];
    const result = await runInSequence(array, doubleNumber);
    expect(result).toEqual([2, 4, 6]);
    // 3 * 100ms plus some leeway
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

describe("withTimeout", () => {
  it("should not throw error if promise is resolved before timeout", async () => {
    jest.useFakeTimers();
    const promise = makePromise("ok");
    const result = withTimeout(promise, 1 * SECOND);
    jest.runAllTimers();
    expect(await result).toEqual("ok");
    jest.useRealTimers();
  });

  it("should reject with default message if promise is not resolved before timeout", async () => {
    jest.useFakeTimers();
    const promise = makePromise(sleep(2 * SECONDS));
    const result = withTimeout(promise, 1 * SECOND);
    jest.runAllTimers();
    await expect(result).rejects.toEqual(
      "Timeout! Operation did not complete within 1000 ms"
    );
    jest.useRealTimers();
  });

  it("should reject with custom message if promise is not resolved before timeout", async () => {
    jest.useFakeTimers();
    const promise = makePromise(sleep(2 * SECONDS));
    const result = withTimeout(promise, 1 * SECOND, "custom");
    jest.runAllTimers();
    await expect(result).rejects.toEqual("custom");
    jest.useRealTimers();
  });

  it("should throw error if promise is rejected", async () => {
    jest.useFakeTimers();
    const promise = Promise.reject("Boom!!!");
    const result = withTimeout(promise, 1 * SECOND, "custom");
    jest.runAllTimers();
    await expect(result).rejects.toEqual("Boom!!!");
    jest.useRealTimers();
  });
});

describe(`toUnique`, () => {
  it(`returns a unique set of items`, () => {
    const items = toUnique(["one", "two", "one"]);
    expect(items).toEqual(["one", "two"]);
  });
});

describe(`hasOwnProperty`, () => {
  it(`find properties where they exist`, () => {
    expect(hasOwnProperty({ name: "steve" }, "name")).toBeTruthy();
  });

  it(`doesn't find properties where they don't exist`, () => {
    expect(hasOwnProperty({ name: "steve" }, "shoeSize")).toBeFalsy();
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
