// @ts-nocheck

// https://developer.chrome.com/docs/extensions/mv3/service_workers/
// and https://github.com/GoogleChrome/chrome-extensions-samples

const log = console.log.bind(console);

const stringify = (object: any) => {
  return JSON.stringify(object, null, 2);
};
// From https://dev.to/wtho/custom-service-worker-logic-in-typescript-on-vite-4f27

log(`Hello from service worker`);

// https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/service-workers
self.addEventListener("install", function (event) {
  // self.skipWaiting();
  log("WORKER: install event in progress.");
  log(`globalThis is`, globalThis);
});

self.addEventListener("activate", (event) => {
  log("WORKER: activate event in progress.");
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
