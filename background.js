console.log('Here I am, the background script.');

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

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log('data received from content script', message, 'sender', sender);
  message.datum.push(sender.url);
  addListen(message.datum);
  sendResponse({ message_received: true });
});

var db = openDatabase('musictracker', '1.0', 'Music Tracker', 5*1024*1024);
db.transaction(function(tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS songs (id unique, title, url)');
  tx.executeSql('CREATE TABLE IF NOT EXISTS listens (date, id)');
});

function addListen(datum) {
  db.transaction(function(tx) {
    // The id is unique so this won't duplicate songs.
    tx.executeSql('INSERT INTO songs (id, title, url) VALUES (?, ?, ?)', datum);
  });
  db.transaction(function(tx) {
    tx.executeSql('INSERT INTO listens (date, id) VALUES (?, ?)', [(new Date()).toDateString(), datum[0]]);
  });
}

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
