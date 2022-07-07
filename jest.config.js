module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Suppress 'A worker process has failed to exit gracefully and has been force exited.'
  // Oddly this doesn't detect any open handles, but it does stop the message.
  // TODO: fix when we can be bothered.
  detectOpenHandles: true,
};
