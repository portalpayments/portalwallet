// Do not move this file into a folder!
// Service workers must be in location that 'manages' the result on the content
// See https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/service-workers

// Service worker types support has a number of major bugs
// See https://joshuatz.com/posts/2021/strongly-typed-service-workers/
// Compiling with tsconfig specified in that blog post creates a service worker that won't install.
// Proper TS support is a huge time suck, be warned! Best wait until bugs mentioned above are fixed.

// localForage seems to want window.
self.window = self;

// Yes use .js, TypeScript will apparently figure it out, as .ts breaks.
// https://stackoverflow.com/questions/62619058/appending-js-extension-on-relative-import-statements-during-typescript-compilat
import type { AccountSummary, Contact } from "./backend/types.js";
import { log, isFresh } from "./backend/functions.js";
import { cacheWebRequests } from "./service-worker-webcache";
// See https://github.com/localForage/localForage/issues/831
import localforage from "localforage/src/localforage.js";

// import localforage from "localforage";
// Error: 'default' is not exported by node_modules/localforage/dist/localforage.js,

// import { getItem } from "localforage";
// getItem is not exported by node_modules/localforage/dist/localforage.js

// import * as localforage from "localforage";
// getItem is not exported by node_modules/localforage/dist/localforage.js
const VERSION = 23;
log(`VERSION IS ${VERSION}`);
log(`localforage is`, localforage.getItem);

let secretKey: string | null = null;

let nativeAccountSummary: AccountSummary | null = null;
let tokenAccountSummaries: Array<AccountSummary> | null = null;
let contacts: Array<Contact> | null = null;

const sendMessage = async (message: Record<string, any>) => {
  // @ts-ignore see top of file
  const clients = await self.clients.matchAll();
  if (clients && clients.length) {
    // TODO: we always send to first client. Not sure if this is correct.
    const firstClient = clients[0];
    firstClient.postMessage(message);
  }
};

// https://developer.chrome.com/docs/extensions/mv3/service_workers/
// and https://github.com/GoogleChrome/chrome-extensions-samples
// From https://dev.to/wtho/custom-service-worker-logic-in-typescript-on-vite-4f27

log(`Parsing service worker version: ${VERSION}`);

const handleMessage = async (eventData) => {
  log(`📩 Got a message from the app on this topic: ${eventData.topic}`);

  if (eventData.topic === "getSecretKey") {
    if (secretKey) {
      log(`😃 Service worker cache: we have the secret key`);

      sendMessage({
        topic: "replySecretKey",
        secretKey,
      });
    } else {
      log(`☹️ Service worker does not have the secret key`);
    }
  }

  if (eventData.topic === "setSecretKey") {
    secretKey = eventData.secretKey;
  }

  if (eventData.topic === "getNativeAccountSummary") {
    if (nativeAccountSummary) {
      log(
        `😃 Service worker cache: we have the nativeAccountSummary in memory already`
      );

      sendMessage({
        topic: "replyNativeAccountSummary",
        nativeAccountSummary,
      });
      return;
    }
    const nativeAccountSummaryFromLocalForage = (await localforage.getItem(
      "NATIVE_ACCOUNT_SUMMARY"
    )) as AccountSummary;
    if (nativeAccountSummaryFromLocalForage) {
      if (isFresh(nativeAccountSummaryFromLocalForage.lastUpdated)) {
        log(
          `😀 Service worker cache: we have the nativeAccountSummary in localforage and it's fresh!`
        );
        sendMessage({
          topic: "replyNativeAccountSummary",
          nativeAccountSummary: nativeAccountSummaryFromLocalForage,
        });
        return;
      } else {
        log(
          `☹️ Service worker cache: we have the nativeAccountSummary in localforage but it's not fresh`
        );
        return;
      }
    }
    log(`☹️ Service worker does not have the nativeAccountSummary`);
  }

  if (eventData.topic === "setNativeAccountSummary") {
    nativeAccountSummary = eventData.nativeAccountSummary;
    nativeAccountSummary.lastUpdated = Date.now();
    await localforage.setItem("NATIVE_ACCOUNT_SUMMARY", nativeAccountSummary);
    log(`Saved NATIVE_ACCOUNT_SUMMARY to localForage`);
  }

  if (eventData.topic === "getTokenAccountSummaries") {
    if (tokenAccountSummaries) {
      log(`😃 Service worker cache: we have the tokenAccountSummaries`);

      sendMessage({
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
      tokenAccountSummariesFromLocalForage.every((accountSummary) =>
        isFresh(accountSummary.lastUpdated)
      );

    if (allAreFresh) {
      log(
        `😀 Service worker cache: we have the tokenAccountSummaries in localforage and they're all fresh!`
      );
      sendMessage({
        topic: "replyTokenAccountSummaries",
        tokenAccountSummaries: tokenAccountSummariesFromLocalForage,
      });
      return;
    } else {
      log(
        `☹️ Service worker cache: we have the tokenAccountSummaries in localforage but they're not all fresh`
      );
    }

    log(`☹️ Service worker does not have the tokenAccountSummaries`);
    return;
  }

  if (eventData.topic === "setTokenAccountSummaries") {
    tokenAccountSummaries = eventData.tokenAccountSummaries;
    tokenAccountSummaries.map((tokenAccountSummary) => {
      tokenAccountSummary.lastUpdated = Date.now();
    });
    await localforage.setItem("TOKEN_ACCOUNT_SUMMARIES", tokenAccountSummaries);
    log(`Saved TOKEN_ACCOUNT_SUMMARIES to localForage`);
  }

  if (eventData.topic === "getContacts") {
    if (contacts) {
      log(`😃 Service worker cache: we have the contacts`);
      sendMessage({
        topic: "replyContacts",
        contacts,
      });
    } else {
      log(`☹️ Service worker does not have Contacts`);
    }
  }

  if (eventData.topic === "setContacts") {
    contacts = eventData.contacts;
  }
};

// https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/service-workers
self.addEventListener("install", function (event) {
  // From https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting
  // 'forces the waiting service worker to become the active service worker.'

  // @ts-ignore see top of file
  self.skipWaiting();
  log(`INSTALL service worker version: ${VERSION}`);
  log(`globalThis is`, globalThis);
});

self.addEventListener("activate", (event) => {
  log(`ACTIVATE service worker version: ${VERSION}`);
  log(event);
});

self.addEventListener("message", (event) => {
  handleMessage(event.data);
});

// Cache GET requests for images
// Based on https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent
self.addEventListener("fetch", (event) => {
  return cacheWebRequests(event, VERSION);
});
