// Load native UI library
var gui = require('nw.gui');

// Create menu
var menu = new gui.Menu({ type: 'menubar' });

// create MacBuiltin menubar items
menu.createMacBuiltin("Rec'd",{
    hideEdit: false,
    hideWindow: false
});

// Append Menu to Window
gui.Window.get().menu = menu;

var fs = require('fs');
var request = require('request');

var recording = false;
var startTime;
var timerUpdate;
var stream;
var writeStream;

var streamLocation;
var saveLocation;

function startRecording(){
	var streamLocation = $('#fileURL').val();
	var saveLocation = $('#savePath').val();

	if(streamLocation === "" || saveLocation === ""){
		return false;
	}

	stream = request(streamLocation);
	writeStream = fs.createWriteStream(saveLocation);
	
	startTime = new Date().getTime() / 1000;
	updateElapsedTime();
	timerUpdate = setInterval(updateElapsedTime, 1000);
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
	recording = true;
	$('#recButton').removeClass("notRec");
	$('#recButton').addClass("Rec");
}

function stopRecording(){
	if(recording){
		stream.end();
		recording = false;
		$('#recButton').removeClass("Rec");
		$('#recButton').addClass("notRec");
	}
	clearInterval(timerUpdate);
}

function formatTime(d) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s  < 10 ? "0" + s : s);
}

function updateElapsedTime(){
	var now = new Date().getTime() / 1000;
	var timeDiff = now - startTime;
	$('#elapsedTime').text(formatTime(timeDiff));
}

$('#recButton').addClass("notRec");

$('#recButton').click(function(){
	if(!recording){
		startRecording();
	}
	else{
		stopRecording();
	}
});

gui.Window.get().on('close', function() {
  this.hide(); // Pretend to be closed already
  stopRecording(); //Clean up/Stop recording
  this.close(true);
});
