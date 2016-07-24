'use strict';

var gulp = require('gulp'),
    fs = require('fs'),
    argv = require('yargs').argv,
    watch = require('gulp-watch'),
    gulpif = require('gulp-if'),
    runSequence = require('run-sequence'),
    newer = require('gulp-newer'),
    htmlmin = require('gulp-htmlmin'),
    htmlreplace = require('gulp-html-replace'),
    LessAutoprefix = require('less-plugin-autoprefix'),
    groupMediaQueries = require('less-plugin-group-css-media-queries'),
    LessPluginCleanCSS = require('less-plugin-clean-css'),
    minifyjs = require('gulp-js-minify'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename"),
    smushit = require('gulp-smushit'),
    injectSvg = require('gulp-inject-svg'),
    tasks = fs.readdirSync('./gulp/tasks/'),
    Ruta = {
      src: './src/',
      build: './build/',
      dev: './dev/',
      less: 'less/',
      styles: 'css/',
      js: 'js/',
      img: 'img/'
    },
    NameFile = {
      myJs: 'main.js',
      minifiedCss: 'style.css',
      minifiedJs: 'main.min.js',
      minifiedLibsJs: 'libs.js'
    },
    orderToJsBuid = [
      Ruta.src + Ruta.js + 'three.min.js',
      Ruta.src + Ruta.js + 'sprint.min.js',
      Ruta.src + Ruta.js + 'smooth-scroll.js',
      Ruta.src + Ruta.js + 'main.min.js'
    ],
    orderToJsDev = [
      //Ruta.src + Ruta.js + 'three.min.js',
      Ruta.src + Ruta.js + 'sprint.js',
      Ruta.src + Ruta.js + 'smooth-scroll.js',
    ],
    orderToJs = orderToJsBuid,
    destino = Ruta.dev,
    conditionBuild = false;


var less = require('gulp-less');
var path = require('path');


gulp.task('default', function () {
    //runSequence(['less', 'minify-js'], callback);
    //runSequence(['css', 'concat-scripts'], callback);
});

gulp.task('dev', function(callback){
    destino = Ruta.dev;
    orderToJs = orderToJsDev;
    runSequence(['less', 'html', 'image-min', 'copy-svg'], 'concat-scripts', 'minify-js', callback);
    //runSequence(['less', 'html', 'image-min', 'copy-svg'], 'concat-scripts', 'minify-js', callback);
    //runSequence(['css', 'html', 'copyfonts', 'image-min'], callback);
    //runSequence(['css', 'html', 'concat-scripts', 'minify-js', 'image-min'], callback);
    //runSequence(['less', 'change-calls-to-min', 'minify', 'minify-js', 'concat-scripts', 'image-min'], callback);
});

gulp.task('build', function(callback){
    destino = Ruta.build;
    conditionBuild = true;
    runSequence(['less', 'html', 'image-min', 'copy-svg'], 'concat-scripts', 'minify-js', callback);
});


//START: styles ----
var autoprefix = new LessAutoprefix({ browsers: ['last 4 versions'] }),
    cleanCSSPlugin = new LessPluginCleanCSS({advanced: true});

gulp.task('less', function(){
  return gulp.src(Ruta.src + Ruta.less + 'style.less')
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
        'js':  Ruta.js + NameFile.minifiedLibsJs
    }))
    .pipe(injectSvg())
    .pipe(gulpif(conditionBuild, htmlmin({collapseWhitespace: true, conservativeCollapse: true, removeEmptyAttributes: true})))
    .pipe(gulp.dest(destino));
});


//js
gulp.task('concat-scripts', function() {
  //return gulp.src(Ruta.src + Ruta.js + '*.js')
  return gulp.src(orderToJs)
    .pipe(concat(NameFile.minifiedLibsJs))
    .pipe(gulp.dest(destino + Ruta.js ));
});

gulp.task('minify-js', function(){
  gulp.src([destino + Ruta.js + NameFile.minifiedLibsJs, Ruta.src + Ruta.js + NameFile.myJs])
    //.pipe(gulpif(conditionBuild,minifyjs()))
    .pipe(uglify())
    //.pipe(minifyjs())
    //.pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(destino + Ruta.js));
});

//images

gulp.task('image-min', function () {
    return gulp.src(Ruta.src + Ruta.img + '**/*.{jpg,png}')
      .pipe(newer(destino + Ruta.img))
      .pipe(smushit())
      .pipe(gulp.dest(destino + Ruta.img));
});

// gulp.task('injectSvg', function() {
//   return gulp.src(destino + '*.html')
//     .pipe(injectSvg())
//     .pipe(gulp.dest(Ruta.src));
// });

gulp.task('copy-svg', function() {
    gulp.src(Ruta.src + Ruta.img +'**/*.svg')
    .pipe(newer(destino + Ruta.img))
    .pipe(gulp.dest(destino + Ruta.img));
});

function callback(){
  console.log('callback');
}

//watch ---
gulp.task('watch', function() {
  gulp.watch(Ruta.src + '*.html', ['html']);
  gulp.watch(Ruta.src + Ruta.less + '**/*.less', ['less']);
  gulp.watch(Ruta.src + Ruta.js + '**/*.js', ['concat-scripts', 'minify-js']);
});
