<?php /** Form & Field editorial masthead. */ ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo( 'charset' ); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#primary">Skip to content</a>
<header class="site-header">
    <div class="header-row container">
        <a class="wordmark" href="<?php echo ff_url(); ?>" rel="home" aria-label="Form and Field — home">form <span>&amp;</span> field<span class="wordmark-dot">.</span></a>
        <span class="header-discipline">Architecture<br>&amp; interiors</span>
        <nav class="desktop-nav" aria-label="Primary navigation">
            <a href="<?php echo ff_url( '/about/' ); ?>">Studio</a>
            <details class="service-menu"><summary>Services <span aria-hidden="true">+</span></summary>
                <div class="service-menu__panel">
                    <?php ff_image( 'detail' ); ?>
                    <div><p class="eyebrow">From place to possibility</p><p>Thoughtful spaces, at every scale.</p>
                    <a href="<?php echo ff_url( '/services/featured/' ); ?>">Residential architecture ↗</a>
                    <a href="<?php echo ff_url( '/services/' ); ?>#reuse">Adaptive reuse ↗</a>
                    <a href="<?php echo ff_url( '/services/' ); ?>#interiors">Interior design ↗</a>
                    <a class="text-link" href="<?php echo ff_url( '/services/' ); ?>">All capabilities</a></div>
                </div>
            </details>
            <a href="<?php echo ff_url( '/work/' ); ?>">Work</a><a href="<?php echo ff_url( '/blog/' ); ?>">Journal</a>
            <a class="nav-contact" href="<?php echo ff_url( '/contact/' ); ?>">Let’s talk <span aria-hidden="true">↗</span></a>
        </nav>
        <details class="mobile-menu">
            <summary aria-controls="mobile-drawer" aria-label="Navigation"><span class="hamburger" aria-hidden="true"></span><span class="screen-reader-text">Menu</span></summary>
            <div id="mobile-drawer" class="mobile-drawer"><p class="eyebrow">Form &amp; Field / Explore</p><nav aria-label="Mobile navigation"><?php ff_navigation(); ?></nav><a class="drawer-service" href="<?php echo ff_url( '/services/featured/' ); ?>">Residential architecture ↗</a><p>Spaces for the way we live.<br>Architecture &amp; interiors.</p></div>
        </details>
    </div>
</header>

