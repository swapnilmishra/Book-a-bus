module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    nodemon: {
      dev: {
        options: {
          file: 'app.js',
          // nodeArgs: ['--debug'],
          ignoredFiles: ['node_modules/**'],
          watchedExtensions: ['js'],
          watchedFolders: ['routes','models','common'],
          delayTime: 1,
          legacyWatch: true,
          env: {
            PORT: '3001'
          },
          cwd: __dirname
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-nodemon');
  grunt.registerTask('start',['nodemon']);


};
