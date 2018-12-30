const gulp = require("gulp");
const rollup = require("rollup");
const typescript = require("rollup-plugin-typescript");
const uglify = require("gulp-uglify-es").default;
const rename = require("gulp-rename");

gulp.task("build", () => {
	return rollup.rollup({
		input: "./src/browser.ts",
		plugins: [
			typescript()
		]
	}).then(bundle => {
		return bundle.write({
			file: "./bundle.js",
			format: "iife"
		});
	});
});

gulp.task("uglify", () => {
	return gulp.src("./bundle.js")
		.pipe(rename("bundle.min.js"))
		.pipe(uglify())
		.pipe(gulp.dest("."));
});

gulp.task("default", gulp.series(["build", "uglify"]));