'use strict';

module.exports = function (grunt) {

  require('time-grunt')(grunt);

  require('load-grunt-tasks')(grunt);

  var config = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({

    config: config,

    watch: {
      bower: {
        files: ['bower.json'],
      },
      js: {
        files: ['<%= config.app %>/css/{,*/}*.js'],
        tasks: ['jshint']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      styles: {
        files: ['<%= config.app %>/css/{,*/}*.css'],
        tasks: ['newer:copy:styles','newer:copy:stylesnomin', 'autoprefixer']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    concat: {
      dist: {
        src: ['<%= config.app %>/template/*.js', '<%= config.app %>/js/*.module.js', '<%= config.app %>/js/*.js'],
        dest: '<%= config.dist %>/mx-pipeline.js'
      }
    },

    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.dist %>/js',
          src: '*.js',
          dest: '<%= config.dist %>/js'
        }]
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/img',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= config.dist %>/img'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/img',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/img'
        }]
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/js/{,*/}*.js',
        '!<%= config.app %>/js/vendor/*'
      ]
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'img/{,*/}*.webp',
            'css/fonts/{,*/}*.*'
          ]
        }]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%= config.app %>/css',
        dest: '.tmp/css/',
        src: '{,*/}*.css'
      },
      stylesnomin: {
        expand: true,
        dot: true,
        cwd: '<%= config.app %>/css',
        dest: '<%= config.dist %>/css/',
        src: '{,*/}*.css'
      }
    },

    cssmin: {
      dist: {
        options: {
        },
        files: {
          '<%= config.dist %>/css/mx-pipeline.min.css': [
           '.tmp/css/mx-pipeline.css'
          ]
        }
      }
    },

    /*csslint: {
      options: {
          csslintrc: '.csslintrc'
      },
      css:{
        src: '<%= config.app %>/css/mx-pipeline.css',
        dest: '<%= config.dist %>/css/mx-pipeline.min.css'
      }
    },*/

    usemin: {
      css: ['<%= config.dist %>/css/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= config.dist %>',
          '<%= config.dist %>/img',
          '<%= config.dist %>/css'
        ]
      }
    },

    uglify: {
      dist: {
        options: {
          mangle: {
            except: ['angular']
          }
        },
        files: {
          '<%= config.dist %>/mx-pipeline.min.js': ['<%= config.dist %>/mx-pipeline.js']
        }
      }
    },

    html2js: {
      options: {
        base: 'app',
        module: 'mxPipeline.templates',
        singleModule: true,
        useStrict: false,
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        }
      },
      main: {
        expand: true,
        src: ['app/template/**/*.html'],
        ext: '.html.js'
      }
    },

    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'copy:stylesnomin',
        'imagemin',
        'svgmin'
      ]
    }
    
  });


  grunt.registerTask('build', [
    'clean:dist',
    'concurrent:dist',
    'html2js:main',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cssmin:dist',
    'usemin',
    'uglify'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'build'
  ]);
};