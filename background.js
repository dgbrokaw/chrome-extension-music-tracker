console.log('Here I am, the background script.');

var db = openDatabase('musictracker', '1.0', 'Music Tracker', 5*1024*1024);
db.transaction(function(tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS songs (id unique, url, title)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS listens (date, id)');
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	console.log(changeInfo);
	// There are many "update" events on a single navigation to a youtube watch page.
	// Many of those events contain the "complete" property, but this does not mean
	// the page contains all the information relevant to our purposes.  Once the title
	// has been loaded, we can try to find other properties of the video.
	if (changeInfo.title) {
		chrome.tabs.sendMessage(tabId, { url: tab.url, title: changeInfo.title }, function(response) {
			console.log(response);
		});
	}
});

chrome.browserAction.onClicked.addListener(function(tab) {
  var history_page_url = chrome.extension.getURL("music-history.html");
  focusOrCreateTab(history_page_url);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('data received from content script', request, 'sender', sender);
  var datum = {meta_data: request};
  datum.date = new Date();
  datum.url = sender.url;
  sendResponse({ message_received: true });
});

function focusOrCreateTab(url) {
  chrome.windows.getAll({"populate":true}, function(windows) {
    var existing_tab = null;
    for (var i in windows) {
      var tabs = windows[i].tabs;
      for (var j in tabs) {
        var tab = tabs[j];
        if (tab.url == url) {
          existing_tab = tab;
          break;
        }
      }
    }
    if (existing_tab) {
      chrome.tabs.update(existing_tab.id, {"selected":true});
    } else {
      chrome.tabs.create({"url":url, "selected":true});
    }
  });
}
