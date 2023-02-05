// This file is part of Portal Wallet.
//
// Portal Wallet is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, specifically version 2 of the License.
//
// Portal Wallet is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with Portal Wallet. If not, see <https://www.gnu.org/licenses/>.
//
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
