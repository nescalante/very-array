'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                jshintrc: true
            },
            src: ['<%= pkg.main %>'],
            test: ['test/*.js']
        },
        mochaTest: {
            test: {
                src: ['test/*.js']
            }
        },
        uglify: {
            src: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= pkg.main %>']
                }
            }
        },
        shell: {
            'npm-publish': {
                options: { stdout: true },
                command: 'npm publish'
            },
            'bower-register': {
                options: { stdout: true },
                command: 'bower register <%= pkg.name %> <%= pkg.repository.url %>'
            }
        },
        copy: {
            src: {
                src: 'src/very-array.js',
                dest: 'dist/very-array.js'
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('test', ['mochaTest']);
    grunt.registerTask('default', ['lint', 'test']);
    grunt.registerTask('build', ['lint', 'test', 'copy', 'uglify']);
    grunt.registerTask('deploy', ['build', 'shell:npm-publish', 'shell:bower-register']);
};
