module.exports = function(grunt) {
	// Configuration, Tasks and Plugins.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'), //Import project data from package.json
			package: {
				mac:{
					options: {
						platforms: ['osx64'],
						buildDir: './build', // Where the build version of my NW.js app is saved
						buildType: "versioned",
						version: 'v0.12.3',
						macIcns: './icons/recd.icns'
					},
					src: ['**/*',"!build/**/*","!node_modules/grunt/**/*","!node_modules/grunt-nw-builder/**/*","!node_modules/shelljs/**/*","!node_modules/archiver/**/*","!cache/**/*","!scripts/**/*","!release/**/*"] // Your NW.js app
				},
				win:{
					options: {
						platforms: ['win64'],
						buildDir: './build', // Where the build version of my NW.js app is saved
						buildType: "versioned",
						version: 'v0.12.3'
					},
					src: ['**/*',"!build/**/*","!node_modules/grunt/**/*","!node_modules/grunt-nw-builder/**/*","!node_modules/shelljs/**/*","!node_modules/archiver/**/*","!cache/**/*","!scripts/**/*","!release/**/*"] // Your NW.js app
				}
			}
	});

	grunt.loadNpmTasks('grunt-nw-builder');
	// Register the default tasks.
	grunt.task.renameTask('nwjs','package');
	grunt.registerTask('default',['package']);
};