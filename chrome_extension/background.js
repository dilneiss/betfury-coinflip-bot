// Respond to the click on extension Icon
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.executeScript({
    file: 'work.js'
  });
});