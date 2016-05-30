/**
 * Created by anuragsharma on 5/29/16.
 */
"use strict";

var gulp = require("gulp"); // Gulp object - for tasks
var connect = require("gulp-connect"); // Name of web server
var open = require("gulp-open"); // Open URL in the web browser
var browserify = require('browserify'); // bundles JS files
var reactify = require('reactify'); // converts JSX to JS
var source = require('vinyl-source-stream') // Use conventional text streams with gulp
var concat = require('gulp-concat');

var config = {
    port: 9005,
    baseUrl: 'http://localhost/',
    paths: {
        html: './src/*.html',
        dist: './dist/',
        js: './src/**/*.js',
        css: [
            './node_modules/bootstrap/dist/css/bootstrap.min.css',
            './node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
        ],
        appJs: './src/app.js'
    }
};

// start a local dev server
gulp.task('connect', function(){
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.baseUrl,
        livereload: true
    });
});

// Open files on the server
gulp.task('open', ['connect'], function () {
    gulp.src('dist/index.html')
        .pipe(open( {uri: config.baseUrl + ':' + config.port + '/'}));
});

// Put all html files into dist to host it and reload server
gulp.task('html', function () {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

// Bundles CSS files
gulp.task('css', function () {
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'));
});

// Bundles our JS files put into dist folder
gulp.task('js', function () {
   browserify(config.paths.appJs)
       .transform(reactify)
       .bundle()
       .on('error', console.error.bind(console))
       .pipe(source('bundle.js'))
       .pipe(gulp.dest(config.paths.dist + '/js'))
       .pipe(connect.reload());
});

// Open files on the server
gulp.task('watch', ['connect'], function () {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js']);
});

//Defualt Task
gulp.task('default', ['html', 'css', 'js', 'open', 'watch']);
