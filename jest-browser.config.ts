import type { Config } from "jest";

import typeScriptPreset from "ts-jest/jest-preset";
import puppeteerPreset from "jest-puppeteer/jest-preset";

const config: Config = {
  ...typeScriptPreset,
  ...puppeteerPreset,
  testMatch: ["**/*.browser.test.ts"],
  // See https://stackoverflow.com/questions/73203367/jest-syntaxerror-unexpected-token-export-with-uuid-library
  moduleNameMapper: { "^uuid$": "uuid" },
};

export default config;
