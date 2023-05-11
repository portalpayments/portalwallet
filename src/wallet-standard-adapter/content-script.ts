// Still needs a async wrapper to use await, otherwise
// "await is only valid in async functions and the top level bodies of modules"

import type { PendingUserApproval, PortalMessage, SendReply } from "src/backend/types";
import { log, stringify } from "../backend/functions";
import { addMessageListener, clearBadge } from "src/extension-helpers";

const main = async () => {
  log(`In content script`);

  // Part 1 - wait for messages from the page's own JavaScript
  // and send them to the rest of the extension
  window.addEventListener(
    "message",
    async (event) => {
      log(`In the content script, recieved a message from the page's JS`);
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

      if (message.topic === "walletStandardConnect" || message.topic === "walletStandardSignMessage") {
        log(`The content script received: ${stringify(message)}`);
        log(
          `We will forward the message on to the rest of the extension - we should see an indicator on the popup now`
        );
        // Forward the message onto the service worker (we use the same format as the injected wallet)
        const reply = await chrome.runtime.sendMessage(message);

        // Note: this is just an acknowledgement. When the user clicks deny / allow we'll get a real result via walletStandardSignMessageResponse
        log(`Content script recieved an acknowlegement reply`, stringify(reply));
      }
    },
    false
  );

  // Part 2 - wait for messages from the rest of the extension
  // and send them to the page's own JavaScript
  addMessageListener("walletStandardSignMessageResponse", async (message: PortalMessage, sendReply: SendReply) => {
    log(`😃😃😃 Content script: the user has responded to the message signing UI...`);

    clearBadge();

    // Send the user's response to the injected wallet
    window.postMessage(message);

    // Not important, but we do need to reply because sendMessage() awaits the result.
    sendReply({
      topic: "replyWalletStandardSignMessageResponse",
    });
  });

  // Why isn't front end responding?

  log("Completd content script setup");
};

main();

// Avoid a warning
export {};
