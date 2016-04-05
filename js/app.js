// Global Variables
var win,
	fs = require('fs');

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

	// Attach handler for guessing bitrate
	$('#fileURL').on("change input",function(){
		var url = $('#fileURL').val();
		
		// Does url include HD-like words?
		if(stringContainsAny(url, ["hd","high","hq"])){
			// Then set to 128
			$('#bitrate').val("128");
		}

		// Does url include SD-like words?
		if(stringContainsAny(url, ["sd","low"])){
			// Then set to 64
			$('#bitrate').val("64");
		}
		
	});



	// Setup drag and drop handling
	$(window).on('load', function() {
		// Tells the browser that we *can* drop on this target
		$('html').on('dragenter',function(){
			$('#dropzone').show();
		});
		$('#dropzone').on('dragover',function(e){
			e.preventDefault();
			e.stopPropagation();
		});
		$('#dropzone').on('dragenter',function(e){
			e.preventDefault();
			e.stopPropagation();
			$('#dropzone').addClass('dropOver');
			$('#dragon').show().animate({
				bottom: 0
			},200);
		});
		$('#dropzone').on('dragleave',function(e){
			e.preventDefault();
			e.stopPropagation();
			$('#dropzone').removeClass('dropOver');
			$('#dropzone').hide();
			$('#dragon').hide().css('bottom',-36);
		});
		$('#dropzone').on('drop',function(e){
			e.preventDefault();
			e.stopPropagation();
			$('#dropzone').removeClass('dropOver');
			$('#dropzone').hide();
			$('#dragon').hide().css('bottom',-36);
			if(e.originalEvent.dataTransfer){
				var url = processM3UFile(e.originalEvent.dataTransfer.files[0].path);
				if(e.originalEvent.dataTransfer.files[0].path.endsWith(".m3u"))
				$('#fileURL').val(url);
			}
		});
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
	console.log("Success: " + success);
	// If starting the stream was successful
	if(success){

		$('#elapsedTime').text(streamRecorder.getElapsedTime());
		// Update timer once a second
		updater = setInterval(function(){
			$('#elapsedTime').text(streamRecorder.getElapsedTime());
			checkRecordingStatus();
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

	// Stop updating timer
	clearInterval(updater);

	$(".inputs input").prop("disabled",false);
	$('#recButton').removeClass("Rec");
	$('#recButton').addClass("notRec");
}

function checkRecordingStatus(){
	if(!streamRecorder.recording){
		stopRecording();
	}
}

function stringContainsAny(word, wordArray){
	var candidate;
	for(candidate in wordArray){
		if(word.toLowerCase().indexOf(wordArray[candidate].toLowerCase())>=0){
			return true;
		}
	}
	return false;
}

function processM3UFile(path){
	var url = fs.readFileSync(path).toString().split('\n')[0].trim();
	return url;
}

// Run startup configuration
startup();