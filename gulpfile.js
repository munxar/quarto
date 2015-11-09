var gulp = require("gulp");
var ts = require("gulp-typescript");
var sass = require("gulp-sass");
var browserSync = require('browser-sync').create();
var config = require("./config")();
var fork = require("child_process").fork;
var backendSync = process("backend/dist");

gulp.task("default", [config.task.sync]);

gulp.task(config.task.front, function () {
    return gulp.src(config.src.front)
        .pipe(ts(config.tsOptions))
        .pipe(gulp.dest(config.dist.front))
});

gulp.task(config.task.scss, function () {
    return gulp.src(config.src.scss)
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest(config.dist.front))
});

gulp.task(config.task.back, function () {
    return gulp.src(config.src.back)
        .pipe(ts(config.tsOptions))
        .pipe(gulp.dest(config.dist.back));
});

gulp.task(config.task.run, [config.task.back], function (done) {
    backendSync.start(done);
});

gulp.task(config.task.sync, [config.task.run, config.task.watch], function () {
    browserSync.init({
        proxy: "localhost:3000"
    });
});

gulp.task(config.task.watch, [config.task.back, config.task.front, config.task.scss], function () {
    gulp.watch(config.src.front, [config.task.front, function() {
        browserSync.reload();
    }]);
    gulp.watch(config.src.scss, [config.task.scss, function() {
        browserSync.reload();
    }]);
    gulp.watch(config.src.back, [config.task.back, function() {
        backendSync.reload(browserSync.reload)
    }]);
});

// helper to start, restart backend
function process(name) {
    var child;

    function start(done) {
        child = fork(name);
        child.on("message", function () {
            if (done) done();
        });
    }

    function reload(done) {
        child.kill();
        child.on("exit", function () {
            start(done);
        });
    }

    return {
        start: start,
        reload: reload
    };
}
