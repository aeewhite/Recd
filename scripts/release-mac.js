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


// Create a DMG called Rec'd-Mac-vX.X.X.dmg
shell.mkdir('-p',__dirname + "/../release");


var dmgName = __dirname+'/../release/'+name+'-Mac-v'+version+'.dmg';
console.log(dmgName);

// Remove any existing release
try {
	fs.accessSync(dmgName, fs.F_OK);
	// Delete the existing release
	fs.unlinkSync(dmgName);
} catch(e){
	// File does not exist
}


var binaryPath = binaryDirectory + name + ".app";
console.log(binaryPath);

var appdmg = require('appdmg');
var ee = appdmg({
	target: dmgName,
	basepath: __dirname,
	specification: {
		"title": "Rec'd Installer",
		"icon" : "../icons/recdIcon.icns",
		"icon-size": 80,
		"background": "../icons/white.jpg",
		"contents": [
			{
				"x": 141,
				"y": 140,
				"type": "file",
				"path": binaryPath
			},
			{
				"x": 283,
				"y": 140,
				"type": "link",
				"path": "/Applications"
			},
		]
	}
});

ee.on('progress', function (info) {
	console.log(info.current);
});

ee.on('finish', function () {
  console.log("Finished");
});

ee.on('error', function (err) {
  console.log(err);
});
