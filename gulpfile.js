const gulp = require('gulp');
const minify = require('gulp-minify');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');

gulp.task('default', function () {
  gulp.src('src/*.js')
    .pipe(minify({
      ext: {
        min:'.js'
      },
      noSource: true
    }))
    .pipe(gulp.dest('dist'))
  gulp.src('src/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'));
  gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});