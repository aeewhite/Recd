var fs = require('fs'),
	request = require('request');

var networkStream, fileStream;

var startTime, elapsedTime, timeUpdater;

var recording = false;

function startStreamToFile (streamLocation, saveLocation) {

	console.log("Starting Stream");
	
	//If either parameter is blank, give up
	if(streamLocation === "" || saveLocation === ""){
		return false;
	}

	// Create network streams
	networkStream = request(streamLocation);
	fileStream = fs.createWriteStream(saveLocation);
	exports.recording = true;
	startTime = getCurrentTimeInSeconds();

	// Update the elapsed time every second
	timerUpdate = setInterval(updateElapsedTime, 1000);

	// Write date to file
	networkStream.on('data', function(data) {
		// Only save data if still supposed to be recording
		if(exports.recording){
			fileStream.write(data);
		}
	});

	// Close up the file stream when stream is finished
	networkStream.on('end',function(){
		fileStream.end();
	});

	// Handle network streaming errors
	networkStream.on('error', function(err) {
		console.log('something is wrong :( ');
		console.log(err);
		fileStream.close();
	});
}

function stopStreamToFile(){
	console.log('Closing Stream');

	// Close the network stream, which will close the filestream
	if(exports.recording){
		networkStream.end();
	}
	exports.recording = false;
	clearInterval(timerUpdate);
}

function updateElapsedTime () {
	var now = getCurrentTimeInSeconds();
	var timeDifference = now - startTime;
	elapsedTime = timeDifference;
	return elapsedTime;
}

function getCurrentTimeInSeconds () {
	return new Date().getTime() / 1000;
}

function getElapsedTime(){
	return formatTime(elapsedTime);
}

function formatTime(d) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s  < 10 ? "0" + s : s);
}

// Module Exports for Node
exports.recording			= recording;
exports.getElapsedTime		= getElapsedTime;
exports.startStreamToFile	= startStreamToFile;
exports.stopStreamToFile	= stopStreamToFile;
