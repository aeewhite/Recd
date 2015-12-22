module.exports = function(grunt) {
	// Configuration, Tasks and Plugins.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'), //Import project data from package.json
		nwjs: {
			options: {
				platforms: ['osx64'],
				buildDir: './build', // Where the build version of my NW.js app is saved
				buildType: "versioned",
				version: 'v0.12.3'
			},
			src: ['**/*',"!build/**/*","!node_modules/grunt/**/*","!node_modules/grunt-nw-builder/**/*","!cache/**/*"] // Your NW.js app
		},
	});

	grunt.loadNpmTasks('grunt-nw-builder');
	// Register the default tasks.
	grunt.registerTask('default', ['nwjs']);
};