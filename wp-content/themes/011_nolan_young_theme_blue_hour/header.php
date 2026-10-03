<?php /** Blue Hour masthead: direct links and one small listening-room disclosure. */ ?>
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
	<div class="container masthead">
		<a class="wordmark" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" aria-label="Blue Hour home">BLUE HOUR<span>JAZZ &amp; LISTENING ROOM</span></a>
		<button class="menu-toggle" type="button" aria-controls="site-navigation" aria-expanded="false" hidden><span class="menu-lines" aria-hidden="true"></span><span class="screen-reader-text">Menu</span></button>
		<nav id="site-navigation" class="site-navigation" aria-label="Main navigation">
			<?php foreach ( blue_hour_nav() as $path => $label ) { blue_hour_link( $path, $label, '/contact/' === $path ? 'nav-visit' : '' ); } ?>
			<p class="mobile-note">Low lights. Open ears.<br>A fictional room for very real listening.</p>
		</nav>
		<details class="room-disclosure">
			<summary aria-label="A note from the room">33⅓ <span aria-hidden="true">+</span></summary>
			<div class="room-panel"><?php blue_hour_photo( 'detail' ); ?><div><p class="eyebrow">Settle into the sound</p><h2>A seat. A side. A whole new mood.</h2><p>Live sessions, carefully chosen records, and evenings made for listening.</p><?php blue_hour_link( '/services/', 'Find your kind of night ↗' ); ?></div></div>
		</details>
	</div>
</header>
