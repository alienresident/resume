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
      pdfs: {
        expand: true,
        cwd: 'src/pdf/',
        src: '*.pdf',
        dest: 'dist/pdf/',
        flatten: true,
      },
      dist: {
        src: 'src/index.html',
        dest: 'tmp/index.html',
        options: {
          process: function (content, srcpath) {
            return content.replace('href="css/all.css"','href="../src/css/all.css"').replace('href="css/all-ie.css"','href=""');
          },
        },
      },
      distie: {
        src: 'src/index.html',
        dest: 'tmp/index-ie.html',
        options: {
          process: function (content, srcpath) {
            return content.replace('href="css/all.css"','href="../src/css/all-ie.css"').replace('href="css/all-ie.css"','href=""');
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
          'dist/index.html': 'tmp/index-process.html'
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
        files: {
          'tmp/css/all.uncss.css': ['tmp/index.html']
        }
      },
      distie: {
        options: {
          report: 'min'
        },
        src: ['tmp/index-ie.html'],
        dest: 'tmp/css/all-ie.uncss.css'
      }
    },

    autoprefixer: {
      dist: {
        options: {
          browsers: ['last 1 version']
        },
        src: 'tmp/css/all.uncss.css',
        dest: 'tmp/css/all.auto.css'
      },
      distie: {
        options: {
          browsers: ['ie 8']
        },
        src: 'tmp/css/all-ie.uncss.css',
        dest: 'tmp/css/all-ie.auto.css'
      },
    },

    cssmin: {
      dist: {

        files: { 
          'dist/css/all.css': [ 'tmp/css/all.auto.css']
        },
        options: {
          keepSpecialComments: 0,
          report: 'min'
        },
      },
      distie: {
        options: {
            keepSpecialComments: 0,
            compatibility: 'ie8',
            report: 'min'
        },
        files: { 
          'dist/css/all-ie.css': ['tmp/css/all-ie.auto.css']
        },
      }
    },

    processhtml: {
      dist: {
        files: {
          'tmp/index-process.html': ['src/index.html']
        }
      }
    }

  });

  grunt.registerTask('default', [
    'connect', 
    'watch'
  ]);

  grunt.registerTask('build', [ 
    'clean:dist', // Clean out temp directories
    'sass:dist',  // Run sass complie
    'svgmin:dist', // Min SVG icons
    'grunticon:dist', // Make grunticons
    'concat:dist', // Concat CSS and JS
    'uglify', // Uglify JS
    'copy:dist', // Copy index and replace stylesheet for UnCSS
    'copy:distie', // Copy index and replace with IE stylesheet for UnCSS
    'uncss:dist', // UnCSS all stylesheet
    'uncss:distie', // UnCSS IE stylesheet
    'autoprefixer:dist', // autoprefix all stylesheet
    'autoprefixer:distie', // autoprefix IE stylesheet
    'cssmin:dist', // minify all stylesheet to dist directory
    'cssmin:distie', // minify IE stylesheet to dist directory
    'processhtml:dist', // process build JS tag
    'htmlmin:dist', // minify processed HTML to dist directory
    'copy:pdfs' // Copy PDFs  to dist directory
  ]);
};