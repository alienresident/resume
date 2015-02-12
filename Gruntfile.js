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
        files: ['**/**/*.css']
      },

      livereload: {
        files: [
          '**/**/*.css'
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
        src: ['src/js/*.js'], // All JS in the libs folder
        dest: 'tmp/js/resume.scripts.js',
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %>' + ' This file is compiled */'
      },
      scripts: {
        src: 'tmp/js/resume.scripts.js',
        dest: 'dist/js/resume.scripts.min.js'
      }
    },

    bower: {
          install: {
            options: {
              targetDir: 'src/lib',
              cleanBowerDir: true,
            }
          }
        },

    clean: {
      dist: [
        'src/css/', 'tmp', 'dist'
      ]
    },

    copy: {
      dist: {
        src: 'pdf/*',
        dest: 'dist/',
      },
      distie: {
        src: 'src/index.html',
        dest: 'tmp/index-ie.html',
        options: {
          process: function (content, srcpath) {
            return content.replace("build:css css/global.css","build:css css/global-ie.css").replace('href="css/global.css"','href="../src/css/global-ie.css"');
          },
        },
      },
      normalize: {
        src: 'src/index.html',
        dest: 'tmp/index-normalize.html',
        options: {
          process: function (content, srcpath) {
            return content.replace("build:css css/global.css","build:css css/normalize.css").replace('href="css/global.css"','href="../src/lib/normalize.css/normalize.css"');
          },
        },
      },
    },
 
    htmlmin: {  // Task
      dist: {  // Target
        options: {  // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: {  // Dictionary of files
          'dist/index.html': 'tmp/index.html'
        }
      }
    },

    uncss: {
      options: {
          ignore: ['.wf-roboto-i4-active i', '.wf-roboto-i4-active em', '.wf-roboto-n7-active b', '.wf-roboto-n7-active strong', '.wf-roboto-n4-active body', '.wf-robotoslab-n4-active h1', '.wf-robotoslab-n4-active h2', '.wf-robotoslab-n4-active h3', '.wf-robotoslab-n4-active h4']
      },
      dist: {
        options: {
          report: 'min'
        },
        src: ['src/index.html'],
        dest: 'tmp/css/global.css'
      },
      distie: {
        options: {
          report: 'min'
        },
        src: ['tmp/index-ie.html'],
        dest: 'tmp/css/global-ie.css'
      },
      normalize: {
        options: {
          report: 'min'
        },
        src: ['tmp/index-normalize.html'],
        dest: 'tmp/css/normalize.css'
      }
    },

    autoprefixer: {
      dist: {
        options: {
          browsers: ['last 1 version']
        },
        src: 'tmp/css/global.css',
        dest: 'tmp/css/global.auto.css'
      },
      distie: {
        options: {
          browsers: ['ie 8']
        },
        src: 'src/css/global-ie.css',
        dest: 'tmp/css/global-ie.auto.css'
      },
    },

    cssmin : {
      dist: {
        options: {
          keepSpecialComments: 0,
          report: 'min'
        },
        files: { 
          'dist/css/global.css': ['tmp/css/normalize.css', 'tmp/css/global.auto.css']
        },
      },
      distie: {
        options: {
            keepSpecialComments: 0,
            compatibility: 'ie8',
            report: 'min'
        },
        files: { 
          'dist/css/global-ie.css': ['tmp/css/normalize.css', 'tmp/css/global-ie.auto.css']
        },
      }
    },

    processhtml: {
      dist: {
        files: {
          'tmp/index.html': ['src/index.html']
        }
      }
    },
    
    copy: {
      dist: {
        src: 'pdf/*',
        dest: 'dist/',
      },
    }
  });

  grunt.registerTask('default', ['connect', 'watch']);
  grunt.registerTask('build', [ 'clean', 'concat', 'uglify', 'compass:dist', 'uncss', 'cssmin:dist', 'cssmin:distie', 'processhtml', 'htmlmin', 'copy']);
};