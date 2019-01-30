import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import buble from 'rollup-plugin-buble'; // Transpile/polyfill with reasonable browser support
export default {
	input: 'src/wrapper.js', // Path relative to package.json
	output: {
		name: 'VuePullTo',
		exports: 'named',
	},

	plugins: [
		vue({
			css: true, // Dynamically inject css as a <style> tag
			compileTemplate: true, // Explicitly convert template to render function
		}),
		buble(), // Transpile to ES5
	],

	watch: {
		chokidar: true,

		// include and exclude govern which files to watch. by
		// default, all dependencies will be watched
		exclude: [ 'node_modules/**' ]
	},
};
