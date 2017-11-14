
var gulp          = require('gulp');//入口
var livereload    = require("gulp-livereload");//网页实时同步
var sass          = require('gulp-sass');//sass=>css
var uglify        = require('gulp-uglify');//压缩js
var pump          = require('pump');
// var babel       = require('gulp-babel');
// var es2015      = require('babel-preset-es2015');
var jshint        = require('gulp-jshint');//检查js
var cleanCSS      = require('gulp-clean-css');
var rev           = require('gulp-rev');
var replace       = require('gulp-replace');//文件名替换
var gulpSequence  = require('gulp-sequence');//管理task执行顺序
var clean         = require('gulp-clean');//清除文件
var concat        = require('gulp-concat');//文件合并(js/css)
var gulpSequence  = require('gulp-sequence');
var imagemin      = require('gulp-imagemin');//图片压缩
var pngquant      = require('imagemin-pngquant');//图片深度压缩
var cache         = require('gulp-cache');//静态缓存
var htmlmin       = require('gulp-htmlmin');//压缩html
var rename        = require('gulp-rename');//重命名





// //use es6
// gulp.task('es6toes5', function(){
//   gulp.src('src/es6/*.js')
//       .pipe(babel({
//           presets: ['env']
//       }))
//       .pipe(gulp.dest('lib/es5'))
// });

//js　语法检查
// gulp.task('lint', function() {
//   gulp.src('src/js/*.js','lib/es5/*.js')
//     .pipe(jshint())
//     .pipe(jshint.reporter('YOUR_REPORTER_HERE'));
// });

//对文件名加MD5后缀
// gulp.task('default', () =>
//    gulp.src('src/*.css')
//        .pipe(rev())
//        .pipe(gulp.dest('dist'))
// );

//文件名替换
// gulp.task('replacejs', function(){
//   gulp.src('dist/js/*.js')
//     .pipe(replace('*.js', '*.min.js'))
// });

//文件合并(用于不冲突的模块化文件)
// gulp.task('scripts', function() {
//   return gulp.src('./lib/*.js')
//     .pipe(concat('all.js'))
//     .pipe(gulp.dest('./dist/'));
// });


//livereload 同步
gulp.task("livehtml", function() {
  livereload.listen();
  gulp.watch("src/view/*.html", ["liveload"]);
});

gulp.task("liveload", function() {
  gulp.src("src/view/*.html")
      .pipe(livereload());
});


//sass编译
gulp.task('sass', function () {
  gulp.src('src/style/sass/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('src/style/'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('src/style/sass/*.scss', ['sass']);
});


//js压缩
gulp.task('minify-js', function () {
  pump([
        gulp.src('src/js/*.js'),
        uglify(),
        gulp.dest('lib/js')
    ]
  );
});

gulp.task('minify-js:watch', function () {
  gulp.watch('src/js/*.js', ['minify-js']);
});


//css 压缩
gulp.task('minify-css',function(){
  gulp.src('src/style/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('lib/css'));
});

gulp.task('minify-css:watch', function () {
  gulp.watch('src/style/*.css', ['minify-css']);
});


//文件重命名
//js重命名
gulp.task('renamejs', function () {
  gulp.src('lib/js/*.js') 
       .pipe(rename({suffix: '.min'}))
       .pipe(gulp.dest('dist/js'));
});

gulp.task('renamejs:watch', function () {
  gulp.watch('lib/js/*.js', ['renamejs']);
});

//css重命名
gulp.task('renamecss', function () {
  gulp.src('lib/css/*.css') 
       .pipe(rename({suffix: '.min'}))
       .pipe(gulp.dest('dist/css'));
});

gulp.task('renamecss:watch', function () {
  gulp.watch('lib/css/*.css', ['renamecss']);
});


//清除文件
gulp.task('cleanfile', function () {
  return gulp.src('dist/*.js', {read: false})
      .pipe(clean());
});


//压缩图片
gulp.task('minify-img', function () {
  gulp.src('src/images/*.{png,jpg,gif,ico}')
      .pipe(cache(imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()]
      })))
      .pipe(gulp.dest('lib/img'));
});


//压缩html
gulp.task('minify-html', function() {
  gulp.src('src/view/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('lib/view'));
});

gulp.task('minify-html:watch', function () {
  gulp.watch('src/view/*.html', ['minify-html']);
});


//////////////////////////////////

gulp.task('sequence-1', gulpSequence(['livehtml', 'sass:watch']));

gulp.task('sequence-2',gulpSequence(['minify-css:watch','minify-html:watch','minify-img','minify-js:watch']));

gulp.task('sequence-3', gulpSequence('renamejs:watch', 'renamecss:watch'));

gulp.task('gulp-sequence', gulpSequence(['sequence-1', 'sequence-2','sequence-3']));

//////////////////////////////////