# Codex Repair Findings

Theme slug: 016_nolan_young_theme_premium_test016
Failure: Preview generation failed.

## Preview Output

ERROR: PHP preview render failed for front-page.php:
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="assets/css/bundle.css"></head>

<body class="home page-template-front-page">

<div id="page" class="site">
    <header id="masthead" class="site-header" role="banner">
        <div class="container">
            <div class="site-branding">
                <a href="homepage_preview.html" rel="home" title="Northstar Websites">
                    <span class="site-title">Northstar Websites</span>
                </a>
            </div><!-- .site-branding -->

            <nav id="site-navigation" class="main-navigation" role="navigation">
                <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false">Primary Menu</button>

Fatal error: Uncaught Error: Class "Custom_Nav_Walker" not found in C:\Users\NolanYoung\codex-ggi-nolan-local\repos\Nolan-Young-Theme-Factory\wp-content\themes\016_nolan_young_theme_premium_test016\header.php:36
Stack trace:
#0 C:\Users\NolanYoung\AppData\Local\Temp\theme-preview-harness-27428-1782147698626-a553f9f406cbc8.php(213): include()
#1 C:\Users\NolanYoung\codex-ggi-nolan-local\repos\Nolan-Young-Theme-Factory\wp-content\themes\016_nolan_young_theme_premium_test016\front-page.php(7): get_header()
#2 C:\Users\NolanYoung\AppData\Local\Temp\theme-preview-harness-27428-1782147698626-a553f9f406cbc8.php(234): include('C:\\Users\\NolanY...')
#3 {main}
  thrown in C:\Users\NolanYoung\codex-ggi-nolan-local\repos\Nolan-Young-Theme-Factory\wp-content\themes\016_nolan_young_theme_premium_test016\header.php on line 36

## Build Output

> 016-nolan-young-theme-premium-test016@1.0.0 build
> webpack --config build/webpack.config.js && sass --no-source-map src/scss/main.scss assets/css/bundle.css --style=compressed

asset [1m[32m../css/bundle.css[39m[22m 4.9 KiB [1m[33m[compared for emit][39m[22m (name: main)
asset [1m[32mbundle.js[39m[22m 537 bytes [1m[33m[compared for emit][39m[22m [1m[32m[minimized][39m[22m (name: main)
Entrypoint [1mmain[39m[22m 5.43 KiB = [1m[32m../css/bundle.css[39m[22m 4.9 KiB [1m[32mbundle.js[39m[22m 537 bytes
orphan modules 7.63 KiB (javascript) 937 bytes (runtime) [1m[33m[orphan][39m[22m 7 modules
cacheable modules 881 bytes (javascript) 4.9 KiB (css/mini-extract)
  [1m./src/js/main.js[39m[22m 831 bytes [1m[33m[built][39m[22m [1m[33m[code generated][39m[22m
  [1m./src/scss/main.scss[39m[22m 50 bytes [1m[33m[built][39m[22m [1m[33m[code generated][39m[22m
  css ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js![1m./src/scss/main.scss[39m[22m 4.9 KiB [1m[33m[built][39m[22m [1m[33m[code generated][39m[22m
webpack 5.107.2 compiled [1m[32msuccessfully[39m[22m in 384 ms
Built assets for 016_nolan_young_theme_premium_test016
