// Load native UI library
var gui = require('nw.gui');

// Create menu
var menu = new gui.Menu({ type: 'menubar' });

// create MacBuiltin
menu.createMacBuiltin("Rec'd",{
    hideEdit: false,
    hideWindow: false
});

// Append Menu to Window
gui.Window.get().menu = menu;

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

$('#recButton').addClass("notRec");

$('#recButton').click(function(){
	if($('#recButton').hasClass('notRec')){
		$('#recButton').removeClass("notRec");
		$('#recButton').addClass("Rec");
	}
	else{
		$('#recButton').removeClass("Rec");
		$('#recButton').addClass("notRec");
	}
});	