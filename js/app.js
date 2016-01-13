// Global Variables
var win;

// Called when app first loads
function startup (){
	//  Load native UI library
	var gui = require('nw.gui');

	// Assign window object
	win = gui.Window.get();

	var os = require('os');
	
	if(os.platform() == "darwin"){
		// Create menu
		var menu = new gui.Menu({ type: 'menubar' });

		// create MacBuiltin menubar items
		menu.createMacBuiltin("Rec'd",{
			hideEdit: false,
			hideWindow: false
		});

		// Append Menu to Window
		win.menu = menu;
	}

	win.on('close', function() {
		shutDown();
	});

	// Set up click handling for record button
	$('#recButton').click(function(){
		if(!streamRecorder.recording){
			startRecording();
		}
		else{
			stopRecording();
		}
	});
}

// To be called when app is closing down
function shutDown(){
	win.hide(); // Pretend to be closed already
	stopRecording(); //Clean up/Stop recording
	win.close(true);
}

// Path is relative to html file
var streamRecorder = require('../js/streamRecorder.js');

var updater;

function startRecording(){
	var streamLocation = $('#fileURL').val();
	var saveLocation = $('#savePath').val();
	var bitrate = $('#bitrate').val();

	// Start the recording
	
	var success = streamRecorder.startStreamToFile(streamLocation, saveLocation, bitrate);

	// If starting the stream was successful
	if(success){

		// Update timer once a second
		updater = setInterval(function(){
			$('#elapsedTime').text(streamRecorder.getElapsedTime());
		},1000);

		$(".inputs input").prop("disabled",true);
		$('#recButton').removeClass("notRec");
		$('#recButton').addClass("Rec");
		return true;
	}
	else{
		return false;
	}
}

function stopRecording(){
	var closed = streamRecorder.stopStreamToFile();

	if(closed){
		// Stop updating timer
		clearInterval(updater);

		$(".inputs input").prop("disabled",false);
		$('#recButton').removeClass("Rec");
		$('#recButton').addClass("notRec");	
		return true;
	}
	else{
		return false;
	}
}

// Run startup configuration
startup();