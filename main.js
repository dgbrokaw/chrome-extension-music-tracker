console.log('Here I am, the content script!', Date.now());
// Perform on content script load in case the video page was loaded directly.
setTimeout(getVideoInformation, 1000);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log('message received in content script:', request);
	setTimeout(getVideoInformation, 1000);
	sendResponse({ message_received: true });
});

function getVideoInformation() {
	if (!document.querySelector('#eow-title')) console.warn('Video information not present.');

	console.log('video title', document.querySelector('#eow-title').innerText);

	var meta_items = document.querySelector('.watch-extras-section')
		.querySelectorAll('.watch-meta-item');
	for (var i=0; i<meta_items.length; i++) {
		var meta_item = meta_items[i]
		  , title = meta_item.querySelector('h4.title').innerText.trim()
		  , value = meta_item.querySelector('.watch-info-tag-list').innerText.trim();

		if (value === 'Music') console.log('This page is in the \'Music\' category.');
		if (value === 'People & Blogs') console.log('This page is in the \'People & Blogs\' category, which may be associated with music channels.');
		if (title === 'Music') console.log('This page contains a music description.');

		// console.log('meta item:', title, '--', value);
	}

	var keywords = document.querySelector('meta[name=keywords]').getAttribute('content');
	console.log('keywords:', keywords.length > 0 ? keywords : 'none');
}
