
const Gulp = require("gulp")
const Clean = require("gulp-clean")
const GulpTypescript = require("gulp-typescript")
const Merge = require("merge2")
const Typedoc = require("gulp-typedoc")
const Istanbul = require("gulp-istanbul")
const Mocha = require("gulp-mocha")

let TsProject = GulpTypescript.createProject("tsconfig.json")
let TsProjectIndex = GulpTypescript.createProject("tsconfig.json")
let TsProjectTests = GulpTypescript.createProject("tsconfig.json")

Gulp.task("compile-source", () => {
    let res = Gulp.src("src/api/**/*.ts")
        .pipe(TsProject());
    return Merge([
        res.js.pipe(Gulp.dest("src/api")),
        res.dts.pipe(Gulp.dest("types/api"))
    ])
})

Gulp.task("compile",["compile-source"],() => {
    let res = Gulp.src("src/*.ts")
        .pipe(TsProjectIndex());
    return Merge([
        res.js.pipe(Gulp.dest("src")),
        res.dts.pipe(Gulp.dest("types"))
    ])
})

Gulp.task("compile-tests", ["compile"], () => {
    //let res = TsProject.src()
    let res = Gulp.src("src/tests/**/*.ts")
        .pipe(TsProjectTests());
    return res.js.pipe(Gulp.dest("src/tests"))
})

Gulp.task("pre-tests", ["compile-tests"], () => {
  return Gulp.src(['src/api/**/*.js'])
    .pipe(Istanbul())
    .pipe(Istanbul.hookRequire())
})

Gulp.task('test',["tests"]);
Gulp.task('tests', ["pre-tests"], () => {
    return Gulp.src('src/tests/**/*.js')
      // .pipe(Istanbul())
      // .pipe(Istanbul.hookRequire())
      .pipe(Mocha({
        reporter: 'spec',
        timeout: 10000
      }))
      .pipe(Istanbul.writeReports({
        reporters: ['lcov', 'text', 'text-summary']
      }))
})

Gulp.task("doc-clean",() => {
  return Gulp.src('docs', {read: false})
        .pipe(Clean())
})

Gulp.task("doc",["doc-clean"],() => {
  console.log("\nPlease use: rm -rf docs && node_modules/typedoc-md-theme/bin/typedoc --options typedoc.json --source src/\n")
})

Gulp.task("default", ["compile"])
