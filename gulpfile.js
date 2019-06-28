let gulp = require('gulp');
let concat = require('gulp-concat');
let cleanCss = require('gulp-clean-css');
let cleanDir = require('gulp-clean-dir');
let uglify = require('gulp-uglify');
let babel = require('gulp-babel');
let imagemin = require('gulp-imagemin'); //error
let clean = require('gulp-clean');
let browserSync = require('browser-sync').create();
//gulp.watch()无法监听到新增加的文件
let watch = require('gulp-watch');

gulp.task('css', function(){
	return gulp.src('./src/css/*.css')
			.pipe(concat('all.css'))   // concat用法
			.pipe(cleanCss())
			.pipe(cleanDir('./dest/css/'))
			.pipe(gulp.dest('./dest/css/'))
})

gulp.task('js_main', function(){
    console.log('js_main')
	return gulp.src('./src/js/*.js')
			//.pipe(babel({presets: ['es2015']}))
            //.pipe(concat('main.min.js'))
            .pipe(uglify()) 
            .pipe(cleanDir('./dest/js/'))      //
			.pipe(gulp.dest('./dest/js/'))
})

gulp.task('html', function(){
    console.log('zhixing')

    return gulp.src('./src/*.html')
            .pipe(gulp.dest('./dest/'))
})

gulp.task('js_lib', function(){
    return gulp.src('./src/libs/js/*.js')
            .pipe(uglify())
            .pipe(cleanDir('./dest/libs/js/'))
            .pipe(gulp.dest('./dest/libs/js/'))
})

gulp.task('image', function(){
    return gulp.src('./src/images/*.*')
        .pipe(imagemin({progressive: true}))
        .pipe(gulp.dest('./dest/images'));
})


gulp.task('clean', function(){
    return gulp.src(['./dest/*'])
            .pipe(clean())
})

gulp.task('browser', function(){
     browserSync.init({
        server: './dest'
     })
})

gulp.task('watch', function(){
    return watch('./src/*.html', function(e){
        console.log('change')
        gulp.task('html');
        browserSync.reload();
    })
    // return (function(){
    //     w('./src/**/*.html', 'html');
    //     w('./src/js/*.js' , 'js_main');
    //     w('./src/css/*.css', 'css');
    //     w('./src/libs/*.js', 'js_lib');
    //     w('./src/images/*.*', 'image');
    // })();

    // function w(path, stask){
    //     console.log(stask)
    //     watch(path, function(){
    //         gulp.series(stask);
    //         browserSync.reload();
    //     })
    // }
})

gulp.task('default', gulp.series('clean', gulp.parallel('js_lib', 'js_main', 'image', 'css'), 'html', 'browser'))