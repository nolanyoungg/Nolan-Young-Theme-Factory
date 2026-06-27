'use strict';

const fs = require( 'node:fs' );
const path = require( 'node:path' );

const root = path.resolve( __dirname, '..' );
const generatedFiles = [
	'assets/css/bundle.css',
	'assets/css/bundle-rtl.css',
	'assets/css/bundle.asset.php',
	'assets/css/editor.css',
	'assets/css/editor-rtl.css',
	'assets/css/editor.asset.php',
	'assets/js/bundle.js',
	'assets/js/bundle.asset.php',
];

for ( const relativePath of generatedFiles ) {
	const absolutePath = path.join( root, relativePath );

	if ( fs.existsSync( absolutePath ) ) {
		fs.rmSync( absolutePath, { force: true } );
		console.log( `Removed ${ relativePath }` );
	}
}
