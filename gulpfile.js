var gulp = require('gulp');
var server = require('gulp-express');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var reactify = require('reactify');
var ejs = require("gulp-ejs");

gulp.task('bundle',function(){
	return browserify({
		entries:'app/main.jsx',
		debug:true,
	})
	.transform(reactify)
	.bundle()
	.pipe(source('app.js'))
	.pipe(gulp.dest('./dist'));
});

gulp.task('temp',function(){
	gulp.src(['app/index.html','app/*.css'])
		.pipe(gulp.dest('./dist'));

	gulp.src(['bower_components/**'])
		.pipe(gulp.dest('./dist/bower_components'));

	gulp.src('app/index.ejs')
		.pipe(ejs({
				msg: "Hello Gulp!"
			}))	
		.pipe(gulp.dest("./dist"));	
});

gulp.task('observe-all',function(){
	gulp.watch('app/**/*.*',['bundle', 'temp']);
});

gulp.task('serve', ['bundle','temp','observe-all'], function() {
	server.run(['server/main.js']);
});