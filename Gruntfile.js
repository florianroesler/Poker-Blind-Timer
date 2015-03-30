'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    connect: {
      main: {
        options: {
          port: 9001
        }
      }
    },
    watch: {
      main: {
        options: {
            livereload: true,
            livereloadOnError: false,
            spawn: false
        },
        files: ['index.css','index.html','PokerTimer.js'],
        tasks: ['jshint']
      }
    },
    jshint: {
      main: {
        options: {
            jshintrc: '.jshintrc'
        },
        src: 'PokerTimer.js'
      }
    },  
  });

  grunt.registerTask('serve', ['jshint','connect', 'watch']);
};