var exec = require('child_process').exec;
var child = exec('java -jar selenium-server-standalone-2.50.1.jar', function (error, stdout, stderr){
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if(error !== null){
      console.log('exec error: ' + error);
    }
});

module.exports = new Promise((resolve) => {
	setTimeout(() => {
		resolve();
	}, 1000);
});