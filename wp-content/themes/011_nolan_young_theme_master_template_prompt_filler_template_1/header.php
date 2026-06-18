<?php
/**
 * Header.
 *
 * @package Nolan_Young_Template
 */

$services = nolan_young_template_services();
$articles = nolan_young_template_articles();
$about_items = array(
	'approach' => array(
		'label' => __( 'Approach', 'nolan-young-template' ),
		'title' => __( 'A practical web partner for service businesses.', 'nolan-young-template' ),
		'image' => 'assets/images/hero/about-approach.svg',
		'features' => array( __( 'Discovery before design', 'nolan-young-template' ), __( 'Clear page architecture', 'nolan-young-template' ), __( 'Reusable WordPress patterns', 'nolan-young-template' ) ),
	),
	'values' => array(
		'label' => __( 'Values', 'nolan-young-template' ),
		'title' => __( 'Clarity, maintainability, and steady communication.', 'nolan-young-template' ),
		'image' => 'assets/images/hero/about-values.svg',
		'features' => array( __( 'Readable content', 'nolan-young-template' ), __( 'Accessible interactions', 'nolan-young-template' ), __( 'No unnecessary runtime clutter', 'nolan-young-template' ) ),
	),
	'team' => array(
		'label' => __( 'Working Style', 'nolan-young-template' ),
		'title' => __( 'Focused collaboration without inflated claims.', 'nolan-young-template' ),
		'image' => 'assets/images/hero/about-working-style.svg',
		'features' => array( __( 'Useful questions early', 'nolan-young-template' ), __( 'Documented decisions', 'nolan-young-template' ), __( 'Support after launch', 'nolan-young-template' ) ),
	),
);
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link screen-reader-text" href="#primary"><?php esc_html_e( 'Skip to content', 'nolan-young-template' ); ?></a>
<header class="site-header" data-site-header>
	<div class="site-header__inner">
		<a class="site-branding" href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home" aria-label="<?php esc_attr_e( 'Northstar Websites home', 'nolan-young-template' ); ?>">
			<span class="site-branding__mark" aria-hidden="true"><svg viewBox="0 0 48 48" focusable="false"><path d="M24 3l5.2 15.8L45 24l-15.8 5.2L24 45l-5.2-15.8L3 24l15.8-5.2L24 3z"/><circle cx="24" cy="24" r="5"/></svg></span>
			<span class="site-branding__text"><span class="site-branding__name"><?php esc_html_e( 'Northstar Websites', 'nolan-young-template' ); ?></span><span class="site-branding__tagline"><?php esc_html_e( 'Websites that help businesses grow.', 'nolan-young-template' ); ?></span></span>
		</a>
		<nav class="primary-navigation" aria-label="<?php esc_attr_e( 'Primary navigation', 'nolan-young-template' ); ?>">
			<button class="nav-trigger" type="button" data-menu-item="services" aria-controls="services-menu" aria-expanded="false"><?php esc_html_e( 'Services', 'nolan-young-template' ); ?></button>
			<button class="nav-trigger" type="button" data-menu-item="about" aria-controls="about-menu" aria-expanded="false"><?php esc_html_e( 'About', 'nolan-young-template' ); ?></button>
			<a class="nav-link" href="<?php echo nolan_young_template_page_url( 'work/' ); ?>"><?php esc_html_e( 'Work', 'nolan-young-template' ); ?></a>
			<button class="nav-trigger" type="button" data-menu-item="blog" aria-controls="blog-menu" aria-expanded="false"><?php esc_html_e( 'Blog', 'nolan-young-template' ); ?></button>
		</nav>
		<a class="btn btn-header-cta" href="<?php echo nolan_young_template_page_url( 'contact/' ); ?>"><?php esc_html_e( 'Contact Us', 'nolan-young-template' ); ?></a>
		<button class="mobile-menu-toggle" type="button" data-mobile-menu-open aria-controls="mobile-drawer" aria-expanded="false"><span class="screen-reader-text"><?php esc_html_e( 'Open menu', 'nolan-young-template' ); ?></span><span aria-hidden="true"></span></button>
	</div>
	<div class="nolan-menu-backdrop" data-menu-backdrop hidden></div>
	<div class="nolan-menu-shell" data-menu-shell>
		<div class="nolan-menu" id="services-menu" data-menu-dropdown="services" hidden>
			<div class="nolan-menu__rail" aria-label="<?php esc_attr_e( 'Service categories', 'nolan-young-template' ); ?>">
				<?php foreach ( $services as $index => $service ) : ?>
					<button type="button" data-rail-item="<?php echo esc_attr( $service['key'] ); ?>" class="<?php echo 0 === $index ? 'is-active' : ''; ?>"><?php echo esc_html( $service['title'] ); ?></button>
				<?php endforeach; ?>
			</div>
			<div class="nolan-menu__content">
				<?php foreach ( $services as $index => $service ) : ?>
					<section data-rail-content="<?php echo esc_attr( $service['key'] ); ?>" <?php echo 0 === $index ? '' : 'hidden'; ?>>
						<div class="nolan-menu__image"><?php nolan_young_template_card_image( $service['image'], $service['title'] ); ?></div>
						<div><p class="eyebrow"><?php esc_html_e( 'Northstar service', 'nolan-young-template' ); ?></p><h2><?php echo esc_html( $service['title'] ); ?></h2><p><?php echo esc_html( $service['excerpt'] ); ?></p><ul><?php foreach ( $service['details'] as $detail ) : ?><li><?php echo esc_html( $detail ); ?></li><?php endforeach; ?></ul><a class="btn btn-text" href="<?php echo esc_url( $service['url'] ); ?>"><?php esc_html_e( 'See service details', 'nolan-young-template' ); ?></a></div>
					</section>
				<?php endforeach; ?>
			</div>
		</div>
		<div class="nolan-menu" id="about-menu" data-menu-dropdown="about" hidden>
			<div class="nolan-menu__rail" aria-label="<?php esc_attr_e( 'About Northstar Websites', 'nolan-young-template' ); ?>">
				<?php $i = 0; foreach ( $about_items as $key => $item ) : ?>
					<button type="button" data-rail-item="<?php echo esc_attr( $key ); ?>" class="<?php echo 0 === $i ? 'is-active' : ''; ?>"><?php echo esc_html( $item['label'] ); ?></button>
				<?php $i++; endforeach; ?>
			</div>
			<div class="nolan-menu__content">
				<?php $i = 0; foreach ( $about_items as $key => $item ) : ?>
					<section data-rail-content="<?php echo esc_attr( $key ); ?>" <?php echo 0 === $i ? '' : 'hidden'; ?>>
						<div class="nolan-menu__image"><?php nolan_young_template_card_image( $item['image'], $item['label'] ); ?></div>
						<div><p class="eyebrow"><?php echo esc_html( $item['label'] ); ?></p><h2><?php echo esc_html( $item['title'] ); ?></h2><ul><?php foreach ( $item['features'] as $feature ) : ?><li><?php echo esc_html( $feature ); ?></li><?php endforeach; ?></ul><a class="btn btn-secondary" href="<?php echo nolan_young_template_page_url( 'about/' ); ?>"><?php esc_html_e( 'Visit About page', 'nolan-young-template' ); ?></a></div>
					</section>
				<?php $i++; endforeach; ?>
			</div>
		</div>
		<div class="nolan-menu nolan-menu--blog" id="blog-menu" data-menu-dropdown="blog" hidden>
			<div class="blog-menu-grid">
				<?php foreach ( $articles as $article ) : ?>
					<article class="blog-card">
						<?php nolan_young_template_card_image( $article['image'], $article['title'] ); ?>
						<div><p class="eyebrow"><?php echo esc_html( $article['tag'] ); ?></p><h2><?php echo esc_html( $article['title'] ); ?></h2><p><?php echo esc_html( $article['excerpt'] ); ?></p><a class="btn btn-text" href="<?php echo esc_url( $article['url'] ); ?>"><?php esc_html_e( 'Read guide', 'nolan-young-template' ); ?></a></div>
					</article>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
</header>
<div class="mobile-drawer-backdrop" data-mobile-backdrop hidden></div>
<aside class="mobile-drawer" id="mobile-drawer" data-mobile-drawer aria-hidden="true" aria-label="<?php esc_attr_e( 'Mobile navigation', 'nolan-young-template' ); ?>">
	<div class="mobile-drawer__header">
		<strong><?php esc_html_e( 'Northstar Websites', 'nolan-young-template' ); ?></strong>
		<button type="button" class="mobile-drawer__close" data-mobile-menu-close><span class="screen-reader-text"><?php esc_html_e( 'Close menu', 'nolan-young-template' ); ?></span><span aria-hidden="true">×</span></button>
	</div>
	<nav class="mobile-nav" aria-label="<?php esc_attr_e( 'Mobile menu', 'nolan-young-template' ); ?>">
		<?php foreach ( array( 'Services' => $services ) as $label => $items ) : ?>
			<div class="mobile-accordion"><button type="button" class="mobile-accordion__trigger" aria-expanded="false"><?php echo esc_html( $label ); ?></button><div class="mobile-accordion__panel" hidden><?php foreach ( $items as $item ) : ?><a href="<?php echo esc_url( $item['url'] ); ?>"><?php echo esc_html( $item['title'] ); ?></a><?php endforeach; ?></div></div>
		<?php endforeach; ?>
		<div class="mobile-accordion"><button type="button" class="mobile-accordion__trigger" aria-expanded="false"><?php esc_html_e( 'About Us', 'nolan-young-template' ); ?></button><div class="mobile-accordion__panel" hidden><a href="<?php echo nolan_young_template_page_url( 'about/' ); ?>"><?php esc_html_e( 'Company approach', 'nolan-young-template' ); ?></a><a href="<?php echo nolan_young_template_page_url( 'about/#values' ); ?>"><?php esc_html_e( 'Values', 'nolan-young-template' ); ?></a><a href="<?php echo nolan_young_template_page_url( 'about/#working-style' ); ?>"><?php esc_html_e( 'Working style', 'nolan-young-template' ); ?></a></div></div>
		<a class="mobile-nav__link" href="<?php echo nolan_young_template_page_url( 'work/' ); ?>"><?php esc_html_e( 'Work', 'nolan-young-template' ); ?></a>
		<div class="mobile-accordion"><button type="button" class="mobile-accordion__trigger" aria-expanded="false"><?php esc_html_e( 'Blog', 'nolan-young-template' ); ?></button><div class="mobile-accordion__panel" hidden><?php foreach ( $articles as $article ) : ?><a href="<?php echo esc_url( $article['url'] ); ?>"><?php echo esc_html( $article['title'] ); ?></a><?php endforeach; ?><a href="<?php echo nolan_young_template_page_url( 'blog/' ); ?>"><?php esc_html_e( 'Blog archive', 'nolan-young-template' ); ?></a></div></div>
		<a class="btn btn-primary btn-full" href="<?php echo nolan_young_template_page_url( 'contact/' ); ?>"><?php esc_html_e( 'Contact Us', 'nolan-young-template' ); ?></a>
	</nav>
</aside>
