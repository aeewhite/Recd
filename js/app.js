var fs = require('fs');
var request = require('request');

var stream;
var writeStream;

var streamLocation;
var saveLocation;

$('#start').click(function(){
	var streamLocation = $('#fileURL').val();
	var saveLocation = $('#savePath').val();

	stream = request(streamLocation);
	writeStream = fs.createWriteStream(saveLocation);
	

	stream.on('data', function(data) {
	  writeStream.write(data);
	});

	stream.on('end',function(){
		writeStream.end();
	});

	stream.on('error', function(err) {
		console.log('something is wrong :( ');
		console.log(err);
		writeStream.close();
	});
});

$('#stop').click(function(){
	stream.end();
});