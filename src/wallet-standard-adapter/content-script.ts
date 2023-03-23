// Still needs a async wrapper to use await, otherwise
// "await is only valid in async functions and the top level bodies of modules"

import { log, stringify } from "../backend/functions.js";

const main = async () => {
  log(`In content script`);
  // const port = chrome.runtime.connect();

  window.addEventListener(
    "message",
    (event) => {
      log(`In the content script, recieved a message from the page's JS!`);
      // We only accept messages from ourselves
      if (event.source !== window) {
        return;
      }

      const source = event?.data?.source || null;
      const message = event?.data?.message || null;

      if (source === "PORTAL_INJECTED_PAGE") {
        log(`The content script received: ${stringify(message)}`);
        log(`We should start the popup now`);
      }
    },
    false
  );
};

main();

// Avoid a warning
export {};
