chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes("leetcode.com/")) {
    chrome.tabs.sendMessage(tab.id, { action: "toggleHelper" });
  }
});