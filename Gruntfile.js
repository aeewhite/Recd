module.exports = function(grunt) {
	// Configuration, Tasks and Plugins.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'), //Import project data from package.json
		nwjs: {
			options: {
				platforms: ['osx64'],
				buildDir: './build', // Where the build version of my NW.js app is saved
				buildType: "timestamped",
			},
			src: ['./**/*',"!build"] // Your NW.js app
			},
	});

	grunt.loadNpmTasks('grunt-nw-builder');
	// Register the default tasks.
	grunt.registerTask('default', ['nwjs']);
};