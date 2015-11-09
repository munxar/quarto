
function config() {
    var front = "frontend/";
    var back = "backend/";
    var src = "src/";
    var dist = "dist/";
    var ts = "**/*.ts";
    var scss = "**/*.scss";

    return {
        task: {
            front: "build:front",
            back: "build:back",
            scss: "build:scss",
            watch: "watch",
            sync: "sync",
            run: "run"
        },
        src: {
            front: front + src + ts,
            scss: front + src + scss,
            back: back + src + ts
        },
        dist: {
            front: front + dist,
            back: back + dist
        },
        tsOptions: {
            module: "commonjs",
            target: "es5",
            "sourceMap": true
        }
    };
}

module.exports = config;