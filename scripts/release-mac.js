// Global Setup
var shell = require("shelljs");
var fs = require("fs");

// Get project information from package.json
var packageJSON = require(__dirname + "/../package.json");

var name = packageJSON.name;
var version = packageJSON.version;

// Grunt build for mac
console.log("\n> Building App\n");
shell.exec('grunt package:mac');

// Get the folder for the new version
var binaryDirectory = __dirname + "/../build/" + name + " - v" + version + "/osx64/";


// Create a DMG called Rec'd-Mac-vX.X.X.dmg
console.log("\n> Creating DMG\n");
shell.mkdir('-p',__dirname + "/../release");


var dmgName = __dirname+'/../release/'+name+'-Mac-v'+version+'.dmg';

// Remove any existing release
try {
	fs.accessSync(dmgName, fs.F_OK);
	// Delete the existing release
	fs.unlinkSync(dmgName);
} catch(e){
	// File does not exist
}


var binaryPath = binaryDirectory + name + ".app";

var appdmg = require('appdmg');
var ee = appdmg({
	target: dmgName,
	basepath: __dirname,
	specification: {
		"title": "Rec'd Installer",
		"icon" : "../icons/recdInstallerIcon.icns",
		"icon-size": 100,
		"background": "../icons/dmgBackground.png",
		"contents": [
			{
				"x": 120,
				"y": 100,
				"type": "file",
				"path": binaryPath
			},
			{
				"x": 470,
				"y": 100,
				"type": "link",
				"path": "/Applications"
			},
		]
	}
});

ee.on('progress', function (info) {
	if(info.type == "step-begin"){
		console.log(info.title);
	}
});

ee.on('finish', function () {
	console.log("DMG created");
	console.log("\n> Build Complete \n");
});

ee.on('error', function (err) {
	console.log("Error in creating dmg file");
	console.log(err);
});
