const gulp = require("gulp");
const rollup = require("rollup-stream");
const rollupTypescript = require("rollup-plugin-typescript");
const uglify = require("gulp-uglify-es").default;
const rename = require("gulp-rename");
const license = require("gulp-license");
const sourcemaps = require("gulp-sourcemaps");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");

gulp.task("browser", () => {
	return rollup({
		input: "./src/browser.ts",
		plugins: [
			rollupTypescript()
		],
		sourcemap: true,
		format: "iife"
	})
	.pipe(source("browser.ts", "./src"))
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(rename("bundle.js"))
	.pipe(license("MIT", {tiny: true, organization: "comp500"}))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist"));
});

gulp.task("browser-min", () => {
	return rollup({
		input: "./src/browser.ts",
		plugins: [
			rollupTypescript()
		],
		sourcemap: true,
		format: "iife"
	})
	.pipe(source("browser.ts", "./src"))
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(rename("bundle.min.js"))
	.pipe(uglify())
	.pipe(license("MIT", {tiny: true, organization: "comp500"}))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist"));
});

gulp.task("default", gulp.parallel(["browser", "browser-min"]));