var winston = require('winston');

module.exports = function proxysite(url, clientPromise){
	var promise = clientPromise
		.url('https://www.proxysite.com')
		.then(() => winston.info('proxysite: inside https://www.proxysite.com'))
		.setValue('form input[type="text"]', url)
		.then(() => winston.info(`proxysite: set input value to: ${url}`))
		.click('button[type="submit"]')
		.then(() => winston.info('proxysite: clicked submit'))
	return promise;
};