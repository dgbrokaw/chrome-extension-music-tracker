console.log('Here I am, the background script.');

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	console.log(changeInfo);
	// There are many "update" events on a single navigation to a youtube watch page.
	// Many of those events contain the "complete" property, but this does not mean
	// the page contains all the information relevant to our purposes.  Once the title
	// has been loaded, we can try to find other properties of the video.
	if (changeInfo.title) {
		console.log('sending message', Date.now());
		chrome.tabs.sendMessage(tabId, { url: tab.url, title: changeInfo.title }, function(response) {
			console.log(response);
		});
	}
});
