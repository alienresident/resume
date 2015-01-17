// Grunt: The JavaScript Task Runner
module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 9001,
          protocol: 'http',
          hostname: 'localhost',
          base: '.',
          keepalive: false,
          livereload: 1337,
          open: true
        }
      }
    },

    watch: {
      sass: {
        files: ['sass/{,**/}*.scss'],
        tasks: ['compass:dev']
      },

      scripts: {
        files: ['js/*.js'],
        tasks: ['concat', 'uglify'],
        options: {
          spawn: false,
        }
      },

      css: {
        files: ['*.css']
      },

      livereload: {
        files: [
          '**/*.css'
        ],

        options: {
          livereload: 1337
        }
      }
    },

    compass: {
      dist: {
        options: {
          environment: 'production',
          outputStyle: 'compressed',
          config: 'config.rb',
          sourcemap: false
        }
      },
      dev: {
        options: {
          environment: 'development',
          outputStyle: 'expanded',
          config: 'config.rb',
          sourcemap: true
        }
      }
    },

    concat: {   
      scripts: {
        src: ['js/src/*.js'], // All JS in the libs folder
        dest: 'js/resume.scripts.js',
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>' + ' This file is compiled */'
      },
      scripts: {
        src: 'js/resume.scripts.js',
        dest: 'js/resume.scripts.min.js'
      }
    }

  });

  grunt.registerTask('default', ['connect', 'watch']);
};