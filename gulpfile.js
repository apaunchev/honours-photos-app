var gulp       = require('gulp'),
    sass       = require('gulp-sass'),
    minifyCSS  = require('gulp-minify-css'),
    rename     = require('gulp-rename'),
    concat     = require('gulp-concat'),
    uglify     = require('gulp-uglify'),
    nodemon    = require('gulp-nodemon');

gulp.task('css', function() {
    return gulp.src('public/assets/css/style.scss')
        .pipe(sass())
        .pipe(rename('style.css'))
        .pipe(gulp.dest('public/assets/css'))
        .pipe(minifyCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/assets/css'));
});

gulp.task('js', function() {
    return gulp.src(['server.js', 'public/app/*.js', 'public/app/**/*.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/assets/js'))
        .pipe(rename('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/assets/js'));
});

gulp.task('watch', function() {
    gulp.watch('public/assets/css/style.scss', ['css']);
    gulp.watch(['server.js', 'public/app/*.js', 'public/app/**/*.js'], ['js']);
});

gulp.task('nodemon', function() {
    nodemon({
        script: 'server.js',
        ext: 'js scss html'
    })
        .on('start', ['watch'])
        .on('change', ['watch'])
        .on('restart', function() {
            console.log('Restarted!');
        });
});

gulp.task('default', ['nodemon']);
