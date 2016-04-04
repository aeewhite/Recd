# Rec'd

![Rec'd](icons/recd_small.png)

Rec'd is a crossplatform application for recording online mp3 streams to disk

## Techonology
 
 - Node-webkit for interface
 - Node.js for streaming and saving files
 - Grunt for build processes

## Get Rec'd

 - Head to releases page on [Github](https://github.com/aeewhite/Recd/releases) and download the latest version for Mac OS X or Windows
 - For Mac, mount the .dmg and copy Recd.app to your applications folder, or if you use homebrew cask: `brew cask install recd`
 - For Windows, extract the zip and run Recd.exe
	 - The Windows version is not yet tested

## Instructions

 1. Enter url of mp3 stream in the URL box
	 - If you have an m3u file for the stream, drag the file into Rec'd to get the url
 2. Select an .mp3 file to save the stream to (must be .mp3)
 3. Press the record button

Important: If your computer sleeps or loses network connection, Rec'd will stop recording
 

## Building

First run `npm install` to pick up the dependencies. I use [Grunt](http://gruntjs.com/) for building the [NW.js](https://github.com/nwjs/nw.js) apps for Mac and Windows. To build all for both platforms, run the package task with `grunt package` (or `npm run build`). To build only one platform, run `grunt package:mac` or `grunt package:win` (the Windows build requires wine to be installed if not on a Windows machine). There are release scripts for Mac and Windows that will run the build and then zip it all up for github releases. Those can be run with `npm run release-mac` or `npm run release-win`. For running the project temporarily, you can use `npm start` which will start a NW instance (requires node-webkit to be installed).
