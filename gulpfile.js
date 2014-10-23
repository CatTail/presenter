var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var bowerDir = 'bower_components/';
var sources = [
    'bower_components/firebase/firebase.js',
    'bower_components/qrcodejs/qrcode.min.js',
    'bower_components/hammerjs/hammer.min.js',
    'index.js'
];

gulp.task('dev', function() {
    gulp.watch(sources, function() {
        gulp.src(sources)
            .pipe(plugins.concat('presenter.min.js'))
            .pipe(gulp.dest('dist'));
    });
});

gulp.task('build', function() {
    gulp.src(sources)
        .pipe(plugins.concat('presenter.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('dist'));
});
