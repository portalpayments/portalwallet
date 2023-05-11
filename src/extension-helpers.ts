// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
import { log } from "./backend/functions";
import type { HandleMessage, PortalMessage } from "./backend/types";

// Make the Portal toolbar icon glow so users click the toolbar icon
export const setBadge = (text: string, backgroundColor: string) => {
  log(`Setting badge text and background color`);

  try {
    chrome.action.setBadgeText({
      text,
    });

    // Does not appear in docs, but does actually work!
    // @ts-ignore
    chrome.action.setBadgeTextColor({
      color: "white",
    });

    chrome.action.setBadgeBackgroundColor({
      // mid-blue from app.scss
      color: backgroundColor,
    });
  } catch (error) {
    // May recieve something like: 'Error: No tab with id'...
    log(error);
    log(chrome.runtime.lastError.message);
    debugger;
    //
  }

  log(`Finished setting badge text and background color`);
};

export const clearBadge = () => {
  log(`Clearing badge text and background color`);

  chrome.action.setBadgeText({
    text: "",
  });

  chrome.action.setBadgeBackgroundColor({
    color: "transparent",
  });

  log(`Finished clearing badge text and background color`);
};

// Check https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/Runtime/onMessage
// for better docs but also note that Chrome doesn't support Promises in onMessage() yet.

// From https://developer.chrome.com/docs/extensions/mv3/messaging/
// If multiple pages are listening for onMessage events, only the first to call sendResponse() for a particular event will succeed in sending the response. All other responses to that event will be ignored.

// We use onMessage.addListener() instead of self.addEventListener("message")
// See https://stackoverflow.com/questions/75824421/should-a-mv3-extension-use-chrome-runtime-sendmessage-or-serviceworker-control/75825039#75825039
export const addMessageListener = (topic: string, handleMessage: HandleMessage) => {
  const listener = (message, sender, sendReply) => {
    const messageSender = sender?.tab?.url || sender?.origin || "unknown";
    if (message.topic !== topic) {
      // log(`DEBUG ignoring message from ${messageSender} on this topic: '${message.topic}' (expect many of these)`);
      return;
    }
    log(`📩 Handling message from ${messageSender} on this topic: '${message.topic}'`);
    const resultPromise = handleMessage(message as PortalMessage, sendReply);
    resultPromise.then((result) => {
      sendReply(result);
    });
    // From https://developer.chrome.com/docs/extensions/mv3/messaging/#simple
    // To asynchronously use sendResponse(), add return true; to the onMessage event handler.

    // return true from the event listener to indicate you wish to send a response asynchronously (this will keep the message channel open to the other end until sendResponse is called).
    return true;
  };
  chrome.runtime.onMessage.addListener(listener);
};
