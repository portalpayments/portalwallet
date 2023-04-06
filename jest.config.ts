import type { Config } from "jest";
import { SECONDS } from "./src/backend/constants";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  // https://jestjs.io/docs/configuration#openhandlestimeout-number
  openHandlesTimeout: 2 * SECONDS,

  // From https://stackoverflow.com/questions/58603201/jest-cannot-load-svg-file
  transform: {
    "^.+\\.svg$": "<rootDir>/svgTransform.ts",
  },
};

export default config;
