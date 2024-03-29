import { SECONDS } from "src/backend/constants";
import { runWithTimeout, stringify, log } from "src/backend/functions";
import type { PortalMessage } from "src/backend/types";
const ANY_ORIGIN = "*";

export const sendMessageToContentScript = (message: PortalMessage) => {
  window.postMessage(message, ANY_ORIGIN);
};

export const sendMessageAndMaybeGetReply = (message: PortalMessage, replyTopic: string): Promise<PortalMessage> => {
  return new Promise((resolve, reject) => {
    // We do this in a slightly out-of-order style:
    // 1. Be ready to handle replies
    const handler = (event: MessageEvent) => {
      const { topic } = event.data;
      if (topic === replyTopic) {
        window.removeEventListener("message", handler);
        resolve(event.data as PortalMessage);
      }
    };
    window.addEventListener("message", handler);

    // 2. Now send out the message that will hopefully get a reply
    sendMessageToContentScript(message);
  });
};

// Make the wallet popup shine so the users clicks on it.
// Give the user some time to approve, decline or do nothing
export const sendMessageAndMaybeGetReplyOrTimeout = async (
  message: PortalMessage,
  replyTopic: string,
  timeout: number = 20 * SECONDS
) => {
  let reply: PortalMessage = null;
  try {
    reply = (await runWithTimeout(sendMessageAndMaybeGetReply(message, replyTopic), timeout)) || null;
  } catch (thrownObject) {
    const error = thrownObject as Error;
    if (error.message.includes("Timeout")) {
      log(`The user did not reply in time, clearing user approval`);
    } else {
      log(`Unexpected error`, error.message);
    }
    sendMessageToContentScript({ topic: "clearPendingUserApproval" });
    return null;
  }
  log(`We got a reply from the user.`);
  sendMessageToContentScript({ topic: "clearPendingUserApproval" });
  return reply;
};
