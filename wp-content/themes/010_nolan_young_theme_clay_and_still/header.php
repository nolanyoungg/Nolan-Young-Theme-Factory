<?php /** Clay & Still masthead and compact studio navigation. */ ?>
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
	<div class="header-inner container">
		<a class="wordmark" href="<?php echo clay_url(); ?>" rel="home" aria-label="Clay and Still — home">clay <i>&amp;</i> still<span>AN INDEPENDENT CERAMICS STUDIO</span></a>
		<nav class="desktop-nav" aria-label="Main navigation">
			<a href="<?php echo clay_url( '/work/' ); ?>">Collection</a>
			<a href="<?php echo clay_url( '/about/' ); ?>">Our studio</a>
			<details class="nav-disclosure">
				<summary>Workshops <span aria-hidden="true">⌄</span></summary>
				<div class="workshop-menu">
					<?php clay_image( 'detail' ); ?>
					<div><p class="eyebrow">Make a little space</p><p>Clay, conversation, and something made by you.</p><a href="<?php echo clay_url( '/services/featured/' ); ?>">Intro to handbuilding ↗</a><a href="<?php echo clay_url( '/services/' ); ?>">All studio experiences ↗</a></div>
				</div>
			</details>
			<a href="<?php echo clay_url( '/blog/' ); ?>">Journal</a>
		</nav>
		<a class="header-contact" href="<?php echo clay_url( '/contact/' ); ?>">Say hello <span aria-hidden="true">↗</span></a>
		<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open navigation" hidden><span></span><span></span></button>
	</div>
	<nav id="mobile-nav" class="mobile-nav" aria-label="Mobile navigation">
		<div class="mobile-links"><?php clay_nav(); ?></div>
		<div class="drawer-note"><?php clay_image( 'detail' ); ?><p>Good things take shape slowly.<br><a href="<?php echo clay_url( '/services/featured/' ); ?>">Find your place at the clay table ↗</a></p></div>
	</nav>
</header>
