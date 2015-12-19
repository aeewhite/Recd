var fs = require('fs');
var request = require('request');

var stream = request('http://stream.bellarmineradio.com:8000/high');
var writeStream = fs.createWriteStream('test.mp3');

stream.on('data', function(data) {
  writeStream.write(data);
});

stream.on('end',function(){
	writeStream.end();
});

stream.on('error', function(err) {
	console.log('something is wrong :( ');
	writeStream.close();
});