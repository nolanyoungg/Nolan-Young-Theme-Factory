<?php /** Ridge & River: a quiet, direct navigation. */ ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#primary">Skip to the trail guide</a>
<header class="site-header">
    <div class="header-note"><span>SMALL GROUPS. OPEN SKIES.</span><span>A FICTIONAL OUTDOOR OUTFITTER / FIELD GUIDE No. 01</span></div>
    <div class="header-row container">
        <a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="Ridge & River home"><?php rr_mark(); ?><span>RIDGE <i>&</i> RIVER<small>WALKING & OUTDOOR GUIDING</small></span></a>
        <nav class="desktop-nav" aria-label="Primary navigation">
            <?php foreach ( rr_navigation() as $path => $label ) : if ( '/' === $path ) { continue; } rr_link( $path, $label, '/contact/' === $path ? 'nav-contact' : '' ); endforeach; ?>
        </nav>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu"><span class="menu-lines" aria-hidden="true"></span><span class="screen-reader-text">Menu</span></button>
    </div>
    <nav id="mobile-menu" class="mobile-menu container" aria-label="Mobile navigation" hidden>
        <?php foreach ( rr_navigation() as $path => $label ) { rr_link( $path, $label ); } ?>
        <div class="menu-note"><?php rr_photo(); ?><p>A little further.<br>A little more present.<small>Explore illustrative walks and plan your kind of day.</small></p></div>
    </nav>
    <noscript><nav class="no-js-nav container" aria-label="Navigation"><?php foreach ( rr_navigation() as $path => $label ) { rr_link( $path, $label ); } ?></nav></noscript>
</header>
