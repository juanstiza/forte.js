/*jslint node: true */
"use strict";

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        import: {
          options: {},
          dist: {
            src: 'src/forte.js',
            dest: 'dist/forte.js',
          }
        },

        watch: {
            dev: {
                files: [ 'Gruntfile.js', 'src/**/*.js', 'tests/**/*.js'],
                tasks: [ 'import:dist', 'karma:unit'],
                options: {
                    atBegin: true
                }
            }
        },

        karma: {
            options: {
                configFile: 'config/karma.conf.js'
            },
            unit: {
                singleRun: true
            },
            continuous: {
                singleRun: false,
                autoWatch: true
            }
        },

        clean: ['tmp','dist'],

        lodash: {
          build: {
            dest: 'tmp/lodash.js',
            options: {
              modifier: 'modern',
              include: ['each','sortBy','isEqual'],
              category: ['lang']
            }
          }
        },

        uglify: {
          options: {
            mangle: {
              except: ['forte']
            }
          },
          build: {
            files: {
              'dist/forte.min.js':['dist/forte.js']
            }
          }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-import');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-lodash');

    grunt.registerTask('dev', ['clean','lodash:build', 'import:dist', 'karma:unit','watch:dev']);
    grunt.registerTask('build', ['clean','lodash:build', 'import:dist', 'karma:unit','uglify:build']);

};
