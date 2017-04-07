console.log('Here I am, the content script!', Date.now());
// Perform on content script load in case the video page was loaded directly.
setTimeout(getVideoInformation, 1000);

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	console.log('message received in content script:', message);
	setTimeout(getVideoInformation, 1000);
	sendResponse({ message_received: true });
});

function getVideoInformation() {
	if (!isMusicVideo()) return;
	if (!document.querySelector('#eow-title')) {
		console.warn('Video information not present.');
		return;
	}

	var video_id = document.querySelector('meta[itemprop=videoId]').getAttribute('content')
	  , title = document.querySelector('#eow-title').innerText;

	chrome.runtime.sendMessage({datum: [video_id, title]}, function(response) {
		console.log(response);
	});
}

function isMusicVideo() {
	var meta_items = document.querySelector('.watch-extras-section')
		.querySelectorAll('.watch-meta-item');
	for (var i=0; i<meta_items.length; i++) {
		var meta_item = meta_items[i]
		  , title = meta_item.querySelector('h4.title').innerText.trim()
		  , value = meta_item.querySelector('.watch-info-tag-list').innerText.trim();
		// console.log('meta item:', title, '--', value);

		if (value === 'Music') {
			// console.log('This page is in the \'Music\' category.');
			return true;
		}
		if (value === 'People & Blogs') {
			// console.log('This page is in the \'People & Blogs\' category, which may be associated with music channels.');
			return true;
		}
		if (title === 'Music') {
			// console.log('This page contains a music description.');
			return true;
		}

	}
}

// Could be used in "getVideoInformation" function...
// var keywords = document.querySelector('meta[name=keywords]').getAttribute('content');
// console.log('keywords:', keywords.length > 0 ? keywords : 'none');
