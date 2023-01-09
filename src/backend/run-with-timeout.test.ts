import { MILLISECONDS, SECOND, SECONDS } from "./constants";
import { sleep, log } from "./functions";
import { runRepeatedlyWithTimeout } from "./run-with-timeout";

let attempt: number = 0;

const workASecondTime = async () => {
  attempt++;
  await sleep(1 * SECOND);
  if (attempt === 1) {
    throw new Error(`I always fail the first time I am run`);
  }
  return "Success!";
};

describe(`workASecondTime`, () => {
  test(`fails the first time`, async () => {
    try {
      await workASecondTime();
      throw new Error(`test should have thrown an error`);
    } catch (error) {
      expect(error.message).toEqual("I always fail the first time I am run");
    }
  });

  test(`works the second time`, async () => {
    let result = await workASecondTime();
    expect(result).toEqual("Success!");
  });
});

describe(`runRepeatedlyWithTimeout`, () => {
  beforeAll(() => {
    attempt = 0;
  });
  test(`returns a result, when the second try works, and the time limit isn't reached`, async () => {
    const result = await runRepeatedlyWithTimeout(
      workASecondTime,
      1 * SECOND,
      4 * SECONDS
    );
    await expect(result).toEqual("Success!");
  });

  test(`fails, when the time limit is reached`, async () => {
    let result: string;
    try {
      result = await runRepeatedlyWithTimeout(
        workASecondTime,
        1 * SECOND,
        1.5 * SECONDS
      );
      throw new Error(`test should have thrown an error`);
    } catch (error) {
      expect(error.message).toEqual("Timeout of 1500ms reached");
    }
  });
});
