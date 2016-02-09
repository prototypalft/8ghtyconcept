(function () {
	'use strict';

	var ENTER_KEY = 13;
	var MAX_INPUT_LENGTH = 400;

	var chatLines = $('.Chat__lines');
	var chatTextBox = $('.Chat__textbox');

	var escapeHTML = (function () {
		/*!
		 * escape-html
		 * Copyright(c) 2012-2013 TJ Holowaychuk
		 * Copyright(c) 2015 Andreas Lubbe
		 * Copyright(c) 2015 Tiancheng "Timothy" Gu
		 * MIT Licensed
		 */

		'use strict';

		/**
		 * Module variables.
		 * @private
		 */

		var matchHtmlRegExp = /["'&<>]/;

		/**
		 * Escape special characters in the given string of html.
		 *
		 * @param  {string} string The string to escape for inserting into HTML
		 * @return {string}
		 * @public
		 */

		function escapeHtml(string) {
			var str = '' + string;
			var match = matchHtmlRegExp.exec(str);

			if (!match) {
				return str;
			}

			var escape;
			var html = '';
			var index = 0;
			var lastIndex = 0;

			for (index = match.index; index < str.length; index++) {
				switch (str.charCodeAt(index)) {
					case 34: // "
						escape = '&quot;';
						break;
					case 38: // &
						escape = '&amp;';
						break;
					case 39: // '
						escape = '&#39;';
						break;
					case 60: // <
						escape = '&lt;';
						break;
					case 62: // >
						escape = '&gt;';
						break;
					default:
						continue;
				}

				if (lastIndex !== index) {
					html += str.substring(lastIndex, index);
				}

				lastIndex = index + 1;
				html += escape;
			}

			return lastIndex !== index
				? html + str.substring(lastIndex, index)
				: html;
		}

		return escapeHtml;
	}());

	var emotes;
	var emoteNames;
	var emotesURL = 'https://twitchemotes.com/api_cache/v2/global.json';


	fetch(emotesURL, { method: 'get' })
		.then(function (response) {
			return response.text();
		})
		.then(JSON.parse)
		.then(function (json) {
			emoteNames = Object.keys(json.emotes);
			emotes = json.emotes;
		});

	// I spent the last hour trying to remember how you did the regex for emoticons. I don't remember if you had the same regex as this, but I looked it up and it's apparently dead simple: /\bEmoteName\b/

	var chat = {
		addMessage: function (options) {
			var from    = options.from;
			var message = escapeHTML(options.message)
				.substring(0, MAX_INPUT_LENGTH);

			emoteNames.forEach(function (name) {
				var id = emotes[name].image_id;
				var regex = new RegExp(`\\b${name}\\b`, 'g');

				message = message
					.replace(
						regex,
						'<img class="emoticon" src="//static-cdn.jtvnw.net/emoticons/v1/' +  id + '/1.0" />'
					);
			});

			var li = $.create('li', {
				className: 'Chat__line',
				contents: [
					{
						tag: 'a',
						href: '#',
						className: 'Avatar',
						textContent: '?'
					},
					{
						tag: 'span',
						className: 'Chat__from',
						textContent: from
					},
					{
						tag: 'span',
						className: 'Chat__colon',
						textContent: ':'
					},
				]
			});

			var messageElement = document.createElement('span');
			messageElement.className = 'Chat__message';
			messageElement.innerHTML = message;

			li.appendChild(messageElement);

			chatLines.appendChild(li);
			chatLines.scrollTop = chatLines.scrollHeight;
		},
	};

	var delayedMessages = [
		{
			from: 'beachman4',
			message: 'lost half my skins',
		},
		{
			from: 'Eighty',
			message: 'I\'m a scrub',
		},
		{
			from: 'Prototypal',
			message: '@Eighty we already knew that FailFish',
		},
		{
			from: 'beachman4',
			message: 'what have I done NotLikeThis',
		},
		{
			from: 'Eighty',
			message: 'fuck you proto',
		},
		{
			from: 'SimpleVar',
			message: ':3',
		},
		{
			from: 'AutomateAllTheThings',
			message: 'OSsloth the sloths.. have arrived OSsloth',
		},
		{
			from: 'GoldGlove',
			message: 'I\'ve gotta a good feelin about this 1.8%',
		},
		{
			from: 'Prototypal',
			message: '@GoldGlove It\'s never gonna happen',
		},
		{
			from: 'MCSMike',
			message: '@AutomateAllTheThings what\'s up',
		},
		{
			from: 'beachman4',
			message: '...',
		},
		{
			from: 'GoldGlove',
			message: 'HOLY SHIT',
		},
		{
			from: 'Prototypal',
			message: 'wtf',
		},
		{
			from: 'AutomateAllTheThings',
			message: 'I\'m making that game tomorrow',
		},
		{
			from: 'GoldGlove',
			message: 'THE DREAM',
		},
		{
			from: 'Prototypal',
			message: 'rigged Kappa',
		},
		{
			from: 'Goatador',
			message: 'lol',
		},
		{
			from: 'MikeDoesCode',
			message: 'Kappa',
		},
	];

	delayedMessages.reduce(function (timeout, message) {
		setTimeout(function () {
			chat.addMessage({
				message: message.message,
				from: message.from
			});

			if (Number.isFinite(message.timeout)) {
				timeout += message.timeout;
			}
		}, timeout);

		return timeout + getRandomInteger(2000, 3000);
	}, 1000);

	chatTextBox.addEventListener('keypress', function (e) {
		if (e.which === ENTER_KEY && ! e.ctrlKey && ! e.shiftKey) {
			chat.addMessage({
				message: chatTextBox.value,
				from: 'Prototypal'
			});

			chatTextBox.value = '';
			// Prevent newline insertion
			e.preventDefault();
		}
	});

	/**
	 * Return a random integer between to other integers
	 * @param  {Number} min
	 * @param  {Number} max
	 * @return {Number}
	 */
	function getRandomInteger(min, max) {
		var number = Math.random();
		return Math.floor(number * (max - min + 1) + min);
	}
}());
