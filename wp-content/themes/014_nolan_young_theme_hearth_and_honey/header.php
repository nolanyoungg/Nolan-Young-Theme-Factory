<!doctype html>
<html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo( 'charset' ); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#primary">Skip to the good stuff</a>
<header class="site-header">
    <div class="status-strip">Slow dough. Good coffee. A brighter morning. <span>Tuesday&#8211;Sunday, from 7am</span></div>
    <div class="header-row container">
        <a class="wordmark" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">hearth <i>&amp;</i> honey<span>NEIGHBORHOOD BAKERY &amp; COFFEE</span></a>
        <nav class="desktop-nav" aria-label="Main navigation">
            <?php hearth_honey_link( '/about/', 'Our story' ); ?>
            <div class="menu-peek">
                <?php hearth_honey_link( '/services/', 'Bake menu' ); ?>
                <button class="peek-toggle" type="button" aria-label="Show bake menu feature" aria-expanded="false" aria-controls="menu-feature" hidden><span aria-hidden="true">+</span></button>
                <div class="menu-feature" id="menu-feature" hidden>
                    <?php hearth_honey_photo( 'detail' ); ?>
                    <div><p class="eyebrow">Made for sharing</p><h2>The weekend bread box</h2><p>A country loaf, two buns and a little jar of honey butter.</p><?php hearth_honey_link( '/services/featured/', 'Take a peek →', 'text-link' ); ?></div>
                </div>
            </div>
            <?php hearth_honey_link( '/work/', 'Seasonal bakes' ); hearth_honey_link( '/blog/', 'Journal' ); ?>
        </nav>
        <?php hearth_honey_link( '/contact/', 'Come on in ↗', 'button header-cta' ); ?>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open navigation" hidden><span></span><span></span></button>
    </div>
    <nav id="mobile-menu" class="mobile-menu container" aria-label="Mobile navigation">
        <?php hearth_honey_nav(); hearth_honey_link( '/services/featured/', 'Weekend bread box' ); ?>
        <p>Fresh bread from 7am. Coffee until 2pm.<br>Come for a loaf. Stay for a little while.</p>
    </nav>
</header>
