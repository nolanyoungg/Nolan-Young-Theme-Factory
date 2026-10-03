<?php /** Ridge & River compact trailhead navigation. */ ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo( 'charset' ); ?>"><meta name="viewport" content="width=device-width, initial-scale=1"><?php wp_head(); ?></head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link" href="#primary">Skip to the trail guide</a>
<header class="site-header">
	<div class="header-inner container">
		<a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php ridge_river_mark( 1 ); ?><span>Ridge <i>&</i> River<small>WALKING & OUTDOOR GUIDING</small></span></a>
		<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="trail-navigation" hidden><span class="menu-bars" aria-hidden="true"></span><span class="screen-reader-text">Open navigation</span></button>
		<nav class="trail-navigation" id="trail-navigation" aria-label="Main navigation">
			<?php ridge_river_nav(); ?>
			<div class="drawer-note"><?php ridge_river_photo(); ?><p>Small groups. Open skies.<br>A good day starts with a little planning.</p><a href="<?php echo esc_url( home_url( '/services/featured/' ) ); ?>">Explore the full-day ridge walk ↗</a></div>
		</nav>
	</div>
</header>

