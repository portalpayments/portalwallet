import { log } from "./functions";

// Code suggested by ChatGPT!
export const runRepeatedlyWithTimeout = async function (
  intervalFunction: () => any,
  interval: number,
  timeout: number
): Promise<any> {
  let intervalId: NodeJS.Timeout;
  let timeoutId: NodeJS.Timeout;
  let currentAttempt = 1;

  const timeoutPromise = new Promise((resolve, reject) => {
    timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      reject(new Error(`Timeout of ${timeout}ms reached`));
    }, timeout);
  });

  const intervalPromise = new Promise((resolve) => {
    intervalId = setInterval(async () => {
      // log(`runRepeatedlyWithTimeout attempt ${currentAttempt}`);
      try {
        let resultFromIntervalFunction = await intervalFunction();

        // Stop the repeated running
        clearInterval(intervalId);
        result = resultFromIntervalFunction;
        resolve(resultFromIntervalFunction);
      } catch (error) {
        // We don't ever throw errors, we just run infinitely.
      }
      currentAttempt = currentAttempt + 1;
    }, interval);
  });

  let result: any;
  try {
    result = await Promise.race([timeoutPromise, intervalPromise]);
    clearInterval(timeoutId);
    clearInterval(intervalId);

    return result;
  } catch (error) {
    throw error;
  }
};
