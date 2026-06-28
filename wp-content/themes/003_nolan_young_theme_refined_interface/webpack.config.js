'use strict';

const path = require( 'node:path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const RemoveEmptyScriptsPlugin = require( 'webpack-remove-empty-scripts' );

/**
 * Extends WordPress' maintained webpack configuration for this theme.
 *
 * Source files live under /src. Production browser assets are emitted under
 * /assets so WordPress can enqueue them directly from the installed theme.
 */
module.exports = {
	...defaultConfig,
	entry: {
		'js/bundle': path.resolve( process.cwd(), 'src/js/main.js' ),
		'css/bundle': path.resolve( process.cwd(), 'src/scss/main.scss' ),
		'css/editor': path.resolve( process.cwd(), 'src/scss/editor.scss' ),
	},
	output: {
		...defaultConfig.output,
		path: path.resolve( process.cwd(), 'assets' ),
		filename: '[name].js',
		clean: false,
	},
	plugins: [
		...defaultConfig.plugins,
		new RemoveEmptyScriptsPlugin( {
			stage: RemoveEmptyScriptsPlugin.STAGE_AFTER_PROCESS_PLUGINS,
		} ),
	],
};
