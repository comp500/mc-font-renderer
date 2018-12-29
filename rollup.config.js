import typescript from "rollup-plugin-typescript";

export default {
	input: "./src/browser.ts",
	plugins: [
		typescript()
	],
	output: {
		file: "./bundle.js",
		format: "iife"
	}
}