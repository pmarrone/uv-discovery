var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  sass = require('gulp-ruby-sass');
var wiredep = require('wiredep').stream;

gulp.task('sass', function () {
  return sass('./public/css/**/*.scss')
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('watch', function() {
  gulp.watch('./public/css/*.scss', ['sass']);
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    //js: 'node-inspector & node --debug'
    nodeArgs: ['--debug-brk'],
    // execMap: {
    //   js: 'node-inspect & node --debug'
    // },
    script: 'app.js',
    ext: 'js coffee jade',
    stdout: false,
    debug: true,
    verbose: true
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('wiredep', function () {
  var layout = 'app/views/layout.jade';
  gulp.src(layout, {})
  .pipe(wiredep({
    ignorePath: '../../public'
  }))
  .pipe(gulp.dest("app/views"));
})

gulp.task('default', [
  'sass',
  'develop',
  'watch'
]);
