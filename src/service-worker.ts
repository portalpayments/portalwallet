// @ts-nocheck
// Nocheck because TS doesn't know about service worker types

// For some reason have to shut up TS yet again (see above)
// @ts-ignore
const VERSION = 666;

const log = console.log.bind(console);

const stringify = function (object) {
  return JSON.stringify(object, null, 2);
};

// https://developer.chrome.com/docs/extensions/mv3/service_workers/
// and https://github.com/GoogleChrome/chrome-extensions-samples

// From https://dev.to/wtho/custom-service-worker-logic-in-typescript-on-vite-4f27

log(`Parsing service worker version: ${VERSION}`);

// https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/service-workers
self.addEventListener("install", function (event) {
  // From https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/skipWaiting
  // 'forces the waiting service worker to become the active service worker.'
  self.skipWaiting();
  log(`INSTALL service worker version: ${VERSION}`);
  log(`globalThis is`, globalThis);
});

self.addEventListener("activate", (event) => {
  log(`ACTIVATE service worker version: ${VERSION}`);
  log(event);
});

self.addEventListener("message", (event) => {
  log("✅: recieved message", stringify(event.data));
  log(event.data);

  self.clients.matchAll(/* search options */).then((clients) => {
    if (clients && clients.length) {
      // you need to decide which clients you want to send the message to..
      const firstClient = clients[0];
      firstClient.postMessage("your message");
    }
  });
});
