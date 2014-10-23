var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var bowerDir = 'bower_components/';
var sources = [
    'bower_components/firebase/firebase.js',
    'bower_components/qrcodejs/qrcode.min.js',
    //'bower_components/quojs/quo.standalone.js',
    'quo.js',
    'index.js'
];

gulp.task('build', function() {
    gulp.src(sources)
        .pipe(plugins.concat('presenter.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('dist'))
});
