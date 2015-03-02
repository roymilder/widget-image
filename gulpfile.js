/* jshint node: true */

(function () {
  "use strict";

  var gulp = require("gulp");
  var gutil = require("gulp-util");
  var rimraf = require("gulp-rimraf");
  var concat = require("gulp-concat");
  var bump = require("gulp-bump");
  var jshint = require("gulp-jshint");
  var minifyCSS = require("gulp-minify-css");
  var usemin = require("gulp-usemin");
  var uglify = require("gulp-uglify");
  var runSequence = require("run-sequence");
  var path = require("path");
  var rename = require("gulp-rename");
  var factory = require("widget-tester").gulpTaskFactory;
  var sourcemaps = require("gulp-sourcemaps");

  var appJSFiles = [
      "src/**/*.js",
      "!./src/components/**/*"
    ],
    htmlFiles = [
      "./src/settings.html",
      "./src/widget.html"
    ];

  gulp.task("clean", function () {
    return gulp.src("dist", {read: false})
      .pipe(rimraf());
  });

  gulp.task("config", function() {
    var env = process.env.NODE_ENV || "dev";
    gutil.log("Environment is", env);

    return gulp.src(["./src/config/" + env + ".js"])
      .pipe(rename("config.js"))
      .pipe(gulp.dest("./src/config"));
  });

  gulp.task("bump", function(){
    return gulp.src(["./package.json", "./bower.json"])
      .pipe(bump({type:"patch"}))
      .pipe(gulp.dest("./"));
  });

  gulp.task("lint", function() {
    return gulp.src(appJSFiles)
      .pipe(jshint())
      .pipe(jshint.reporter("jshint-stylish"))
      .pipe(jshint.reporter("fail"));
  });

  gulp.task("source", ["lint"], function () {
    return gulp.src(htmlFiles)
      .pipe(usemin({
        css: [sourcemaps.init(), minifyCSS(), sourcemaps.write()],
        js: [sourcemaps.init(), uglify(), sourcemaps.write()]
      }))
      .pipe(gulp.dest("dist/"));
  });

  gulp.task("unminify", function () {
    return gulp.src(htmlFiles)
      .pipe(usemin({
        css: [rename(function (path) {
          path.basename = path.basename.substring(0, path.basename.indexOf(".min"))
        }), gulp.dest("dist")],
        js: [rename(function (path) {
          path.basename = path.basename.substring(0, path.basename.indexOf(".min"))
        }), gulp.dest("dist")]
      }))
  });

  gulp.task("fonts", function() {
    return gulp.src("src/components/common-style/dist/fonts/**/*")
      .pipe(gulp.dest("dist/fonts"));
  });

  gulp.task("i18n", function(cb) {
    return gulp.src(["src/components/rv-common-i18n/dist/locales/**/*"])
      .pipe(gulp.dest("dist/locales"));
  });

  gulp.task("rise-storage", function() {
    return gulp.src([
      "src/components/webcomponentsjs/webcomponents.js",
      "src/components/rise-storage/rise-storage.html",
      "src/components/polymer/**/*.*{html,js}",
      "src/components/core-ajax/core-ajax.html",
      "src/components/core-ajax/core-xhr.html"
    ], {base: "./src/"})
      .pipe(gulp.dest("dist/"));
  });

  gulp.task("watch",function(){
    gulp.watch("./src/**/*", ["build"]);
  });

  gulp.task("webdriver_update", factory.webdriveUpdate());

  // e2e testing
  gulp.task("html:e2e", factory.htmlE2E({
    files: ["./src/settings.html", "./src/widget.html", "./test/html/widget-storage-test.html"],
    e2eUrl: ["../node_modules/sinon/pkg/sinon.js", "../node_modules/sinon/pkg/sinon-server-1.12.2.js", "../test/data/url.js"],
    e2eStorage: ["../node_modules/sinon/pkg/sinon.js", "../node_modules/sinon/pkg/sinon-server-1.12.2.js",
      "../test/data/storage.js"]
  }));

  gulp.task("e2e:server", ["config", "html:e2e"], factory.testServer());

  gulp.task("test:e2e:settings", ["webdriver_update"], factory.testE2EAngular({
      testFiles: "test/e2e/settings.js"}
  ));

  gulp.task("test:e2e:widget", factory.testE2E({
      testFiles: "test/e2e/widget-*.js"}
  ));

  gulp.task("e2e:server-close", factory.testServerClose());

  gulp.task("test:e2e", function(cb) {
    runSequence(["html:e2e", "e2e:server"], "test:e2e:settings", "test:e2e:widget", "e2e:server-close", cb);
  });

  gulp.task("test", function(cb) {
    runSequence("test:e2e", cb);
  });

  gulp.task("build", function (cb) {
    runSequence(["clean", "config"], ["source", "fonts", "i18n", "rise-storage"], ["unminify"], cb);
  });

  gulp.task("default", function(cb) {
    runSequence("test", "build", cb);
  });
})();
