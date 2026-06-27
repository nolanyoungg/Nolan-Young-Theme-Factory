'use strict';

const fs = require( 'node:fs' );
const path = require( 'node:path' );
const { ZipArchive } = require( 'archiver' );

const root = path.resolve( __dirname, '..' );
const slug = 'nolan-young-theme-template-01';
const distDirectory = path.join( root, 'dist' );
const outputPath = path.join( distDirectory, `${ slug }.zip` );

const runtimeEntries = [
	'404.php',
	'CHANGELOG.md',
	'LICENSE.txt',
	'README.md',
	'archive-ny_service.php',
	'archive.php',
	'assets',
	'comments.php',
	'footer.php',
	'front-page.php',
	'functions.php',
	'header.php',
	'home.php',
	'inc',
	'index.php',
	'languages',
	'page-templates',
	'page.php',
	'patterns',
	'privacy-policy.php',
	'screenshot.png',
	'search.php',
	'searchform.php',
	'single-ny_service.php',
	'single.php',
	'singular.php',
	'style.css',
	'taxonomy-ny_service_category.php',
	'template-parts',
	'theme.json',
];

fs.mkdirSync( distDirectory, { recursive: true } );

const output = fs.createWriteStream( outputPath );
const archive = new ZipArchive( { zlib: { level: 9 } } );

output.on( 'close', () => {
	console.log( `Created ${ path.relative( root, outputPath ) } (${ archive.pointer() } bytes).` );
} );

archive.on( 'warning', ( error ) => {
	if ( error.code !== 'ENOENT' ) {
		throw error;
	}
	console.warn( error.message );
} );

archive.on( 'error', ( error ) => {
	throw error;
} );

archive.pipe( output );

for ( const entry of runtimeEntries ) {
	const sourcePath = path.join( root, entry );

	if ( ! fs.existsSync( sourcePath ) ) {
		throw new Error( `Cannot package missing runtime entry: ${ entry }` );
	}

	const destination = path.posix.join( slug, entry.replaceAll( path.sep, '/' ) );
	const stat = fs.statSync( sourcePath );

	if ( stat.isDirectory() ) {
		archive.directory( sourcePath, destination );
	} else {
		archive.file( sourcePath, { name: destination } );
	}
}

archive.finalize();
