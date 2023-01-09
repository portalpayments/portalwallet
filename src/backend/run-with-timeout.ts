import { log } from "./functions";

// Code suggested by ChatGPT!
export const runRepeatedlyWithTimeout = async function (
  intervalFunction: () => any,
  interval: number,
  timeout: number
): Promise<any> {
  let result: any;
  let lastError: Error;
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
        // TODO: kinda a bit weird, this function returns null in it's own promise
        // but does set 'result' in the parent so technically it works
        // We should refactor and make less weird.
        // I *guess* it's because error is the last thrown error
        result = resultFromIntervalFunction;
        lastError = null;
        resolve(null);
      } catch (error) {
        lastError = error;
      }
      currentAttempt = currentAttempt + 1;
    }, interval);
  });

  await Promise.race([timeoutPromise, intervalPromise]);

  if (lastError) {
    throw lastError;
  }

  return result;
};
