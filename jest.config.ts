import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",

  // From https://stackoverflow.com/questions/58603201/jest-cannot-load-svg-file
  transform: {
    "^.+\\.svg$": "<rootDir>/svgTransform.ts",
  },
};

export default config;
