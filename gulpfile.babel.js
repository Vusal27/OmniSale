var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concatCss = require('gulp-concat-css');
var plumber = require("gulp-plumber");
var ghPages = require('gulp-gh-pages');

//Пути
const paths = {
    root: "./dist",
    styles: {
      src: "src/styles/main.scss",
      watch: "src/styles/**/*.scss",
      dest: "dist/styles/"
    },
    stylesNlz: {
      src: "src/styles/layout/normalize.css",
      dest: "dist/styles/normalize/"
    },
    scripts: {
      src: "src/scripts/main.js",
      watch: "src/scripts/main.js",
      dest: "dist/scripts/"
    },
    html: {
      src: "src/*.html",
      watch: "src/*.html",
      dest: "dist/"
    },
    images: {
      src: "src/images/**/*.*",
      dest: "dist/images/"
    },
    fonts: {
      src: "src/fonts/*.*",
      dest: "dist/fonts/"
    }
};


//Удаление папки dist
function clean() {
    return del("dist");
}

//Создание ветки gh-pages и загрузка туда содержимого папки dist
function deploy() {
    return gulp.src(paths.root).pipe(ghPages());
}

//Перенос файлов 
function html() {
    return gulp
      .src(paths.html.src)
      .pipe(plumber())
      .pipe(gulp.dest(paths.html.dest));
}

function stylesNlz() {
    return gulp.src(paths.stylesNlz.src).pipe(gulp.dest(paths.stylesNlz.dest));
}
  
function images() {
    return gulp.src(paths.images.src).pipe(gulp.dest(paths.images.dest));
}

function scripts() {
    return gulp.src(paths.scripts.src).pipe(gulp.dest(paths.scripts.dest));
}

function fonts() {
    return gulp.src(paths.fonts.src).pipe(gulp.dest(paths.fonts.dest));
}

function serve() {
    browserSync.init({
    server: paths.root
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}
//Слежение
function watch() {
    gulp.watch(paths.styles.watch, scss);
    gulp.watch(paths.html.watch, html)
    gulp.watch(paths.scripts.watch, scripts);
    gulp.watch(paths.images.src, images)
}
//Компилируем scss в css + автопрефиксер
function scss() {
return gulp
    .src(paths.styles.src)
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(concatCss("main.css"))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

exports.clean = clean;
exports.scripts = scripts;
exports.html = html;
exports.fonts = fonts;
exports.stylesNlz = stylesNlz;
exports.images = images;
exports.scss = scss;
exports.deploy = deploy;

gulp.task('default', gulp.series(
    clean,
    gulp.parallel(scss, fonts, images, stylesNlz, html, scripts),
    gulp.parallel(watch, serve)
));