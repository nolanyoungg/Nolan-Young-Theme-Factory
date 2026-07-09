<?php
/**
 * Site header with Atlasframe Digital menu panels.
 *
 * @package Nolan_Young_Template
 */

$services = nolan_young_template_services();
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
<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', '007-nolan-young-theme-atlasframe-digital' ); ?></a>
<div class="menu-backdrop" data-menu-backdrop hidden></div>
<header class="site-header" data-site-header>
	<div class="site-header__inner">
		<a class="site-branding" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php nolan_young_template_render_logo(); ?></a>
		<nav class="primary-navigation" aria-label="<?php esc_attr_e( 'Primary navigation', '007-nolan-young-theme-atlasframe-digital' ); ?>">
			<button class="nav-trigger" type="button" data-menu-item="services" aria-controls="services-menu" aria-expanded="false"><?php esc_html_e( 'Services', '007-nolan-young-theme-atlasframe-digital' ); ?></button>
			<button class="nav-trigger" type="button" data-menu-item="about" aria-controls="about-menu" aria-expanded="false"><?php esc_html_e( 'About', '007-nolan-young-theme-atlasframe-digital' ); ?></button>
			<a class="nav-link" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Work', '007-nolan-young-theme-atlasframe-digital' ); ?></a>
			<button class="nav-trigger" type="button" data-menu-item="blog" aria-controls="blog-menu" aria-expanded="false"><?php esc_html_e( 'Blog', '007-nolan-young-theme-atlasframe-digital' ); ?></button>
		</nav>
		<a class="btn btn-header-cta" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', '007-nolan-young-theme-atlasframe-digital' ); ?></a>
		<button class="mobile-menu-toggle" type="button" data-mobile-menu-open aria-controls="mobile-drawer" aria-expanded="false"><span></span><span></span><span></span><span class="screen-reader-text"><?php esc_html_e( 'Open menu', '007-nolan-young-theme-atlasframe-digital' ); ?></span></button>
	</div>
	<div class="nolan-menu" id="services-menu" data-menu-dropdown="services" hidden aria-hidden="true">
		<div class="nolan-menu__inner">
			<div class="nolan-menu__rail" role="list">
				<?php foreach ( $services as $key => $service ) : ?>
					<button type="button" data-rail-item="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $service['title'] ); ?></button>
				<?php endforeach; ?>
			</div>
			<div class="nolan-menu__content">
				<?php foreach ( $services as $key => $service ) : ?>
					<section data-rail-content="<?php echo esc_attr( $key ); ?>" hidden>
						<?php nolan_young_template_render_image( $service['image'], $service['alt'] ); ?>
						<div>
							<p class="eyebrow"><?php esc_html_e( 'Service system', '007-nolan-young-theme-atlasframe-digital' ); ?></p>
							<h2><?php echo esc_html( $service['menu_title'] ); ?></h2>
							<p><?php echo esc_html( $service['description'] ); ?></p>
							<ul><?php foreach ( $service['bullets'] as $bullet ) : ?><li><?php echo esc_html( $bullet ); ?></li><?php endforeach; ?></ul>
							<a class="btn btn-text" href="<?php echo esc_url( $service['url'] ); ?>"><?php esc_html_e( 'Explore service', '007-nolan-young-theme-atlasframe-digital' ); ?></a>
						</div>
					</section>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
	<div class="nolan-menu" id="about-menu" data-menu-dropdown="about" hidden aria-hidden="true">
		<div class="nolan-menu__inner">
			<div class="nolan-menu__rail" role="list">
				<button type="button" data-rail-item="approach"><?php esc_html_e( 'Our Approach', '007-nolan-young-theme-atlasframe-digital' ); ?></button>
				<button type="button" data-rail-item="values"><?php esc_html_e( 'What We Value', '007-nolan-young-theme-atlasframe-digital' ); ?></button>
				<button type="button" data-rail-item="work"><?php esc_html_e( 'How We Work', '007-nolan-young-theme-atlasframe-digital' ); ?></button>
			</div>
			<div class="nolan-menu__content">
				<section data-rail-content="approach" hidden><?php nolan_young_template_render_image( 'assets/images/portfolio/team-collaboration.jpg', __( 'Atlasframe Digital team collaboration around a digital project', '007-nolan-young-theme-atlasframe-digital' ) ); ?><div><h2><?php esc_html_e( 'Start with the structure behind the site', '007-nolan-young-theme-atlasframe-digital' ); ?></h2><ul><li><?php esc_html_e( 'Diagnose the current system', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Define page roles', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Clarify conversion paths', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Document technical decisions', '007-nolan-young-theme-atlasframe-digital' ); ?></li></ul><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'Learn about the approach', '007-nolan-young-theme-atlasframe-digital' ); ?></a></div></section>
				<section data-rail-content="values" hidden><?php nolan_young_template_render_image( 'assets/images/hero/agency-workspace.jpg', __( 'Atlasframe Digital strategy workspace with laptops and planning material', '007-nolan-young-theme-atlasframe-digital' ) ); ?><div><h2><?php esc_html_e( 'Clear decisions, maintainable code, useful handoff', '007-nolan-young-theme-atlasframe-digital' ); ?></h2><ul><li><?php esc_html_e( 'Clarity before decoration', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Accessibility by default', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Content that helps buyers decide', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Documentation as delivery', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Support after launch', '007-nolan-young-theme-atlasframe-digital' ); ?></li></ul><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/about/#values' ) ); ?>"><?php esc_html_e( 'Explore values', '007-nolan-young-theme-atlasframe-digital' ); ?></a></div></section>
				<section data-rail-content="work" hidden><?php nolan_young_template_render_image( 'assets/images/hero/developer-screens.jpg', __( 'Atlasframe Digital developer screens and code workspace', '007-nolan-young-theme-atlasframe-digital' ) ); ?><div><h2><?php esc_html_e( 'A measured path from diagnosis to support', '007-nolan-young-theme-atlasframe-digital' ); ?></h2><ul><li><?php esc_html_e( 'Diagnose', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Frame', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Design', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Develop', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Validate', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Support', '007-nolan-young-theme-atlasframe-digital' ); ?></li></ul><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/about/#process' ) ); ?>"><?php esc_html_e( 'See the process', '007-nolan-young-theme-atlasframe-digital' ); ?></a></div></section>
			</div>
		</div>
	</div>
	<div class="nolan-menu nolan-menu--blog" id="blog-menu" data-menu-dropdown="blog" hidden aria-hidden="true">
		<div class="nolan-menu__blog-grid">
			<?php foreach ( array_slice( $articles, 0, 4 ) as $article ) : ?>
				<article class="blog-card"><?php nolan_young_template_render_image( $article['image'], $article['alt'] ); ?><p class="eyebrow"><?php echo esc_html( $article['tag'] ); ?></p><h3><a href="<?php echo esc_url( $article['url'] ); ?>"><?php echo esc_html( $article['title'] ); ?></a></h3><p><?php echo esc_html( $article['excerpt'] ); ?></p></article>
			<?php endforeach; ?>
		</div>
	</div>
</header>
<aside class="mobile-drawer" id="mobile-drawer" data-mobile-drawer hidden aria-hidden="true">
	<div class="mobile-drawer__top"><a class="site-branding" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php nolan_young_template_render_logo(); ?></a><button type="button" class="mobile-drawer__close" data-mobile-menu-close><?php esc_html_e( 'Close', '007-nolan-young-theme-atlasframe-digital' ); ?></button></div>
	<nav aria-label="<?php esc_attr_e( 'Mobile navigation', '007-nolan-young-theme-atlasframe-digital' ); ?>">
		<section class="mobile-accordion"><button type="button" aria-expanded="false"><?php esc_html_e( 'Services', '007-nolan-young-theme-atlasframe-digital' ); ?></button><div hidden><?php foreach ( $services as $item ) : ?><a href="<?php echo esc_url( $item['url'] ); ?>"><?php echo esc_html( $item['title'] ); ?></a><?php endforeach; ?></div></section>
		<section class="mobile-accordion"><button type="button" aria-expanded="false"><?php esc_html_e( 'About Us', '007-nolan-young-theme-atlasframe-digital' ); ?></button><div hidden><a href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'Our Approach', '007-nolan-young-theme-atlasframe-digital' ); ?></a><a href="<?php echo esc_url( home_url( '/about/#values' ) ); ?>"><?php esc_html_e( 'What We Value', '007-nolan-young-theme-atlasframe-digital' ); ?></a><a href="<?php echo esc_url( home_url( '/about/#process' ) ); ?>"><?php esc_html_e( 'How We Work', '007-nolan-young-theme-atlasframe-digital' ); ?></a></div></section>
		<a href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Work', '007-nolan-young-theme-atlasframe-digital' ); ?></a>
		<section class="mobile-accordion"><button type="button" aria-expanded="false"><?php esc_html_e( 'Blog', '007-nolan-young-theme-atlasframe-digital' ); ?></button><div hidden><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>"><?php esc_html_e( 'All articles', '007-nolan-young-theme-atlasframe-digital' ); ?></a><?php foreach ( $articles as $article ) : ?><a href="<?php echo esc_url( $article['url'] ); ?>"><?php echo esc_html( $article['title'] ); ?></a><?php endforeach; ?></div></section>
		<a class="btn btn-primary btn-full" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', '007-nolan-young-theme-atlasframe-digital' ); ?></a>
	</nav>
</aside>

