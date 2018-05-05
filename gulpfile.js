var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  postcss = require('gulp-postcss'),
  px2rem = require('postcss-px2rem'),
  autoprefixer = require('autoprefixer'),
  sass = require('gulp-sass');

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'app.js',
    ext: 'js coffee jade',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if (/^Express server listening on port/.test(chunk)) {
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('scss2css', function(){
  var processors = [sass().on('error', sass.logError)];
  return gulp.src('./web/*.scss')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./web'));
})

gulp.task('prod', function () {
  // var processors = [autoprefixer({ browsers: ['last 1 version'] }), px2rem({ remUnit: 34.5 })];
  var processors = [autoprefixer({ browsers: ['last 1 version'] }), px2rem({ remUnit: 37.5, baseDpr: 1 })];
  // var processors = [autoprefixer({ browsers: ['last 1 version'] }), px2rem()];
  return gulp.src('./web/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./web'));
});

gulp.task('default', [
  'develop'
]);

gulp.task('shit', [
  // 'scss2css', 
  'prod'
])
