// Service worker types support has a number of major bugs
// See https://joshuatz.com/posts/2021/strongly-typed-service-workers/
// Compiling with tsconfig specified in that blog post creates a service worker that won't install.
// Proper TS support is a huge time suck, be warned! Best wait until bugs mentioned above are fixed.

// @ts-ignore see top of file
const VERSION = 21;

const log = console.log.bind(console);

const stringify = function (object) {
  return JSON.stringify(object, null, 2);
};

let secretKey: string | null = null;

// TODO: load everything in parallel using asyncMap()

// TODO: this is not the correct type (AccountSummary, Array<AccountSummary>) but loading types is currently causing
// service workers that won't install
let nativeAccountSummary: Record<string, any> | null = null;
let tokenAccountSummaries: Array<any> | null = null;

// TODO: copied from contacts
interface Contact {
  walletAddress: string;
  isNew: boolean;
  isPending: boolean;
  verifiedClaims: {
    type: "INDIVIDUAL" | "ORGANIZATION";
    givenName: string;
    familyName: string;
    imageUrl: string;
  };
}

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
  log(`📩 Got a message from the app on this topic ${eventData.topic}`);

  if (eventData.topic === "getSecretKey") {
    if (secretKey) {
      log(`Service worker: good news, we have the secret key`);

      sendMessage({
        topic: "replySecretKey",
        secretKey,
      });
    } else {
      log(`Service worker does not have the secret key`);
    }
  }

  if (eventData.topic === "setSecretKey") {
    secretKey = eventData.secretKey;
  }

  if (eventData.topic === "getNativeAccountSummary") {
    if (nativeAccountSummary) {
      log(`Service worker: good news, we have the nativeAccountSummary`);

      sendMessage({
        topic: "replyNativeAccountSummary",
        nativeAccountSummary,
      });
    } else {
      log(`Service worker does not have the nativeAccountSummary`);
    }
  }

  if (eventData.topic === "setNativeAccountSummary") {
    nativeAccountSummary = eventData.nativeAccountSummary;
  }

  if (eventData.topic === "getTokenAccountSummaries") {
    if (tokenAccountSummaries) {
      log(`Service worker: good news, we have the tokenAccountSummaries`);

      sendMessage({
        topic: "replyTokenAccountSummaries",
        tokenAccountSummaries,
      });
    } else {
      log(`Service worker does not have the tokenAccountSummaries`);
    }
  }

  if (eventData.topic === "setTokenAccountSummaries") {
    tokenAccountSummaries = eventData.tokenAccountSummaries;
  }

  if (eventData.topic === "getContacts") {
    if (contacts) {
      log(`Service worker: good news, we have the contacts`);
      sendMessage({
        topic: "replyContacts",
        contacts,
      });
    } else {
      log(`Service worker does not have Contacts`);
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
  log("✅: recieved message on topic", stringify(event.data.topic));
  handleMessage(event.data);
});
