// From https://dev.to/wtho/custom-service-worker-logic-in-typescript-on-vite-4f27

/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
const serviceWorker = self as unknown as ServiceWorkerGlobalScope &
  typeof globalThis;

serviceWorker.addEventListener("install", (event) => {
  // import { log } from "./backend/functions";
  console.log("Hello world");
});

export {};
