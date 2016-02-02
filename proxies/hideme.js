var winston = require('winston');

module.exports = function hideme(url, clientPromise){
	var promise = clientPromise
		.url('https://hide.me/en/proxy')
		.setValue('form input[type="text"]', url)
		.click('button[type="submit"]', () => {
			winston.info('hideme proxy: clicked submit')
		})
		.waitForVisible('#menu_strip', 60000);
	return promise;
};