console.log('Here I am, the background script.');

// Due to YouTube's video loading process, the tab being navigated away from
// emits another load completion update event.  We want to avoid duplicating any
// actions from that second event.
// var lastUpdatedTab = null;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	console.log(changeInfo);
	if (isYoutubeURL(tab.url) && (changeInfo.status === 'complete' || changeInfo.title)) {
		// lastUpdatedTab = tab;
		// chrome.tabs.executeScript(tabId, { file: 'main.js' });
		chrome.tabs.sendMessage(tabId, { url: tab.url, status: changeInfo.status || changeInfo.title }, function(response) {
			console.log(response);
		});
	}
});

// chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
// 	if (tabId === lastUpdatedTab.id) lastUpdatedTab = null;
// });

function isYoutubeURL(url) {
	return url.indexOf('https://www.youtube.com/watch') !== -1;
}
