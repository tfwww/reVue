var gulp = require('gulp');
var webpack = require('webpack-stream');
var browserSync = require('browser-sync').create();

gulp.task('default', ['browser-sync', 'watch-webpack']);


// 静态服务器
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            watchTask: true,
        },
        port: 3200,        
    });
    
    gulp.watch('./exp/*.html').on('change', browserSync.reload)    
    gulp.watch('./dist/*.js').on('change', browserSync.reload)    
});

// 监听模式打包
gulp.task('watch-webpack', function() {
    var config = require('./webpack.config.js');
    return gulp.src('index.js')
        .pipe(webpack(config))
        .pipe(gulp.dest('dist/'));
});
