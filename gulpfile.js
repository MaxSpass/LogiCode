// Gulp Moduls-Variables
var gulp 		 = require('gulp')
	browserSync  = require('browser-sync'),
	sass 		 = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	concat 		 = require('gulp-concat'),
	uglify 		 = require('gulp-uglifyjs'),
	cssnano 	 = require('gulp-cssnano'),
	rename 		 = require('gulp-rename'),
	imagemin 	 = require('gulp-imagemin'),
	pngquant 	 = require('imagemin-pngquant'),
	cache 		 = require('gulp-cache'),
	del 		 = require('del'),
	gcmq 		 = require('gulp-group-css-media-queries');


// SASS fuction
gulp.task('sass',function(){
	return gulp.src('app/sass/**/*.+(sass|scss)')
		// .pipe(sass())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer(['last 15 versions','> 1%','ie 8'],{cascade:true}))
		.pipe(gcmq())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream:true}))
});

// MINIFY/CONCAT JS (if need)
gulp.task('minify-js',function(){
	return gulp.src([
		'app/libs/concat_js/*.js'
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js/'));
});

// MINIFY CSS
gulp.task('minify-css', ['sass'], function(){
	return gulp.src('app/css/main.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css'));
});

// Livereload BrowserSync
gulp.task('browserSync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

// DIST CLEANER. (If need) - return del.sync('app/libs.min.js')
gulp.task('clean', function(){
	return del.sync('dist');
});

gulp.task('clear', function(){
	return cache.clearAll();
});

// Main Function WATCH
gulp.task('default',['browserSync','minify-css','minify-js'], function(){
	gulp.watch('app/sass/**/*.+(sass|scss)', ['sass', 'minify-css']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/*.js', browserSync.reload);
});

// IMG Optimized
gulp.task('img',function(){
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		une: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});

// Building
gulp.task('build',['clean', 'img', 'sass'], function(){

	var buildCss = gulp.src([
		'app/css/**/*.css',
		'app/css/main.css',
		'app/css/main.min.css',
	])
	.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));


	var buildJs = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'));


	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));

	var buildJs = gulp.src('app/libs/**/*')
	.pipe(gulp.dest('dist/libs'));

	var buildFavicon = gulp.src('app/favicon.ico')
		.pipe(gulp.dest('dist/'));

	var buildHandler = gulp.src('app/handler.php')
		.pipe(gulp.dest('dist/'));

});