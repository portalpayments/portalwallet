// Still needs a async wrapper to use await, otherwise
// "await is only valid in async functions and the top level bodies of modules"

import type { PortalMessage } from "src/backend/types";
import { log, stringify } from "../backend/functions";

const main = async () => {
  log(`In content script`);

  window.addEventListener(
    "message",
    async (event) => {
      log(`In the content script, recieved a message from the page's JS!`);
      // We only accept messages from our own window
      if (event.source !== window) {
        return;
      }

      const message: PortalMessage = event?.data || null;

      if (!message) {
        throw new Error(`No message in event from wallet`);
      }

      if (!message.topic) {
        throw new Error(`No message.topic in event from wallet`);
      }

      if (
        message.topic === "walletStandardConnect" ||
        message.topic === "walletStandardSignMessage"
      ) {
        log(`The content script received: ${stringify(message)}`);
        log(
          `We will forward the message on to the rest of the extension - we should see an indicator on the popup now`
        );
        // Forward the message onto the service worker (we use the same format we got it from the injected wallet)
        const reply = await chrome.runtime.sendMessage(message);
        log(`Content script recieved reply:`, reply);
      }
    },
    false
  );
};

main();

// Avoid a warning
export {};
