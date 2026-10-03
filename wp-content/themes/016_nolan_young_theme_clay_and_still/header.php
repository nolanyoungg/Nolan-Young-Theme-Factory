<?php /** Clay & Still — a quiet studio masthead. */ ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#primary">Skip to content</a>
<header class="site-header">
	<div class="header-inner wrap">
		<a class="wordmark" href="<?php echo clay_still_url(); ?>" rel="home" aria-label="Clay & Still — home">clay <i>&amp;</i> still<span>INDEPENDENT CERAMICS STUDIO</span></a>
		<nav class="desktop-nav" aria-label="Primary navigation">
			<a href="<?php echo clay_still_url( '/work/' ); ?>">Collection</a>
			<a href="<?php echo clay_still_url( '/about/' ); ?>">Our studio</a>
			<details class="studio-menu">
				<summary>At the table <span aria-hidden="true">+</span></summary>
				<div class="studio-menu-panel">
					<?php clay_still_image( 'red', 'menu-photo' ); ?>
					<div><p class="eyebrow">Make a little room</p><p>Clay, conversation, and time to try.</p><a href="<?php echo clay_still_url( '/services/' ); ?>">Workshops &amp; studio sessions ↗</a><a href="<?php echo clay_still_url( '/services/featured/' ); ?>">Begin with handbuilding ↗</a><a href="<?php echo clay_still_url( '/contact/' ); ?>">Discuss a commission ↗</a></div>
				</div>
			</details>
			<a href="<?php echo clay_still_url( '/blog/' ); ?>">Journal</a>
		</nav>
		<a class="header-contact" href="<?php echo clay_still_url( '/contact/' ); ?>">Say hello <span aria-hidden="true">↗</span></a>
		<button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="mobile-drawer" data-menu-toggle><span></span><span></span></button>
	</div>
	<div class="mobile-drawer" id="mobile-drawer" hidden>
		<nav aria-label="Mobile navigation">
			<?php foreach ( clay_still_navigation() as $path => $label ) : ?>
				<a href="<?php echo clay_still_url( $path ); ?>"><?php echo esc_html( $label ); ?><span aria-hidden="true">↗</span></a>
			<?php endforeach; ?>
		</nav>
		<div class="drawer-note"><?php clay_still_image( 'red' ); ?><p>Good things take shape slowly.<br><a href="<?php echo clay_still_url( '/services/featured/' ); ?>">Explore handbuilding →</a></p></div>
	</div>
	<noscript><nav class="no-js-nav wrap" aria-label="Navigation"><?php foreach ( clay_still_navigation() as $path => $label ) : ?><a href="<?php echo clay_still_url( $path ); ?>"><?php echo esc_html( $label ); ?></a><?php endforeach; ?></nav></noscript>
</header>

