// https://developer.chrome.com/docs/extensions/mv3/service_workers/
// and https://github.com/GoogleChrome/chrome-extensions-samples

// From https://dev.to/wtho/custom-service-worker-logic-in-typescript-on-vite-4f27

// Show the demo page once the extension is installed
chrome.runtime.onInstalled.addListener((_reason) => {
  chrome.tabs.create({
    url: "https://getportal.app",
  });
});
