console.log('Here I am, the content script!', Date.now());
// Perform on content script load in case the video page was loaded directly.
setTimeout(getVideoInformation, 1000);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log('message received in content script:', request);
	setTimeout(getVideoInformation, 1000);
	sendResponse({ message_received: true });
});

function getVideoInformation() {
	var is_music = false;
	if (!document.querySelector('#eow-title')) console.warn('Video information not present.');
	// var meta_data = {};

	var title = document.querySelector('#eow-title').innerText;
	console.log('video title', title);
	// meta_data.title = title;

	var meta_items = document.querySelector('.watch-extras-section')
		.querySelectorAll('.watch-meta-item');
	for (var i=0; i<meta_items.length; i++) {
		var meta_item = meta_items[i]
		  , title = meta_item.querySelector('h4.title').innerText.trim()
		  , value = meta_item.querySelector('.watch-info-tag-list').innerText.trim();

		if (value === 'Music') {
			console.log('This page is in the \'Music\' category.');
			// meta_data.category = value;
			is_music = true;
		}
		if (value === 'People & Blogs') {
			console.log('This page is in the \'People & Blogs\' category, which may be associated with music channels.');
			// meta_data.category = value;
			is_music = true;
		}
		if (title === 'Music') {
			console.log('This page contains a music description.');
			// meta_data.music = value;
			is_music = true;
		}

		// console.log('meta item:', title, '--', value);
	}

	var keywords = document.querySelector('meta[name=keywords]').getAttribute('content');
	console.log('keywords:', keywords.length > 0 ? keywords : 'none');

	if (is_music) {
		chrome.runtime.sendMessage({title: title}, function(response) {
			console.log(response);
		});
	}
}
