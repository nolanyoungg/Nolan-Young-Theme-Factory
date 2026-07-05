<?php
/**
 * Site header with Evergreen Yardworks navigation panels.
 *
 * @package Nolan_Young_Template
 */

$services = nolan_young_template_services();
$plans    = nolan_young_template_plans();
$articles = nolan_young_template_articles();
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', '005-nolan-young-theme-evergreen-yardworks' ); ?></a>
<div class="menu-backdrop" data-menu-backdrop hidden></div>
<header class="site-header" data-site-header>
	<div class="site-status"><span><?php esc_html_e( 'Now scheduling seasonal cleanups', '005-nolan-young-theme-evergreen-yardworks' ); ?></span><span><?php esc_html_e( 'Serving residential properties across the metro area', '005-nolan-young-theme-evergreen-yardworks' ); ?></span></div>
	<div class="site-header__inner">
		<a class="site-branding" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php nolan_young_template_render_logo(); ?></a>
		<nav class="primary-navigation" aria-label="<?php esc_attr_e( 'Primary navigation', '005-nolan-young-theme-evergreen-yardworks' ); ?>">
			<button class="nav-trigger" type="button" data-menu-item="services" aria-controls="services-menu" aria-expanded="false"><?php esc_html_e( 'Services', '005-nolan-young-theme-evergreen-yardworks' ); ?></button>
			<button class="nav-trigger" type="button" data-menu-item="plans" aria-controls="plans-menu" aria-expanded="false"><?php esc_html_e( 'Plans', '005-nolan-young-theme-evergreen-yardworks' ); ?></button>
			<a class="nav-link" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Work', '005-nolan-young-theme-evergreen-yardworks' ); ?></a>
			<button class="nav-trigger" type="button" data-menu-item="guide" aria-controls="guide-menu" aria-expanded="false"><?php esc_html_e( 'Seasonal Guide', '005-nolan-young-theme-evergreen-yardworks' ); ?></button>
			<a class="nav-link" href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'About', '005-nolan-young-theme-evergreen-yardworks' ); ?></a>
			<a class="nav-link" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact', '005-nolan-young-theme-evergreen-yardworks' ); ?></a>
		</nav>
		<a class="btn btn-header-cta" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Request an Estimate', '005-nolan-young-theme-evergreen-yardworks' ); ?></a>
		<button class="mobile-menu-toggle" type="button" data-mobile-menu-open aria-controls="mobile-drawer" aria-expanded="false"><span></span><span></span><span></span><span class="screen-reader-text"><?php esc_html_e( 'Open menu', '005-nolan-young-theme-evergreen-yardworks' ); ?></span></button>
	</div>
	<div class="nolan-menu" id="services-menu" data-menu-dropdown="services" hidden>
		<div class="nolan-menu__inner">
			<div class="nolan-menu__rail" role="list">
				<?php foreach ( $services as $key => $service ) : ?>
					<button type="button" data-rail-item="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $service['title'] ); ?></button>
				<?php endforeach; ?>
			</div>
			<div class="nolan-menu__content">
				<?php foreach ( $services as $key => $service ) : ?>
					<section data-rail-content="<?php echo esc_attr( $key ); ?>">
						<?php nolan_young_template_render_image( $service['image'], $service['title'] ); ?>
						<div><p class="eyebrow"><?php esc_html_e( 'Lawn and landscape service', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h2><?php echo esc_html( $service['title'] ); ?></h2><p><?php echo esc_html( $service['excerpt'] ); ?></p><ul><?php foreach ( $service['bullets'] as $bullet ) : ?><li><?php echo esc_html( $bullet ); ?></li><?php endforeach; ?></ul><a class="btn btn-text" href="<?php echo esc_url( $service['url'] ); ?>"><?php esc_html_e( 'View service details', '005-nolan-young-theme-evergreen-yardworks' ); ?></a></div>
					</section>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
	<div class="nolan-menu" id="plans-menu" data-menu-dropdown="plans" hidden>
		<div class="nolan-menu__inner">
			<div class="nolan-menu__rail" role="list">
				<?php foreach ( $plans as $index => $plan ) : ?>
					<button type="button" data-rail-item="plan-<?php echo esc_attr( $index ); ?>"><?php echo esc_html( $plan['title'] ); ?></button>
				<?php endforeach; ?>
			</div>
			<div class="nolan-menu__content">
				<?php foreach ( $plans as $index => $plan ) : ?>
					<section data-rail-content="plan-<?php echo esc_attr( $index ); ?>">
						<?php nolan_young_template_render_image( 0 === $index ? 'assets/images/portfolio/lawn-maintenance.jpg' : 'assets/images/portfolio/landscape-install.jpg', $plan['title'] ); ?>
						<div><p class="eyebrow"><?php esc_html_e( 'Maintenance plan', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h2><?php echo esc_html( $plan['title'] ); ?></h2><p><?php echo esc_html( $plan['text'] ); ?></p><a class="btn btn-primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Build My Yard Plan', '005-nolan-young-theme-evergreen-yardworks' ); ?></a></div>
					</section>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
	<div class="nolan-menu nolan-menu--blog" id="guide-menu" data-menu-dropdown="guide" hidden>
		<div class="nolan-menu__blog-grid">
			<?php foreach ( $articles as $article ) : ?>
				<article class="blog-card"><?php nolan_young_template_render_image( $article['image'], $article['title'] ); ?><p class="eyebrow"><?php echo esc_html( $article['tag'] ); ?></p><h3><a href="<?php echo esc_url( $article['url'] ); ?>"><?php echo esc_html( $article['title'] ); ?></a></h3><p><?php echo esc_html( $article['excerpt'] ); ?></p></article>
			<?php endforeach; ?>
		</div>
	</div>
</header>
<aside class="mobile-drawer" id="mobile-drawer" data-mobile-drawer hidden>
	<div class="mobile-drawer__top"><a class="site-branding" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php nolan_young_template_render_logo(); ?></a><button type="button" class="mobile-drawer__close" data-mobile-menu-close><?php esc_html_e( 'Close', '005-nolan-young-theme-evergreen-yardworks' ); ?></button></div>
	<nav aria-label="<?php esc_attr_e( 'Mobile navigation', '005-nolan-young-theme-evergreen-yardworks' ); ?>">
		<section class="mobile-accordion"><button type="button" aria-expanded="false"><?php esc_html_e( 'Services', '005-nolan-young-theme-evergreen-yardworks' ); ?></button><div hidden><?php foreach ( $services as $item ) : ?><a href="<?php echo esc_url( $item['url'] ); ?>"><?php echo esc_html( $item['title'] ); ?></a><?php endforeach; ?></div></section>
		<section class="mobile-accordion"><button type="button" aria-expanded="false"><?php esc_html_e( 'Plans', '005-nolan-young-theme-evergreen-yardworks' ); ?></button><div hidden><?php foreach ( $plans as $item ) : ?><a href="<?php echo esc_url( home_url( '/services/' ) ); ?>"><?php echo esc_html( $item['title'] ); ?></a><?php endforeach; ?></div></section>
		<a href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Work', '005-nolan-young-theme-evergreen-yardworks' ); ?></a>
		<section class="mobile-accordion"><button type="button" aria-expanded="false"><?php esc_html_e( 'Seasonal Guide', '005-nolan-young-theme-evergreen-yardworks' ); ?></button><div hidden><?php foreach ( $articles as $article ) : ?><a href="<?php echo esc_url( $article['url'] ); ?>"><?php echo esc_html( $article['title'] ); ?></a><?php endforeach; ?></div></section>
		<a href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'About', '005-nolan-young-theme-evergreen-yardworks' ); ?></a>
		<a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact', '005-nolan-young-theme-evergreen-yardworks' ); ?></a>
		<a class="btn btn-primary btn-full" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Request an Estimate', '005-nolan-young-theme-evergreen-yardworks' ); ?></a>
	</nav>
</aside>

