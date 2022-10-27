// https://developer.chrome.com/docs/extensions/mv3/service_workers/
// and https://github.com/GoogleChrome/chrome-extensions-samples

const log = console.log;

// From https://dev.to/wtho/custom-service-worker-logic-in-typescript-on-vite-4f27

// Show the demo page once the extension is installed
chrome.runtime.onInstalled.addListener((reason) => {
  chrome.tabs.create({
    url: "https://getportal.app",
  });
  log(reason);
  const manifest = chrome.runtime.getManifest();
  log(manifest);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (request.greeting === "hello") {
    sendResponse({ farewell: "goodbye" });
  }
});
