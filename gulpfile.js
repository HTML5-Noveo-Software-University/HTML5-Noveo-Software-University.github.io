const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const changed = require('gulp-changed');
const prefix = require('gulp-autoprefixer');
const sass = require('gulp-sass');
const Comb = require('csscomb');
const sourcemaps = require('gulp-sourcemaps');
const csso = require('gulp-csso');
const combineMq = require('gulp-combine-mq');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const paths = {
    pugPages: './dev/pug/pages/*.pug',
    pugPartials: ['./dev/pug/**/*.pug', '!./dev/pug/pages/*.pug'],
    html: './',

    scss: './dev/scss',
    cssComb: './dev/.csscomb.json',
    mainScss: './dev/scss/main.scss',
    scssPartials: './dev/scss/**/*.scss',
    css: './static/css/',

    jsPartials: ['./dev/js/slides.js',
                 './dev/js/themes.js',
                 './dev/js/lectures.js'],
    js: './static/js/'
};

gulp.task('html', () => {
    gulp.src(paths.pugPages)
    .pipe(pug({pretty: false}))
    .pipe(gulp.dest(paths.html));
});
gulp.task('html-watch', () => {
    gulp.src(paths.pugPages)
    .pipe(changed(paths.html, {extension: '.html'}))
    .pipe(pug({pretty: false}))
    .pipe(gulp.dest(paths.html))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('html-partials-watch', () => {
    gulp.src(paths.pugPages)
    .pipe(pug({pretty: false}))
    .pipe(gulp.dest(paths.html))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('csscomb', () => {
    var comb = new Comb(require(paths.cssComb));
    return comb.processDirectory(paths.scss);
});

gulp.task('css-dev', ['csscomb'], () => {
    gulp.src(paths.mainScss)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(prefix(">0.05%", "ie 9"))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.stream());
});

gulp.task('css', () => {
    gulp.src(paths.mainScss)
    .pipe(sass().on('error', sass.logError))
    .pipe(prefix(">0.05%", "ie 9"))
    .pipe(combineMq({
        beautify: false
    }))
    .pipe(csso({
        restructure: false,
        sourceMap: false,
    }))

    .pipe(gulp.dest(paths.css));
});

gulp.task('js', () => {
    gulp.src(paths.jsPartials)
    .pipe(concat('lectures.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(paths.js));
});


gulp.task('bs-reload-js', ['js'], function (done) {
    browserSync.reload();
    done();
});


gulp.task('serve', () => {
    gulp.watch(paths.scssPartials, ['css-dev']);
    gulp.watch(paths.pugPages, ['html-watch']);
    gulp.watch(paths.pugPartials, ['html-partials-watch']);
    gulp.watch(paths.jsPartials, ['bs-reload-js']);

    browserSync.init({
        notify: false,
        server: {
            baseDir: "./"
        }
    });

   //  gulp.watch(`${paths.html}*.html`).on('change', function(file) {
   //      browserSync.reload(file);
   // });
});


gulp.task('default', ['html', 'js', 'css-dev', 'serve']);
gulp.task('deploy', ['html', 'js', 'css']);
