// Global Setup
var shell = require("shelljs");
var fs = require("fs");

// Get project information from package.json
var packageJSON = require(__dirname + "/../package.json");

var name = packageJSON.name;
var version = packageJSON.version;

// Grunt build for mac
shell.exec('grunt package:mac');

// Get the folder for the new version
var binaryDirectory = __dirname + "/../build/" + name + " - v" + version + "/osx64/";
console.log(binaryDirectory);


// Zip the .app file and name Rec'd-Mac-vX.X.X.zip
shell.mkdir('-p',__dirname + "/../release");

var archiver = require('archiver');
var archive = archiver('zip');

var zipName = __dirname+'/../release/'+name+'-Mac-v'+version+'.zip';
console.log(zipName);

var writeStream = fs.createWriteStream(zipName);

writeStream.on('close', function() {
	console.log(archive.pointer() + ' total bytes');
	console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', function(err) {
	console.log(err);
	throw err;
});

archive.pipe(writeStream);

var binaryPath = binaryDirectory + name + ".app";
console.log(binaryPath);

archive.bulk([
	{ expand: true, cwd: binaryDirectory, src: ['**/*'] }
]);

archive.finalize();
