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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-import');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('dev', [ 'import:dist', 'karma:unit','watch:dev']);

};
