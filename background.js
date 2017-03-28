console.log('Here I am, the background script.');

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	console.log(changeInfo);
	if (isYoutubeURL(tab.url) && (changeInfo.status === 'complete' || changeInfo.title)) {
		chrome.tabs.sendMessage(tabId, { url: tab.url, status: changeInfo.status || changeInfo.title }, function(response) {
			console.log(response);
		});
	}
});

function isYoutubeURL(url) {
	return url.indexOf('https://www.youtube.com/watch') !== -1;
}
