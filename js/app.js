function startup (){
	//  Load native UI library
	var gui = require('nw.gui');

	// Create window object
	var win = gui.Window.get();

	// Create menu
	var menu = new gui.Menu({ type: 'menubar' });

	// create MacBuiltin menubar items
	menu.createMacBuiltin("Rec'd",{
		hideEdit: false,
		hideWindow: false
	});

	// Append Menu to Window
	win.menu = menu;

	win.on('close', function() {
		this.hide(); // Pretend to be closed already
		stopRecording(); //Clean up/Stop recording
		this.close(true);
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

// Path is relative to html file
var streamRecorder = require('../js/streamRecorder.js');

var updater;

function startRecording(){
	var streamLocation = $('#fileURL').val();
	var saveLocation = $('#savePath').val();

	// Start the recording
	var success = streamRecorder.startStreamToFile(streamLocation, saveLocation);

	// If starting the stream was successful
	if(success){
		// Update timer once a second
		updater = setInterval(function(){
			$('#elapsedTime').text(streamRecorder.getElapsedTime());
		},1000);

		$('#recButton').removeClass("notRec");
		$('#recButton').addClass("Rec");
	}
}

function stopRecording(){
	streamRecorder.stopStreamToFile();

	// Stop updating timer
	clearInterval(updater);

	$('#recButton').removeClass("Rec");
	$('#recButton').addClass("notRec");
}

// Run startup configuration
startup();