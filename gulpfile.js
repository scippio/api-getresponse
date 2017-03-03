
const Gulp = require("gulp")
const GulpTypescript = require("gulp-typescript")
const Merge = require("merge2")

let TsProject = GulpTypescript.createProject("tsconfig.json")

Gulp.task("compile", () => {
    let res = Gulp.src("src/**/*.ts")
        .pipe(TsProject());
    return Merge([
        res.js.pipe(Gulp.dest("src")),
        res.dts.pipe(Gulp.dest("types"))
    ])
})

Gulp.task("default", ["compile"])
