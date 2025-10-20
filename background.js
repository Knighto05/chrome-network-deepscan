chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // When a page starts loading (navigation begins)
  if (changeInfo.status === "loading") {
    // Send message to all DevTools panels for this tab
    chrome.runtime.sendMessage({
      type: "CLEAR_REQUESTS",
      tabId: tabId
    }, (response) => {
      // Ignore errors if no listener is ready
      if (chrome.runtime.lastError) {
        console.log("DevTools panel not active for this tab");
      }
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "TAB_ID_REQUEST") {
    sendResponse({ tabId: sender.tab.id });
  }
});

console.log("Network DeepScan background service worker loaded");