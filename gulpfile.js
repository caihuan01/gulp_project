// https://blog.csdn.net/guang_s/article/details/84672449
// https://www.jianshu.com/p/db49513a40ec
let gulp = require('gulp');
let concat = require('gulp-concat');
let cleanCss = require('gulp-clean-css');
let cleanDir = require('gulp-clean-dir');
let uglify = require('gulp-uglify');
let babel = require('gulp-babel');
let imagemin = require('gulp-imagemin'); //error
let clean = require('gulp-clean');
let browserSync = require('browser-sync').create();
let reload = browserSync.reload;
//gulp.watch()无法监听到新增加的文件
let watch = require('gulp-watch');
let fs = require('fs');



var env ='dev';
function set_env(type){
    env = type || 'dev';
    fs.writeFile('./env.js', 'export default '+env+';', function(err){
        err && console.log(err);
    })
}

function set_dev(done){
    set_env('dev');
    done();
}
function set_release(done){
   set_env('release');
    done();
}

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
            //.pipe(concat('main.min.js'))
            .pipe(uglify()) 
            .pipe(cleanDir('./dest/js/'))      //
			.pipe(gulp.dest('./dest/js/'))
})

gulp.task('html', function(){
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

/*gulp.task('server', function(){
    browserSync.init({
        server: './dest'
     });
})
function server(){
    browserSync.init({
        server: './dest'
    });
}
*/
function server() {
    browserSync.init({
        port:9000,
        server:{
          baseDir: 'dest',
          index:'index.html'
        }
    })
    console.log(set_env)
    watch('./src/js/*.js', gulp.series('js_main', 'reload'))
    watch('./src/*.html', gulp.series('html', 'reload'))   // 把监听写在服务里面，这里是复制html
    function w(data){
        var path = data.path, task = data.task;
        watch(path, gulp.series(task, 'reload'))
    }


    var wtask = [
        {path: './src/js/*.js', task: 'js_main'},
        {path: './src/*.html', task: 'html'},
        {path: './src/lib/*.js', task: 'js_lib'},
        {path: './src/css/*.css', task: 'css'}
    ]
    for(let i=0; i<wtask.length; i++){
        w(wtask[i]);
    }
  
}
function set(){
    console.log(1)
}


gulp.task('reload', function(){
    return browserSync.reload();
})

gulp.task('watch_js', function(){
    return watch('./src/js/*.js', gulp.series('js_main', 'reload'))
})

gulp.task('watch_css', function(){
    return watch('./src/css/*.css', gulp.series('css', 'reload'));
})

gulp.task('watch', gulp.parallel('watch_js', 'watch_css'));
gulp.task('default', gulp.series('clean', gulp.parallel('js_lib', 'js_main', 'image', 'css'), 'html',server))

gulp.task('dev', gulp.series(set_dev, 'clean', gulp.parallel('js_lib', 'js_main', 'image', 'css'), 'html',server));
