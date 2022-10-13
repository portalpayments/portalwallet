// Quiet functions.log() during tests
export default {
  ...jest.requireActual("./functions"),
  log: jest.fn(),
};
