'use strict';

const fs = require( 'node:fs' );
const path = require( 'node:path' );

const root = path.resolve( __dirname, '..' );

const requiredFiles = [
	'style.css',
	'functions.php',
	'theme.json',
	'screenshot.png',
	'index.php',
	'header.php',
	'footer.php',
	'front-page.php',
	'home.php',
	'404.php',
	'README.md',
	'CHANGELOG.md',
	'webpack.config.js',
	'package.json',
	'package-lock.json',
	'phpunit.xml.dist',
	'build/clean.js',
	'build/dev.js',
	'build/package-theme.js',
	'build/validate.js',
	'assets/css/bundle.css',
	'assets/css/bundle-rtl.css',
	'assets/css/bundle.asset.php',
	'assets/css/editor.css',
	'assets/css/editor-rtl.css',
	'assets/css/editor.asset.php',
	'assets/js/bundle.js',
	'assets/js/bundle.asset.php',
	'inc/setup.php',
	'inc/navigation.php',
	'inc/enqueue.php',
	'template-parts/header/mega-menu-featured.php',
	'template-parts/header/mega-menu-blog.php',
	'src/js/components/mega-menu.js',
	'src/scss/components/_mega-menu.scss',
	'languages/nolan-young-theme-template-01.pot',
];

const missingFiles = requiredFiles.filter(
	( relativePath ) => ! fs.existsSync( path.join( root, relativePath ) )
);

if ( missingFiles.length ) {
	throw new Error( `Missing required theme files:\n${ missingFiles.join( '\n' ) }` );
}

const nonEmptyFiles = [
	'assets/css/bundle.css',
	'assets/css/bundle-rtl.css',
	'assets/css/editor.css',
	'assets/css/editor-rtl.css',
	'assets/js/bundle.js',
	'README.md',
];

for ( const relativePath of nonEmptyFiles ) {
	const filePath = path.join( root, relativePath );

	if ( fs.statSync( filePath ).size === 0 ) {
		throw new Error( `Required file is empty: ${ relativePath }` );
	}
}

const packageJson = JSON.parse(
	fs.readFileSync( path.join( root, 'package.json' ), 'utf8' )
);
const themeJson = JSON.parse(
	fs.readFileSync( path.join( root, 'theme.json' ), 'utf8' )
);

const requiredScripts = {
	start: 'wp-scripts start',
	dev: 'npm run clean && npm run lint && node build/dev.js',
	'dev:fast': 'npm run start',
	clean: 'node build/clean.js',
	'build:assets': 'wp-scripts build',
	build: 'npm run clean && npm run lint && npm run build:assets && npm run validate',
	check: 'npm run lint && npm run validate',
	'lint:node': 'node --check build/clean.js && node --check build/dev.js && node --check build/package-theme.js && node --check build/validate.js',
	test: 'npm run build',
	package: 'npm run build && node build/package-theme.js',
};

for ( const [ scriptName, expectedCommand ] of Object.entries( requiredScripts ) ) {
	if ( packageJson.scripts?.[ scriptName ] !== expectedCommand ) {
		throw new Error(
			`package.json script ${ scriptName } must equal: ${ expectedCommand }`
		);
	}
}

if ( packageJson.devDependencies?.webpack !== '5.107.2' ) {
	throw new Error( 'webpack 5.107.2 must be declared directly in devDependencies.' );
}

if ( themeJson.version !== 3 ) {
	throw new Error( 'theme.json must use version 3.' );
}

if ( themeJson.$schema !== 'https://schemas.wp.org/wp/7.0/theme.json' ) {
	throw new Error( 'theme.json must use the WordPress 7.0 schema.' );
}

const styleHeader = fs.readFileSync( path.join( root, 'style.css' ), 'utf8' );
const preparedSourcePath = path.join( root, '.theme-template-source' );
const preparedMetadata = fs.existsSync( preparedSourcePath )
	? Object.fromEntries(
			fs
				.readFileSync( preparedSourcePath, 'utf8' )
				.split( /\r?\n/ )
				.map( ( line ) => line.split( '=' ) )
				.filter( ( parts ) => parts.length === 2 && parts[ 0 ] )
	  )
	: {};
const preparedSlug = preparedMetadata.prepared_slug || '';
const preparedTitle = preparedSlug
	? preparedSlug.replace( /_/g, ' ' ).replace( /\b\w/g, ( letter ) => letter.toUpperCase() )
	: 'Nolan Young Theme Template 01';
const preparedTextDomain = preparedSlug || 'nolan-young-theme-template-01';
const expectedHeaderFields = [
	`Theme Name: ${ preparedTitle }`,
	`Version: ${ packageJson.version }`,
	'Requires at least: 7.0',
	'Tested up to: 7.0',
	'Requires PHP: 7.4',
	`Text Domain: ${ preparedTextDomain }`,
];

for ( const field of expectedHeaderFields ) {
	if ( ! styleHeader.includes( field ) ) {
		throw new Error( `style.css is missing or mismatches: ${ field }` );
	}
}

const screenshot = fs.readFileSync( path.join( root, 'screenshot.png' ) );
const pngSignature = '89504e470d0a1a0a';

if ( screenshot.subarray( 0, 8 ).toString( 'hex' ) !== pngSignature ) {
	throw new Error( 'screenshot.png is not a valid PNG file.' );
}

const screenshotWidth = screenshot.readUInt32BE( 16 );
const screenshotHeight = screenshot.readUInt32BE( 20 );

if ( screenshotWidth !== 1200 || screenshotHeight !== 900 ) {
	throw new Error(
		`screenshot.png must be exactly 1200x900; found ${ screenshotWidth }x${ screenshotHeight }.`
	);
}

const phpFiles = [];

function collectPhpFiles( directory ) {
	for ( const entry of fs.readdirSync( directory, { withFileTypes: true } ) ) {
		const absolutePath = path.join( directory, entry.name );

		if ( entry.isDirectory() ) {
			if ( [ 'node_modules', 'vendor', 'dist' ].includes( entry.name ) ) {
				continue;
			}
			collectPhpFiles( absolutePath );
		} else if ( entry.name.endsWith( '.php' ) ) {
			phpFiles.push( absolutePath );
		}
	}
}

collectPhpFiles( root );

for ( const phpFile of phpFiles ) {
	const contents = fs.readFileSync( phpFile, 'utf8' );
	const relativePath = path.relative( root, phpFile );

	if ( /register_post_type\s*\(/.test( contents ) ) {
		throw new Error(
			`Theme architecture violation: register_post_type() found in ${ relativePath }.`
		);
	}

	if ( /register_taxonomy\s*\(/.test( contents ) ) {
		throw new Error(
			`Theme architecture violation: register_taxonomy() found in ${ relativePath }.`
		);
	}
}

if ( fs.existsSync( path.join( root, '403.php' ) ) ) {
	throw new Error( 'Unsupported root-level 403.php must not exist.' );
}

for ( const metadataPath of [
	'assets/css/bundle.asset.php',
	'assets/css/editor.asset.php',
	'assets/js/bundle.asset.php',
] ) {
	const metadata = fs.readFileSync( path.join( root, metadataPath ), 'utf8' );

	if ( ! metadata.includes( "'dependencies'" ) || ! metadata.includes( "'version'" ) ) {
		throw new Error( `Invalid webpack asset metadata: ${ metadataPath }` );
	}
}

console.log(
	`Validated ${ requiredFiles.length } required files, ${ phpFiles.length } PHP files, theme.json, style.css metadata, asset metadata, architecture boundaries, and the 1200x900 screenshot.`
);
