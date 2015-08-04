'use strict';
var LIVERELOAD_PORT = 35729;
var SERVER_PORT = 9001;
var lrSnippet = require('connect-livereload')({
    port: LIVERELOAD_PORT
});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

var webpack = require("webpack");
var webpackConfig = require('./webpack.config.js');

var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

module.exports = function (grunt) {
    // show elapsed time at the end
    require('time-grunt')(grunt);
    // load all grunt tasks
    require('load-grunt-tasks')(grunt);
    //load grunt-connect-proxy
    grunt.loadNpmTasks('grunt-connect-proxy');

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist'
    };

    grunt.initConfig({
        yeoman: yeomanConfig,
        karma: {
            unit: {
                configFIle: 'karma.conf.js',
                singleRun: true
            },
            continuous: {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS'],
                coverageReporter: {
                    // specify a common output directory
                    dir: 'coverage',
                    reporters: [
                        // reporters not supporting the `file` property
                        { type: 'html', subdir: 'report-html' },
                        // reporters supporting the `file` property, use `subdir` to directly
                        // output them in the `dir` directory
                        { type: 'cobertura', subdir: '.', file: 'cobertura.txt' },
                        { type: 'text', subdir: '.', file: 'text.txt' },
                        { type: 'text-summary', subdir: '.', file: 'text-summary.txt' }
                    ]
                }
            },
            browser: {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS', 'Chrome', 'Firefox']
            }
        },
        jsdoc: {
            dist: {
                src: ['app/scripts', 'test'],
                options: {
                    destination: 'doc',
                    recurse: true
                }
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: 'JST',
                    amd: true
                },
                files: {
                    '.tmp/scripts/templates.js': ['app/scripts/**/*.hbs']
                }
            }
        },
        connect: {
            options: {
                port: grunt.option('port') || SERVER_PORT
            },
            proxies: [{
                context: ['/api'],
                host: 'localhost',
                port: 8081
            }, {
                context: ['/socket.io'],
                host: 'localhost',
                port: 8081,
                ws: true
            }],

            server: {
              options: {
                // keepalive: true,
                middleware: function (connect) {
                  return [
                    mountFolder(connect, '.tmp')
                  ];
                }
              }
            }
        },
        open: {
            options: {
              delay: 1000
            },
            server: {
                path: 'http://localhost:<%= connect.options.port %>/webpack-dev-server/'
            }
        },
        clean: {
            dist: ['.tmp', '<%= yeoman.dist %>/*'],
            server: '.tmp'
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/*',
                '!<%= yeoman.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        jscs: {
            src: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/*',
                'test/spec/{,*/}*.js'
            ],
            options: {
                config: '.jscsrc',
                verbose: true,
                reporter: require('jscs-stylish').path
            }
        },
        jsbeautifier: {
            modify: {
                src: ['Gruntfile.js', '<%= yeoman.app %>/scripts/{,*/}*.js'],
                options: {
                    config: '.jsbeautifyrc'
                }
            },
            verify: {
                src: ['Gruntfile.js', '<%= yeoman.app %>/scripts/{,*/}*.js'],
                options: {
                    mode: 'VERIFY_ONLY',
                    config: '.jsbeautifyrc'
                }
            }
        },
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>'
            }
        },
        usemin: {
            // html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%= yeoman.app %>/bower_components/foundation/css/foundation.css',
                        '<%= yeoman.app %>/styles/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeCommentsFromCDATA: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,txt}',
                        '.htaccess',
                        'jsondata/*.*',
                        'images/*.*',
                        'bower_components/font-awesome/fonts/{,*/}*.*',
                        'bower_components/modernizr/modernizr.js',
                        'bower_components/requirejs/*.js',
                        'index.html'
                    ]
                }]
            }
        },
        webpack: {
          options: webpackConfig,
          build: {
            keepAlive: false,
            plugins: webpackConfig.plugins.concat(
              new webpack.optimize.DedupePlugin(),
              new webpack.optimize.UglifyJsPlugin()
            )
          }
        },
        'webpack-dev-server': {
          options: {
            webpack: webpackConfig,
            port: SERVER_PORT,
            publicPath: '/scripts/',
            contentBase: './app/'
          },
          start: {
            keepAlive: true,
            watch: true,
            plugins: webpackConfig.plugins.concat(
              new webpack.HotModuleReplacementPlugin()
            ),
            webpack: {
              debug: true,
              devtool: 'source-map'
            }
          }
        }
    });

    grunt.registerTask('createDefaultTemplate', function () {
        grunt.file.write('.tmp/scripts/templates.js', 'this.JST = this.JST || {};');
    });

    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve' + (target ? ':' + target : '')]);
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'open', 'configureProxies:dist', 'connect:dist:keepalive']);
        }

        if (target === 'test') {
            return grunt.task.run([
                'templates',
                // 'connect:test',
                'open:test',
                'watch'
            ]);
        }

        grunt.task.run([
          'clean:server',
          'createDefaultTemplate',
          'handlebars',
          'open:server',
          'webpack-dev-server'
        ]);
    });

    grunt.registerTask('test', ['test:karma']);

    grunt.registerTask('test:browser', [
        'templates',
        'karma:browser'
    ]);

    grunt.registerTask('templates', [
        'clean:dist',
        'createDefaultTemplate',
        'handlebars'
    ]);

    grunt.registerTask('test:karma', [
        'templates',
        'karma:continuous'
    ]);

    grunt.registerTask('build', [
        'templates',
        'webpack:build',
        'imagemin',
        'cssmin',
        'copy',
        'usemin'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'jscs',
        'test',
        'build'
    ]);

    grunt.registerTask('beautify', [
        'jsbeautifier:modify',
        'jshint',
        'jscs'
    ]);

    grunt.registerTask('verify', [
        'jsbeautifier:verify',
        'jshint',
        'jscs'
    ]);

    grunt.registerTask('serve:alias', [
        'serve'
    ]);

    grunt.registerTask('analyze', [
        'jshint',
        'jscs'
    ]);

};