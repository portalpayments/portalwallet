// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//

import type { text } from "svelte/internal";
import { MILLISECONDS, SECONDS } from "./backend/constants";
import { log } from "./backend/functions";
import type { HandleMessage, PortalMessage } from "./backend/types";

const BLOCK_LIST = [
  // Work around a silly error where ntp.msn.com would appear on new tab page then disappear as soon as loaded
  "ntp.msn.com",
  // DevTools opens https://devtools.azureedge.net/serve_file/@7069649d605643a097c48b2aca67b600bc362a4f/third_party/webhint/worker_frame.html
  // Seems to be part of devtools but not loaded via devtools://
  // Blocking it fixes "Extension manifest must request permission to access this host." error.
  "https://devtools",
];

// 30 FPS = 1 frame every 33 ms (we could do 60 but I can't be bothered doing more image exports)
const FRAME_INTERVAL = 33;
// Animation goes for 25 frames.
const FRAMES_IN_ANIMATION = 25;

const MID_BLUE = "#419cfd";

let shineInterval: NodeJS.Timer | null = null;

export const makeIconShine = () => {
  log(`Making toolbar icon active`);

  chrome.action.setBadgeText({ text: "i" });
  chrome.action.setBadgeBackgroundColor({
    // mid-blue from app.scss
    color: MID_BLUE,
  });

  let currentFrame = 0;

  const startDate = Date.now();

  let interval: NodeJS.Timer;

  shineInterval = setInterval(() => {
    chrome.action.setIcon({ path: `/assets/toolbar/portal-icon-shining-${currentFrame}.png` });
    // Zero indexed
    if (currentFrame + 1 === FRAMES_IN_ANIMATION) {
      currentFrame = 0;
      return;
    }
    currentFrame++;
  }, FRAME_INTERVAL);
  log(`Has started animating icon`);
};

export const clearBadge = () => {
  log(`Clearing badge text and background color`);

  chrome.action.setIcon({ path: `/assets/toolbar/portal-icon.png` });

  clearInterval(shineInterval);

  chrome.action.setBadgeText({
    text: "",
  });

  chrome.action.setBadgeBackgroundColor({
    color: "transparent",
  });

  log(`Finished clearing badge text and background color`);
};

export const checkIsBlocked = (url: string): boolean => {
  const isLocalhost = url.startsWith("http://localhost");
  const isEncrypted = url.startsWith("https");
  if (!(isLocalhost || isEncrypted)) {
    return true;
  }
  const isBlocked =
    BLOCK_LIST.some((string: string) => {
      return url.includes(string);
    }) || false;
  return isBlocked;
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

    // Add tabId to the message if there is one since if we want to send another message in reply, we will
    // need to know the tabId for chrome.tabs.sendMessage()
    message.tabId = sender?.tab?.id || null;

    if (message.tabId) {
      log(`📩 Handling message from ${messageSender} on this topic: '${message.topic}' from tab ${message.tabId}`);
    } else {
      log(`📩 Handling message from ${messageSender} on this topic: '${message.topic}'`);
    }

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
