<?php
/**
 * Header.
 *
 * @package Nolan_Young_Template
 */

defined( 'ABSPATH' ) || exit;
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header class="site-header" data-header>
	<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', '001_nolan_young_theme_nolan_designs' ); ?></a>
	<div class="site-header__backdrop" data-backdrop hidden></div>
	<div class="site-header__inner">
		<a class="site-logo" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
			<?php echo wp_kses_post( nolan_young_template_svg_logo() ); ?>
			<span class="site-logo__text">
				<strong><?php echo esc_html( get_bloginfo( 'name' ) ); ?></strong>
				<span><?php esc_html_e( 'Websites that help businesses grow.', '001_nolan_young_theme_nolan_designs' ); ?></span>
			</span>
		</a>
		<nav class="site-header__nav" aria-label="<?php esc_attr_e( 'Primary navigation', '001_nolan_young_theme_nolan_designs' ); ?>">
			<button class="site-nav__trigger" type="button" data-menu-item="services" aria-controls="services-menu" aria-expanded="false"><?php esc_html_e( 'Services', '001_nolan_young_theme_nolan_designs' ); ?></button>
			<button class="site-nav__trigger" type="button" data-menu-item="about" aria-controls="about-menu" aria-expanded="false"><?php esc_html_e( 'About', '001_nolan_young_theme_nolan_designs' ); ?></button>
			<a class="site-nav__link" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Work', '001_nolan_young_theme_nolan_designs' ); ?></a>
			<button class="site-nav__trigger" type="button" data-menu-item="blog" aria-controls="blog-menu" aria-expanded="false"><?php esc_html_e( 'Blog', '001_nolan_young_theme_nolan_designs' ); ?></button>
		</nav>
		<div class="site-header__cta">
			<a class="btn btn-header-cta" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', '001_nolan_young_theme_nolan_designs' ); ?></a>
			<button class="mobile-menu-toggle" type="button" data-mobile-open aria-controls="mobile-drawer" aria-expanded="false"><?php esc_html_e( 'Menu', '001_nolan_young_theme_nolan_designs' ); ?></button>
		</div>
	</div>
	<div class="site-header__panels">
		<div class="site-panel" id="services-menu" data-menu-dropdown="services" hidden>
			<div class="site-panel__grid">
				<div class="site-panel__rail">
					<?php foreach ( array_keys( nolan_young_template_services() ) as $key ) : ?>
						<button type="button" data-rail-item="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( ucwords( str_replace( array( '-', '&' ), array( ' ', ' & ' ), $key ) ) ); ?></button>
					<?php endforeach; ?>
				</div>
				<div class="site-panel__content">
					<?php foreach ( nolan_young_template_services() as $key => $service ) : ?>
						<section data-rail-content="<?php echo esc_attr( $key ); ?>" <?php echo 'wordpress-design' === $key ? '' : 'hidden'; ?>>
							<h3><?php echo esc_html( $service['title'] ); ?></h3>
							<p><?php echo esc_html( $service['summary'] ); ?></p>
							<ul><li><?php esc_html_e( 'Built for clarity', '001_nolan_young_theme_nolan_designs' ); ?></li><li><?php esc_html_e( 'Mobile-ready by default', '001_nolan_young_theme_nolan_designs' ); ?></li><li><?php esc_html_e( 'Structured for growth', '001_nolan_young_theme_nolan_designs' ); ?></li></ul>
						</section>
					<?php endforeach; ?>
				</div>
			</div>
		</div>
		<div class="site-panel" id="about-menu" data-menu-dropdown="about" hidden>
			<div class="site-panel__grid">
				<div class="site-panel__rail">
					<?php foreach ( array( 'our-approach' => 'Our Approach', 'what-we-value' => 'What We Value', 'how-we-work' => 'How We Work' ) as $key => $label ) : ?>
						<button type="button" data-rail-item="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $label ); ?></button>
					<?php endforeach; ?>
				</div>
				<div class="site-panel__content">
					<section data-rail-content="our-approach">
						<h3><?php esc_html_e( 'Purposeful, editorial, and practical.', '001_nolan_young_theme_nolan_designs' ); ?></h3>
						<p><?php esc_html_e( 'We design systems that help service businesses communicate clearly and convert consistently.', '001_nolan_young_theme_nolan_designs' ); ?></p>
					</section>
					<section data-rail-content="what-we-value" hidden>
						<h3><?php esc_html_e( 'Craft, clarity, and maintainability.', '001_nolan_young_theme_nolan_designs' ); ?></h3>
						<p><?php esc_html_e( 'Good work should be understandable, durable, and easy to build on later.', '001_nolan_young_theme_nolan_designs' ); ?></p>
					</section>
					<section data-rail-content="how-we-work" hidden>
						<h3><?php esc_html_e( 'Small steps, visible progress.', '001_nolan_young_theme_nolan_designs' ); ?></h3>
						<p><?php esc_html_e( 'Discovery, design, development, and support stay connected through one plan.', '001_nolan_young_theme_nolan_designs' ); ?></p>
					</section>
				</div>
			</div>
		</div>
		<div class="site-panel site-panel--blog" id="blog-menu" data-menu-dropdown="blog" hidden>
			<div class="blog-grid">
				<?php foreach ( nolan_young_template_blog_posts() as $post ) : ?>
					<article class="blog-card">
						<p class="blog-card__tag"><?php echo esc_html( $post['tag'] ); ?></p>
						<h3><?php echo esc_html( $post['title'] ); ?></h3>
						<p><?php echo esc_html( $post['excerpt'] ); ?></p>
						<a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>"><?php esc_html_e( 'Read article', '001_nolan_young_theme_nolan_designs' ); ?></a>
					</article>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
	<div class="mobile-drawer" id="mobile-drawer" data-mobile-drawer hidden>
		<button class="mobile-drawer__close" type="button" data-mobile-close><?php esc_html_e( 'Close', '001_nolan_young_theme_nolan_designs' ); ?></button>
		<a class="btn btn-header-cta mobile-drawer__cta" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', '001_nolan_young_theme_nolan_designs' ); ?></a>
		<div class="mobile-drawer__section">
			<button type="button" data-accordion-trigger="mobile-services" aria-expanded="false"><?php esc_html_e( 'Services', '001_nolan_young_theme_nolan_designs' ); ?></button>
			<div data-accordion-panel="mobile-services" hidden>
				<?php foreach ( nolan_young_template_services() as $key => $service ) : ?>
					<a href="<?php echo esc_url( home_url( '/services/' ) ); ?>"><?php echo esc_html( $service['title'] ); ?></a>
				<?php endforeach; ?>
			</div>
		</div>
		<div class="mobile-drawer__section">
			<button type="button" data-accordion-trigger="mobile-about" aria-expanded="false"><?php esc_html_e( 'About', '001_nolan_young_theme_nolan_designs' ); ?></button>
			<div data-accordion-panel="mobile-about" hidden>
				<a href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'Our Approach', '001_nolan_young_theme_nolan_designs' ); ?></a>
			</div>
		</div>
		<div class="mobile-drawer__section">
			<button type="button" data-accordion-trigger="mobile-blog" aria-expanded="false"><?php esc_html_e( 'Blog', '001_nolan_young_theme_nolan_designs' ); ?></button>
			<div data-accordion-panel="mobile-blog" hidden>
				<a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>"><?php esc_html_e( 'Blog Archive', '001_nolan_young_theme_nolan_designs' ); ?></a>
			</div>
		</div>
		<a href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Work', '001_nolan_young_theme_nolan_designs' ); ?></a>
	</div>
</header>
