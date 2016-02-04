var fs = require('fs'),
	request = require('request'),
	throttle = require('stream-throttle');

var networkStream, fileStream;

var startTime, elapsedTime, timeUpdater;

var recording = false;

/**
 * Creates a stream and returns success
 * @param  {String} streamLocation the location to stream
 * @param  {String} saveLocation   the location to record the stream to
 * @param  {Integer} bitrate        bitrate of stream in Kb/s
 * @return {Boolean}                Whether the stream was created or not
 */
function startStreamToFile (streamLocation, saveLocation, bitrate) {

	console.log("Starting Stream");
	
	// If either parameter is blank, give up
	if(streamLocation === "" || saveLocation === ""){
		return false;
	}

	// Calculate bitrate
	var recordingBitrate = (bitrate * 1000) / 8;

	// Create network streams
	fileStream = fs.createWriteStream(saveLocation);
	networkStream = request
					.get(streamLocation)
					.pipe(new throttle.Throttle({rate:recordingBitrate}))
					.pipe(fileStream);
	exports.recording = true;
	elapsedTime = 0;
	startTime = getCurrentTimeInSeconds();

	// Update the elapsed time every second
	updateElapsedTime();
	timerUpdate = setInterval(updateElapsedTime, 500);

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
	return true;
}

function stopStreamToFile(){
	// Close the network stream, which will close the filestream
	if(exports.recording){
		networkStream.end();
		console.log('Closing Stream');
	}
	else{
		console.log("Stream not open, not closing");
		return false;
	}
	exports.recording = false;
	clearInterval(timerUpdate);
	return true;
}

function updateElapsedTime() {
	var now = getCurrentTimeInSeconds();
	var timeDifference = now - startTime;
	elapsedTime = timeDifference;
	return elapsedTime;
}

function getCurrentTimeInSeconds() {
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
