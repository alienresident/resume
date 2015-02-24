// Grunt: The JavaScript Task Runner
module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 8888,
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
        tasks: ['sass:dev', 'concat:dev']
      },

      scripts: {
        files: ['src/js/*.js'],
        tasks: ['concat:js', 'uglify'],
        options: {
          spawn: false,
        }
      },

      css: {
        files: ['**/**/*.css']
      },

      svg: {
        files: ['src/svgs/*.svg'],
        tasks: ['grunticon:dev', 'concat:dev']

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
    // Grunt-sass 
    sass: {
      dev: {
        // Takes every file that ends with .scss from the scss 
        // directory and compile them into the css directory. 
        // Also changes the extension from .scss into .css. 
        // Note: file name that begins with _ are ignored automatically
        files: [{
          expand: true,
          cwd: 'sass',
          src: ['*.scss'],
          dest: 'src/css',
          ext: '.css'
        }],
        options: {
          sourceMap: true, 
          outputStyle: 'nested', 
          imagePath: "images",
        }
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'sass',
          src: ['*.scss'],
          dest: 'src/css',
          ext: '.css'
        }],
        options: {
          sourceMap: false, 
          outputStyle: 'compressed', 
          imagePath: "images",
        }
      }
    },

    concat: {
      js: {
        files: {
          'tmp/js/resume.scripts.js': ['src/js/*.js'],
        },
      },
      dist: {
        files: {
          'tmp/js/resume.scripts.js': ['src/js/*.js'],
          'src/css/all.css': ['src/lib/normalize.css/normalize.css', 'src/css/global.css', 'src/css/icons.data.svg.css'],
          'src/css/all-ie.css': ['src/lib/normalize.css/normalize.css', 'src/css/global-ie.css', 'src/css/icons.data.svg.css'],
        },
      },
      dev: {
        files: {
          'src/css/all.css': ['src/lib/normalize.css/normalize.css', 'src/css/global.css', 'src/css/icons.data.svg.css'],
          'src/css/all-ie.css': ['src/lib/normalize.css/normalize.css', 'src/css/global-ie.css', 'src/css/icons.data.svg.css'],
        }
      },
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

    svgmin: {
      options: {
        plugins: [
          { removeViewBox: false },
          { removeUselessStrokeAndFill: false }
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/svgs',
          src: ['*.svg'],
          dest: 'tmp/svgs'
        }]
      }
    },

    grunticon: {
      dev: {
        files: [{
          expand: true,
          cwd: 'src/svgs',
          src: ['*.svg', '*.png'],
          dest: "src/css"
        }],
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'tmp/svgs',
          src: ['*.svg', '*.png'],
          dest: "src/css"
        }],
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
        src: 'src/pdf/*',
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
          'dist/css/global.css': ['tmp/css/normalize.css', 'tmp/css/global.auto.css', 'tmp/css/icons.data.svg.css']
        },
      },
      distie: {
        options: {
            keepSpecialComments: 0,
            compatibility: 'ie8',
            report: 'min'
        },
        files: { 
          'dist/css/global-ie.css': ['tmp/css/normalize.css', 'tmp/css/global-ie.auto.css', 'tmp/css/icons.data.png.css']
        },
      }
    },

    processhtml: {
      dist: {
        files: {
          'tmp/index.html': ['src/index.html']
        }
      }
    }

  });

  grunt.registerTask('default', ['connect', 'watch']);
  grunt.registerTask('build', [ 'clean:dist', 'concat', 'uglify', 'svgmin:dist', 'grunticon:dist', 'sass:dist', 'copy:distie', 'copy:normalize', 'uncss:dist', 'uncss:distie', 'uncss:normalize', 'autoprefixer:dist', 'autoprefixer:distie', 'cssmin:dist', 'cssmin:distie', 'processhtml', 'htmlmin', 'copy:dist']);
};