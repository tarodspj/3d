'use strict';

var gulp = require('gulp'),
    fs = require('fs'),
    argv = require('yargs').argv,
    runSequence = require('run-sequence'),
    newer = require('gulp-newer'),
    htmlmin = require('gulp-htmlmin'),
    htmlreplace = require('gulp-html-replace'),
    LessAutoprefix = require('less-plugin-autoprefix'),
    groupMediaQueries = require('less-plugin-group-css-media-queries'),
    LessPluginCleanCSS = require('less-plugin-clean-css'),
    minifyjs = require('gulp-js-minify'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename"),
    smushit = require('gulp-smushit'),
    injectSvg = require('gulp-inject-svg'),
    tasks = fs.readdirSync('./gulp/tasks/'),
    Ruta = {
      src: './src/',
      build: './build/',
      dev: './dev/',
      styles: 'css/',
      js: 'js/',
      img: 'img/'
    },
    NameFile = {
      minifiedCss: 'style.css',
      minifiedJs: 'main.min.js'
    },
    orderToJs = [
      Ruta.src + Ruta.js + 'three.min.js',
      Ruta.src + Ruta.js + 'sprint.min.js',
      Ruta.src + Ruta.js + 'smoothscroll.min.js',
      Ruta.src + Ruta.js + 'index.js'
    ],
    destino = Ruta.src;


var less = require('gulp-less');
var path = require('path');


gulp.task('default', function () {
    //runSequence(['less', 'minify-js'], callback);
    //runSequence(['css', 'concat-scripts'], callback);
});

gulp.task('dev', function(callback){
    destino = Ruta.dev;
    runSequence('injectSvg', ['less', 'html', 'image-min'], 'minify-js', 'concat-scripts', callback);
    //runSequence(['css', 'html', 'copyfonts', 'image-min'], callback);
    //runSequence(['css', 'html', 'concat-scripts', 'minify-js', 'image-min'], callback);
    //runSequence(['less', 'change-calls-to-min', 'minify', 'minify-js', 'concat-scripts', 'image-min'], callback);
});

gulp.task('build', function(callback){
    destino = Ruta.build;
    runSequence(['less', 'html', 'image-min'], 'minify-js', 'concat-scripts', callback);
    //runSequence(['css', 'html', 'copyfonts', 'image-min'], callback);
    //runSequence(['css', 'html', 'concat-scripts', 'minify-js', 'image-min'], callback);
    //runSequence(['less', 'change-calls-to-min', 'minify', 'minify-js', 'concat-scripts', 'image-min'], callback);
});


//START: styles ----
var autoprefix = new LessAutoprefix({ browsers: ['last 4 versions'] }),
    cleanCSSPlugin = new LessPluginCleanCSS({advanced: true});

gulp.task('less', function(){
  return gulp.src(Ruta.src + 'less/style.less')
    .pipe(less({
        plugins: [autoprefix, groupMediaQueries, cleanCSSPlugin]
    }))
    .pipe(gulp.dest(destino + Ruta.styles));
});

//END styles -----


//html

gulp.task('html', function() {
  gulp.src(Ruta.src + '*.html')
    .pipe(htmlreplace({
        'css':  Ruta.styles + NameFile.minifiedCss,
        'js':  Ruta.js + NameFile.minifiedJs
    }))
    .pipe(htmlmin({collapseWhitespace: true, conservativeCollapse: true, removeEmptyAttributes: true}))
    .pipe(gulp.dest(destino));
});


//js
gulp.task('concat-scripts', function() {
  //return gulp.src(Ruta.src + Ruta.js + '*.js')
  return gulp.src(orderToJs)
    .pipe(concat(NameFile.minifiedJs))
    .pipe(gulp.dest(destino + Ruta.js ));
});

gulp.task('minify-js', function(){
  gulp.src([Ruta.src + Ruta.js + '**/*.js', '!' + Ruta.src + Ruta.js + '**/*.min.js'])
    .pipe(minifyjs())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(Ruta.src + Ruta.js));
});

//images

gulp.task('image-min', function () {
    return gulp.src(Ruta.src + Ruta.img + '**/*.{jpg,png}')
      .pipe(newer(destino + Ruta.img))
      .pipe(smushit())
      .pipe(gulp.dest(destino + Ruta.img));
});

gulp.task('injectSvg', function() {

  return gulp.src(Ruta.src + '*.html')
    .pipe(injectSvg())
    .pipe(gulp.dest(destino));

});

function callback(){
  console.log('callback');
}
