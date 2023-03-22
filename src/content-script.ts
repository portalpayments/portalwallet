// Still needs a async wrapper to use await, otherwise
// "await is only valid in async functions and the top level bodies of modules"

const main = async () => {
  const log = console.log;
  log(`Empty content script. Ignore me`);
};

main();

// Avoid a warning
export {};
