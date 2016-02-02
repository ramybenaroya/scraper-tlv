var webdriverio = require('webdriverio');

module.exports = webdriverio.remote({
	desiredCapabilities: {
		browserName: 'firefox'
	}
});