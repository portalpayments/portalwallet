// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
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
    clearInterval(timeoutId);
    clearInterval(intervalId);
    throw error;
  }
};
