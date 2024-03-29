// Still needs a async wrapper to use await, otherwise
// "await is only valid in async functions and the top level bodies of modules"

import type { PendingUserApproval, PortalMessage, SendReply } from "src/backend/types";
import { log, stringify } from "../backend/functions";
import { addMessageListener, stopIconShine } from "src/extension-helpers";

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

      // Everything else gets passed to rest of extension
      log(
        `The content script received: ${stringify(
          message
        )} from the page, we will forward the message on to the rest of the extension`
      );
      // Forward the message onto the service worker (we use the same format as the injected wallet)
      await chrome.runtime.sendMessage(message);
    },
    false
  );

  // Part 2 - wait for messages from the rest of the extension
  // and send them to injected wallet on the page's own JavaScript
  addMessageListener("replyWalletStandardSignMessage", async (message: PortalMessage, sendReply: SendReply) => {
    log(`😃😃😃 Content script: the user has responded to the message signing UI...`);
    window.postMessage(message);
  });

  addMessageListener("replyGetPublicKey", async (message: PortalMessage, sendReply: SendReply) => {
    log(`😃😃😃 Content script: the service worker has sent us the public key`);
    window.postMessage(message);
  });

  addMessageListener("replyWalletStandardApproveTransaction", async (message: PortalMessage, sendReply: SendReply) => {
    log(`😃😃😃 Content script: the user has responded to the transaction approval UI...`);
    window.postMessage(message);
  });

  log("Completed content script setup");
};

main();

// Avoid a warning
export {};
