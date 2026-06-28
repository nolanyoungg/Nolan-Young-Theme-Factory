'use strict';

/**
 * Starts a production-mode webpack watcher for local development.
 *
 * This command intentionally emits minified, production-style assets after
 * every source change. Use `npm run start` for faster, readable development
 * output and use `npm run build` as the final clean release gate.
 */

process.env.NODE_ENV = 'production';

const path = require( 'node:path' );
const webpack = require( 'webpack' );
const webpackConfig = require( path.resolve( __dirname, '../webpack.config.js' ) );

const compiler = webpack( {
	...webpackConfig,
	mode: 'production',
} );

const watcher = compiler.watch( {}, ( error, stats ) => {
	if ( error ) {
		console.error( error.stack || error.message || error );
		if ( error.details ) {
			console.error( error.details );
		}
		return;
	}

	const information = stats.toJson();

	if ( stats.hasErrors() ) {
		for ( const compilationError of information.errors || [] ) {
			console.error( compilationError.message || compilationError );
		}
	}

	if ( stats.hasWarnings() ) {
		for ( const compilationWarning of information.warnings || [] ) {
			console.warn( compilationWarning.message || compilationWarning );
		}
	}

	console.log(
		stats.toString( {
			all: false,
			assets: true,
			colors: process.stdout.isTTY,
			errors: true,
			timings: true,
			warnings: true,
		} )
	);
} );

let isClosing = false;

function closeWatcher( signal ) {
	if ( isClosing ) {
		return;
	}

	isClosing = true;
	console.log( `\nReceived ${ signal }; stopping the production watcher...` );

	const forcedExit = setTimeout( () => {
		console.error( 'The webpack watcher did not close within five seconds.' );
		process.exit( 1 );
	}, 5000 );

	forcedExit.unref();

	watcher.close( ( closeError ) => {
		clearTimeout( forcedExit );

		if ( closeError ) {
			console.error( closeError );
			process.exit( 1 );
		}

		process.exit( 0 );
	} );
}

process.on( 'SIGINT', () => closeWatcher( 'SIGINT' ) );
process.on( 'SIGTERM', () => closeWatcher( 'SIGTERM' ) );
