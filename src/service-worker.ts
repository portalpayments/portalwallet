// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.

// Do not move this file into a folder!
// Service workers must be in location that 'manages' the result on the content
// See https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/service-workers

// localForage seems to want window.
self.window = self;

// Yes use .js, TypeScript will apparently figure it out, as .ts breaks.
// https://stackoverflow.com/questions/62619058/appending-js-extension-on-relative-import-statements-during-typescript-compilat
import type { AccountSummary, Contact, PortalMessage, PendingUserApproval } from "./backend/types.js";
import { log, isFresh, stringify } from "./backend/functions";
import { addMessageListener, setBadge } from "./extension-helpers";
import { cacheWebRequests } from "./service-worker-webcache";
// See https://github.com/localForage/localForage/issues/831
import type LocalForageType from "localforage";
import localForageImport from "localforage/src/localforage.js";
const localforage: typeof LocalForageType = localForageImport;

//  Cannot access chrome:// and edge:// URLs
if (!window.location.protocol.startsWith("http")) {
  log(`Not loading service worker for a chrome:// or edge:// URL (${window.location.href}).`);
}

const VERSION = 23;
log(`VERSION IS ${VERSION}`);

const MINUTES = 60 * 1000;
const HOUR = 60 * MINUTES;

const ACCOUNT_CACHE = 1 * HOUR;

// From app
const MID_BLUE = "#419cfd";
const RED = "#ff0000";

// In base58
// TODO: we could simply derive publicKey from secretKey
// (to not be redundant) however because service workers fail
// in odd ways and are difficult to debug, we try and keep the
// service worker minimal.
let secretKey: string | null = null;
let publicKey: string | null = null;

let nativeAccountSummary: AccountSummary | null = null;
let tokenAccountSummaries: Array<AccountSummary> | null = null;
let contacts: Array<Contact> | null = null;

// https://developer.chrome.com/docs/extensions/mv3/service_workers/
// and https://github.com/GoogleChrome/chrome-extensions-samples
// From https://dev.to/wtho/custom-service-worker-logic-in-typescript-on-vite-4f27

log(`Parsing service worker version: ${VERSION}`);

let pendingUserApproval: null | PendingUserApproval = null;

// https://developer.chrome.com/docs/extensions/reference/runtime/#event-onMessage
type SendReply = (object: any) => void;

const setPendingUserApproval = async (message: PortalMessage) => {
  setBadge("i", MID_BLUE);

  const newPendingUserApproval: Partial<PendingUserApproval> = structuredClone(message);
  newPendingUserApproval.time = Date.now();

  // Set something requiring approval
  pendingUserApproval = newPendingUserApproval as PendingUserApproval;

  log(`Saved pendingUserApproval in service worker.`);

  await localforage.setItem("PENDING_USER_APPROVAL", pendingUserApproval);
  log(`Also saved to localforage, just in case the service worker is terminated`);
};

addMessageListener("walletStandardConnect", async (message: PortalMessage, sendReply: SendReply) => {
  setBadge("i", MID_BLUE);
  // TODO: maybe pulse it for a bit on animation etc.
});

addMessageListener("getPublicKey", async (message: PortalMessage, sendReply: SendReply) => {
  if (!publicKey) {
    log(`Service worker doesn't know the public key (we are probably not logged in recently)`);
    sendReply({
      topic: "replyGetPublicKey",
      publicKey: null,
    });
    await setPendingUserApproval(message);
    return;
  }
  log(`Service worker knows the public key, sending it`);
  sendReply({
    topic: "replyGetPublicKey",
    publicKey,
  });
});

addMessageListener("walletStandardSignMessage", async (message: PortalMessage, sendReply: SendReply) => {
  setBadge("i", MID_BLUE);

  if (!message.text) {
    throw new Error(`walletStandardSignMessage is missing 'text' key`);
  }

  if (!message.url) {
    throw new Error(`walletStandardSignMessage is missing 'url' key`);
  }

  await setPendingUserApproval(message);
  // No need to reply

});

addMessageListener("getSecretKey", async (message: PortalMessage, sendReply: SendReply) => {
  if (secretKey) {
    log(`😃 Service worker cache: we have the secret key`);
  } else {
    log(`☹️ Service worker does not have the secret key`);
  }
  sendReply({
    topic: "replyGetSecretKey",
    secretKey,
  });
});

addMessageListener("setKeypair", async (message: PortalMessage, sendReply: SendReply) => {
  secretKey = message.secretKey;
  publicKey = message.publicKey;
});

addMessageListener("getNativeAccountSummary", async (message: PortalMessage, sendReply: SendReply) => {
  if (nativeAccountSummary) {
    log(`😃 Service worker cache: we have the nativeAccountSummary in memory already`);

    sendReply({
      topic: "replyNativeAccountSummary",
      nativeAccountSummary,
    });
    return;
  }
  const nativeAccountSummaryFromLocalForage = (await localforage.getItem("NATIVE_ACCOUNT_SUMMARY")) as AccountSummary;
  if (nativeAccountSummaryFromLocalForage) {
    if (isFresh(nativeAccountSummaryFromLocalForage.lastUpdated, ACCOUNT_CACHE)) {
      log(`😀 Service worker cache: we have the nativeAccountSummary in localforage and it's fresh!`);
      sendReply({
        topic: "replyNativeAccountSummary",
        nativeAccountSummary: nativeAccountSummaryFromLocalForage,
      });
      return;
    } else {
      log(`☹️ Service worker cache: we have the nativeAccountSummary in localforage but it's not fresh`);
      return;
    }
  }
  log(`☹️ Service worker does not have the nativeAccountSummary`);
});

addMessageListener("setNativeAccountSummary", async (message: PortalMessage, sendReply: SendReply) => {
  nativeAccountSummary = message.nativeAccountSummary;
  nativeAccountSummary.lastUpdated = Date.now();
  await localforage.setItem("NATIVE_ACCOUNT_SUMMARY", nativeAccountSummary);
  log(`Saved NATIVE_ACCOUNT_SUMMARY to localForage`);
});

addMessageListener("getTokenAccountSummaries", async (message: PortalMessage, sendReply: SendReply) => {
  if (tokenAccountSummaries) {
    log(`😃 Service worker cache: we have the tokenAccountSummaries`);

    sendReply({
      topic: "replyTokenAccountSummaries",
      tokenAccountSummaries,
    });
    return;
  }
  const tokenAccountSummariesFromLocalForage = (await localforage.getItem(
    "TOKEN_ACCOUNT_SUMMARIES"
  )) as Array<AccountSummary>;

  const allAreFresh =
    tokenAccountSummariesFromLocalForage &&
    tokenAccountSummariesFromLocalForage.every((accountSummary) => isFresh(accountSummary.lastUpdated, ACCOUNT_CACHE));

  if (allAreFresh) {
    log(`😀 Service worker cache: we have the tokenAccountSummaries in localforage and they're all fresh!`);
    sendReply({
      topic: "replyTokenAccountSummaries",
      tokenAccountSummaries: tokenAccountSummariesFromLocalForage,
    });
    return;
  } else {
    log(`☹️ Service worker cache: we have the tokenAccountSummaries in localforage but they're not all fresh`);
  }

  log(`☹️ Service worker does not have the tokenAccountSummaries`);
  return;
});

addMessageListener("setTokenAccountSummaries", async (message: PortalMessage, sendReply: SendReply) => {
  tokenAccountSummaries = message.tokenAccountSummaries;
  tokenAccountSummaries.map((tokenAccountSummary) => {
    tokenAccountSummary.lastUpdated = Date.now();
  });
  await localforage.setItem("TOKEN_ACCOUNT_SUMMARIES", tokenAccountSummaries);
  log(`Saved TOKEN_ACCOUNT_SUMMARIES to localForage`);
});

addMessageListener("getContacts", async (message: PortalMessage, sendReply: SendReply) => {
  if (contacts) {
    log(`😃 Service worker cache: we have the contacts`);
    sendReply({
      topic: "replyContacts",
      contacts,
    });
  } else {
    log(`☹️ Service worker does not have Contacts`);
  }
});

addMessageListener("setContacts", async (message: PortalMessage, sendReply: SendReply) => {
  contacts = message.contacts;
});

// https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/service-workers
self.addEventListener("install", function () {
  // From https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting
  // 'forces the waiting service worker to become the active service worker.'
  // @ts-ignore see top of file
  self.skipWaiting();
  log(`INSTALL service worker version: ${VERSION}`);
});

self.addEventListener("activate", () => {
  log(`ACTIVATE service worker version: ${VERSION}`);
});

// Cache GET requests for images
// Based on https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
self.addEventListener("fetch", (event) => {
  return cacheWebRequests(event, VERSION);
});

// https://developer.mozilla.org/en-US/docs/mozilla/add-ons/webextensions/api/webnavigation/oncompleted
chrome.webNavigation.onCompleted.addListener(async (event) => {
  log(`DEBUG: event.url`, event.url);
  if (!event.url.startsWith("http")) {
    return;
  }
  log(`The user has loaded ${event.url}! Time to inject the wallet!`);
  const tabId = event.tabId;

  // Work around a silly error where ntp.msn.com would appear on new tab page then disappear as soon as loaded something
  // throwing an error about missing tab IDs
  if (event.url.includes("ntp.msn.com")) {
    log(`Not injecting wallet into disappearing MSN NTP site`);
    return;
  }

  // DevTools opens https://devtools.azureedge.net/serve_file/@7069649d605643a097c48b2aca67b600bc362a4f/third_party/webhint/worker_frame.html
  // Fix "Extension manifest must request permission to access this host." error.
  if (event.url.includes("https://devtools")) {
    log(`Not injecting wallet into HTTPS site used in devtools`);
    return;
  }

  // https://developer.chrome.com/docs/extensions/reference/scripting/#method-executeScript
  await chrome.scripting.executeScript({
    files: ["./injected.js"],
    target: { tabId },
    world: "MAIN",
  });
});
