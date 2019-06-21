let gulp = require('gulp');
let concat = require('gulp-concat');
let cleanCss = require('gulp-clean-css');
let cleanDir = require('gulp-clean-dir');
let uglify = require('gulp-uglify');
let babel = require('gulp-babel');
//let imagemin = require('gulp-imagemin'); //error

gulp.task('css', function(){
	return gulp.src('./src/css/*.css')
			.pipe(concat('all.css'))   // concat用法
			.pipe(cleanCss())
			.pipe(cleanDir('./dest/css/'))
			.pipe(gulp.dest('./dest/css/'))
})

gulp.task('js_main', function(){
	return gulp.src('./src/js/*.js')
			//.pipe(babel({presets: ['es2015']}))
            .pipe(concat('main.min.js'))
            .pipe(uglify()) 
            .pipe(cleanDir('./dest/js/'))      //
			.pipe(gulp.dest('./dest/js/'))
})


gulp.task('js_lib', function(){
    return gulp.src('./src/libs/js/*.js')
            .pipe(uglify())
            .pipe(cleanDir('./dest/libs/js/'))
            .pipe(gulp.dest('./dest/libs/js/'))
})

gulp.task('img', function(){
    return gulp.src('./src/images/*.*')
        //.pipe(imagemin({progressive: true}))
        .pipe(gulp.dest('./dist/images'));
})


gulp.task('clean', function(){
    return gulp.src(['./dest/*'])
            .pipe(clean())
})