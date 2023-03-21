// Still needs a async wrapper to use await, otherwise
// "await is only valid in async functions and the top level bodies of modules"

const main = async () => {
  const log = console.log;
  log(`Content script started, injecting script into current tab world`);

  // https://developer.chrome.com/docs/extensions/reference/tabs/#get-the-current-tab
  const getCurrentTabId = async () => {
    // https://developer.chrome.com/docs/extensions/reference/tabs/#perms
    if (!chrome.tabs) {
      throw new Error(
        "chrome.tabs is not available. Check permissions in manifest.json"
      );
    }
    // https://developer.chrome.com/docs/extensions/reference/tabs/#get-the-current-tab
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    return tab?.id || null;
  };

  const currentTabId = await getCurrentTabId();

  // https://developer.chrome.com/docs/extensions/reference/scripting/#method-executeScript
  chrome.scripting.executeScript({
    files: ["./injected.js"],
    target: { tabId: currentTabId },
    world: "MAIN",
  });

  log(`Content script finished`);
};

main();

// Avoid a warning
export {};
