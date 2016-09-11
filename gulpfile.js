var gulp = require('gulp'),
	uglify = require('gulp-uglify'),//js压缩混淆
	imagemin = require('gulp-imagemin'),//图片压缩
    minifyCss = require('gulp-minify-css'),
    htmlmin = require('gulp-htmlmin');//css压缩


var sourcePath = './**/*';
var targetPath = '../dist';
gulp.task('jsmin',function(){
	return gulp.src(sourcePath+'.js')
	.pipe(uglify({
		mangle:false,
		compress:false
	}))
	.pipe(gulp.dest(targetPath));
});
gulp.task('cssmin',function(){
	return gulp.src(sourcePath+'.css')
	.pipe(minifyCss({
		compatibility:'ie7'
	}))
	.pipe(gulp.dest(targetPath));
});
gulp.task('imgmin',function(){
	return gulp.src(sourcePath+'.{jpg,png,gif}')
	.pipe(imagemin({
       	optimizationLevel:7
    }))
    .pipe(gulp.dest(targetPath));
});
gulp.task('htmlmin',function(){
	var options = {
		removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeEmptyAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: false,
        minifyJS: true,
        minifyCSS: true,
        html5:false,
        keepClosingSlash:true
	}
	return gulp.src(sourcePath+'.html')
	.pipe(htmlmin(options))
	.pipe(gulp.dest(targetPath));
});
var lst = ['jsmin','cssmin','imgmin'/*,'htmlmin'*/];
gulp.task('default',lst);
