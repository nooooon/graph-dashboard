var htdocsDir = "./htdocs/";

var gulp = require('gulp');
var sass = require('gulp-sass');
var changed = require('gulp-changed');
var pleeease = require('gulp-pleeease');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var plumber = require("gulp-plumber");
var notify = require("gulp-notify");
var globAll = require("glob-all");
var ejs = require("gulp-ejs");
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');
var webpackStream = require("webpack-stream");
var webpack = require("webpack");
var config = require('./webpack.config.js');
var runSequence = require('run-sequence');
var env = process.env.NODE_ENV;

var settingFile = require('./setting.js');
var SETTING = settingFile();
var ejsPram;
var runTimestamp = Math.round(Date.now() / 1000);

// task
SETTING.buildTargets.map((target) => {

  // js
  // console.log('set task >', `${target}js`);
  gulp.task(`${target}js`, function(){
    config.entry['index'] = `./src/${target}js/index.ts`; // entryファイルを書き換える
    if(env === "production" || env === "dev"){
      config.watch = false;
    }
    return gulp.src('')
      .pipe(webpackStream(config, webpack))
      .pipe(gulp.dest(`${htdocsDir}${target}js`));
  });

  // sass
  // console.log('set task >', `${target}sass`);
  gulp.task(`${target}sass`, function(){
    return gulp.src(`./src/${target}sass/**/*.scss`)
      .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
      .pipe(sass({errLogToConsole: true}))
      .pipe(pleeease({
        autoprefixer: {
          browsers: ['last 4 versions']
        }
      }))
      .pipe(gulp.dest(`${htdocsDir}${target}css`));
  });

  // ejs
  gulp.task(`${target}ejs` ,function(){
    // console.log('run task >', `./src/${target}*.ejs`);
    return gulp.src(`./src/${target}*.ejs`)
      .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
      .pipe(ejs({"data": ejsPram}, {}, {"ext": ".html"}))
      .pipe(gulp.dest(`${htdocsDir}${target}`));
  });
});

// common css
gulp.task('common-css', function(){
  return gulp.src('src/assets/sass/common.scss')
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(sass({errLogToConsole: true}))
    .pipe(pleeease({
      autoprefixer: {
        browsers: ['last 4 versions']
      }
    }))
    .pipe(gulp.dest(`${htdocsDir}/assets/css`));
});

// html
gulp.task('html', function(){
  return gulp.src('src/**/*.html', {base: 'src'})
  .pipe(gulp.dest(htdocsDir));
});

// icon font
gulp.task('iconfont', function(){
  return gulp.src(['src/assets/iconfont/*.svg'])
  .pipe(iconfont({
    startUnicode: 0xF001,
    fontName: 'iconfont',
    formats: ['ttf', 'eot', 'woff', 'svg'],
    appendCodepoints: false,
    normalize: true,
    fontHeight: 1000,
    descent: 1000/4,
    timestamp: runTimestamp
  })).on('glyphs', function(glyphs) {
    gulp.src('src/assets/iconfont/template/_icons.scss')
    .pipe(consolidate('lodash', {
      glyphs: glyphs.map(function(glyph) {
        return { fileName: glyph.name, codePoint: glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase() };
      }),
      fontName: 'iconfont',
      fontPath: '../fonts/',
      cssClass: 'iconfont'
    }))
    .pipe(gulp.dest('src/assets/sass/foundation'));
  }).pipe(gulp.dest(`${htdocsDir}assets/fonts`));
});

// copy
gulp.task('copy', function(){
  return gulp.src('src/**/*.{png,jpg,gif,icon,json}', {base: 'src'})
  .pipe(gulp.dest(htdocsDir));
});


// browser sync
gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: htdocsDir
    }
  });
});

// reload all browser
gulp.task('bs-reload', function(){
  browserSync.reload();
});


gulp.task('watch', function(){
  gulp.watch([
    htdocsDir + '**/*.html',
    htdocsDir + '**/*.js',
    htdocsDir + '**/*.css'
  ], ['bs-reload']);

  gulp.watch('./src/**/*.html', ['html']);
  gulp.watch('./src/assets/sass/**/*.scss', ['common-css']);
  
  SETTING.buildTargets.map((target) => {
    // js
    gulp.watch(`./src/${target}js/index.{js,ts}`, [`${target}js`]);

    // sass
    gulp.watch(`./src/${target}sass/**/*.scss`, [`${target}sass`]);

    // ejs
    gulp.watch(`./src/${target}**/*.ejs`, [`${target}ejs`]);
  });
});


gulp.task('default', function(){
  if(env === "production"){
    // production
    htdocsDir = "./dist/";
    ejsPram = SETTING.settingRelease;
    SETTING.buildTargets.map((target) => {
      runSequence('copy', 'iconfont', 'html', `${target}js`, `${target}sass`, `${target}ejs`, 'common-css');
    });
  }else if(env === "dev"){
    // development
    htdocsDir = "./dist/";
    ejsPram = SETTING.settingDev;
    SETTING.buildTargets.map((target) => {
      runSequence('copy', 'iconfont', 'html', `${target}js`, `${target}sass`, `${target}ejs`, 'common-css');
    });
  }else{
    // local
    ejsPram = SETTING.settingLocal;
    runSequence(['browser-sync', 'copy', 'iconfont'], 'common-css', 'watch');
  }
});
