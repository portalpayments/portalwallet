import { log } from "./backend/functions.js";

export const cacheWebRequests = (event, portalVersion) => {
  // Let the browser do its default handling for non-GET requests.
  // @ts-ignore see top of file
  if (event.request.method !== "GET") {
    return;
  }

  // @ts-ignore see top of file
  const url = event?.request?.url;

  // Not all events have urls. Some are just
  //  { "isTrusted": true }
  // Yes really, that's all
  if (!url) {
    return;
  }

  // Let the browser do its default handling for non-Arweave requests.
  // @ts-ignore see top of file

  if (!url.startsWith("https://arweave.net")) {
    return;
  }

  // Prevent the default, and handle the request ourselves.
  // @ts-ignore see top of file
  event.respondWith(
    (async () => {
      // @ts-ignore see top of file
      // log("🖼️: Using Service Worker for Arweave request", event.url);
      // @ts-ignore see top of file
      const eventRequest = event.request;
      // Try to get the response from a cache.
      const cache = await caches.open(`portal-v${portalVersion}`);
      // @ts-ignore see top of file
      const cachedResponse = await cache.match(eventRequest);

      if (cachedResponse) {
        // If we found a match in the cache, return it.

        // log(
        //   // "✨: Using Service Worker cached response for Arweave request",
        //   // @ts-ignore see top of file
        //   url
        // );
        return cachedResponse;
      }

      // If we didn't find a match in the cache, use the network.
      // @ts-ignore see top of file
      log("⛔: No Service Worker cached item for Arweave request", url);
      const response = await fetch(eventRequest);
      log(`🔜: Fetched response for ARweave and added it to cache`);
      cache.put(url, response.clone());
      return response;
    })()
  );
};
