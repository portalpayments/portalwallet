// https://developer.chrome.com/docs/extensions/mv3/service_workers/
// and https://github.com/GoogleChrome/chrome-extensions-samples

// import { log } from "../src/backend/functions";
const log = console.log.bind(console);

const stringify = (object: any) => {
  JSON.stringify(object, null, 2);
};

// From https://dev.to/wtho/custom-service-worker-logic-in-typescript-on-vite-4f27

log(`Hello from service worker`);

// https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/service-workers
self.addEventListener("install", function (event) {
  // @ts-ignore
  self.skipWaiting();
  log("WORKER: install event in progress.");
  log(`globalThis is`, globalThis);
});

self.addEventListener("activate", (event) => {
  log("WORKER: activate event in progress.");
  log(event);
});

self.addEventListener("message", (event) => {
  log("WORKER ✅✅✅✅✅✅: message event in progress.", stringify(event.data));
  log(event.data);
});
