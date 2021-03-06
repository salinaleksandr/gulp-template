'use strict';

var gulp = require('gulp'),
		watch = require('gulp-watch'),
		prefixer = require('gulp-autoprefixer'),
		uglify = require('gulp-uglify'),
		sass = require('gulp-sass'),
		plumber = require('gulp-plumber'),
		rigger = require('gulp-rigger'),
		uncss = require('gulp-uncss'),
		cssmin = require('gulp-minify-css'),
		imagemin = require('gulp-imagemin'),
		pngquant = require('imagemin-pngquant'),
		rimraf = require('rimraf'),
		browserSync = require("browser-sync"),
		reload = browserSync.reload;

var path = {
		build: {
				html: 'build/',
				js: 'build/js/',
				css: 'build/css/',
				img: 'build/img/',
				fonts: 'build/fonts/'
		},
		src: {
				html: 'src/*.html',
				js: 'src/js/libs.js',
				js_common: 'src/js/common.js',
				style: 'src/style/main.sass',
				img: 'src/img/**/*.*',
				fonts: 'src/fonts/**/*.*'
		},
		watch: {
				html: 'src/**/*.html',
				js: 'src/js/**/*.js',
				style: 'src/style/**/*.sass',
				img: 'src/img/**/*.*',
				fonts: 'src/fonts/**/*.*'
		},
		clean: './build'
};

var config = {
		server: {
				baseDir: "./build"
		},
		tunnel: true,
		host: 'localhost',
		port: 9000,
		logPrefix: "Frontend_template"
};

gulp.task('webserver', function () {
		browserSync(config);
});

gulp.task('clean', function (cb) {
		rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
		gulp.src(path.src.html) 
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
		gulp.src(path.src.js) 
		.pipe(rigger()) 
		.pipe(uglify()) 
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
		gulp.src(path.src.js_common) 
		.pipe(rigger()) 
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
		gulp.src(path.src.style) 
				.pipe(plumber())
				.pipe(sass({
						includePaths: require('node-bourbon').includePaths,
						outputStyle: 'compressed',
						errLogToConsole: true
				}))
				// .pipe(uncss({
				// 		html: ['build/*.html']
				// }))
				.pipe(prefixer())
				.pipe(cssmin())
				.pipe(gulp.dest(path.build.css))
				.pipe(reload({stream: true}));
});


gulp.task('image:build', function () {
		gulp.src(path.src.img) 
		.pipe(imagemin({
				progressive: true,
				svgoPlugins: [{removeViewBox: false}],
				use: [pngquant()],
				interlaced: true
		}))
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
		gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
});

gulp.task('build', [
		'html:build',
		'js:build',
		'style:build',
		'fonts:build',
		'image:build'
		]);


gulp.task('watch', function(){
		watch([path.watch.html], function(event, cb) {
				gulp.start('html:build');
		});
		watch([path.watch.style], function(event, cb) {
				gulp.start('style:build');
		});
		watch([path.watch.js], function(event, cb) {
				gulp.start('js:build');
		});
		watch([path.watch.img], function(event, cb) {
				gulp.start('image:build');
		});
		watch([path.watch.fonts], function(event, cb) {
				gulp.start('fonts:build');
		});
});


gulp.task('default', ['build', 'webserver', 'watch']);