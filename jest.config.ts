import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Suppress 'A worker process has failed to exit gracefully and has been force exited.'
  // Oddly this doesn't detect any open handles, but it does stop the message.
  // TODO: fix when we can be bothered.
  detectOpenHandles: true,
  // Workaround for open handles - https://github.com/solana-labs/solana/issues/27464
  // and https://solana.stackexchange.com/questions/1685/how-do-i-prevent-open-handles-issues-when-using-the-solana-connection-object
  // Note this causes Jest to always exit successfully, which sucks, but it beats two pages of error messages whenever we run tests.
  // From https://github.com/visionmedia/supertest/issues/520#issuecomment-909989004
  globalTeardown: "./test-teardown-globals.ts",

  // From https://stackoverflow.com/questions/58603201/jest-cannot-load-svg-file
  transform: {
    "^.+\\.svg$": "<rootDir>/svgTransform.ts",
  },
};

export default config;
