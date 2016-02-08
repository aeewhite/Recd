// Global Setup
var shell = require("shelljs"),
	fs = require("fs"),
	archiver = require('archiver');

// Get project information from package.json
var packageJSON = require(__dirname + "/../package.json");

var name = packageJSON.name;
var version = packageJSON.version;

// Grunt build for Windows
console.log("\n> Building App\n");
shell.exec('grunt package:win');

// Get the folder for the new version
var binaryDirectory = __dirname + "/../build/" + name + " - v" + version + "/win64/";


// Create a DMG called Rec'd-Win-vX.X.X.zip
console.log("\n> Creating ZIP archive\n");
shell.mkdir('-p',__dirname + "/../release");


var zipName = __dirname+'/../release/'+name+'-Windows-v'+version+'.zip';
var folderName = name+'-Win-v'+version;

// Remove any existing release
try {
	fs.accessSync(zipName, fs.F_OK);
	// Delete the existing release
	fs.unlinkSync(zipName);
} catch(e){
	// File does not exist
}

var archive = archiver('zip');
var output = fs.createWriteStream(zipName);

archive.on('error', function(err) {
	console.log("There was an error in creating the zip archive");
	throw err;
});

output.on('close', function() {
	console.log('Zip write complete');
});

archive.pipe(output);
archive.directory(binaryDirectory,folderName);
archive.finalize();

