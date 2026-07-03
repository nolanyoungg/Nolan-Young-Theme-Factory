<?php
/**
 * Shared Brightlane Commerce Engineering data and rendering helpers.
 *
 * @package Nolan_Young_Template
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_young_template_page_url( $slug ) {
	return esc_url( home_url( '/' . trim( $slug, '/' ) . '/' ) );
}

function nolan_young_template_asset_uri( $path ) {
	return esc_url( get_theme_file_uri( ltrim( $path, '/' ) ) );
}

function nolan_young_template_services() {
	return array(
		'wordpress-design'    => array(
			'title'   => __( 'WordPress Design', '004-nolan-young-theme-brightlane-commerce-engineering' ),
			'url'     => nolan_young_template_page_url( 'services/wordpress-design' ),
			'image'   => 'assets/images/hero/agency-workspace.jpg',
			'excerpt' => __( 'Conversion-focused WordPress page systems for service brands, growth teams, and commerce-adjacent content programs.', '004-nolan-young-theme-brightlane-commerce-engineering' ),
			'bullets' => array( __( 'Homepage and landing-page systems', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Reusable editorial sections', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Accessible mobile-first layouts', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Content hierarchy for clear decisions', '004-nolan-young-theme-brightlane-commerce-engineering' ) ),
		),
		'theme-development'   => array(
			'title'   => __( 'Custom Theme Development', '004-nolan-young-theme-brightlane-commerce-engineering' ),
			'url'     => nolan_young_template_page_url( 'services/custom-theme-development' ),
			'image'   => 'assets/images/hero/developer-screens.jpg',
			'excerpt' => __( 'Senior WordPress engineering for custom themes, template systems, build tooling, and maintainable front-end behavior.', '004-nolan-young-theme-brightlane-commerce-engineering' ),
			'bullets' => array( __( 'Modular PHP template parts', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'SCSS and JavaScript build systems', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Performance-minded asset loading', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Editor settings and theme support', '004-nolan-young-theme-brightlane-commerce-engineering' ) ),
		),
		'woocommerce'         => array(
			'title'   => __( 'WooCommerce', '004-nolan-young-theme-brightlane-commerce-engineering' ),
			'url'     => nolan_young_template_page_url( 'services/woocommerce-shopify-migration' ),
			'image'   => 'assets/images/portfolio/ecommerce-planning.jpg',
			'excerpt' => __( 'Commerce planning for WooCommerce builds, Shopify migrations, product-content structure, checkout paths, and operational handoff.', '004-nolan-young-theme-brightlane-commerce-engineering' ),
			'bullets' => array( __( 'WooCommerce and Shopify planning', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Catalog and product-content models', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Migration risk review', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Checkout and inquiry path guidance', '004-nolan-young-theme-brightlane-commerce-engineering' ) ),
		),
		'redesign'            => array(
			'title'   => __( 'Website Redesign', '004-nolan-young-theme-brightlane-commerce-engineering' ),
			'url'     => nolan_young_template_page_url( 'services/website-redesign' ),
			'image'   => 'assets/images/portfolio/performance-review.jpg',
			'excerpt' => __( 'Redesign existing WordPress or Shopify experiences around clearer navigation, faster paths to purchase or inquiry, and cleaner maintenance.', '004-nolan-young-theme-brightlane-commerce-engineering' ),
			'bullets' => array( __( 'Homepage conversion systems', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Navigation and service architecture', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Accessibility and performance repair', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Launch-ready content priorities', '004-nolan-young-theme-brightlane-commerce-engineering' ) ),
		),
		'integrations'        => array(
			'title'   => __( 'Integrations & Automation', '004-nolan-young-theme-brightlane-commerce-engineering' ),
			'url'     => nolan_young_template_page_url( 'services/integrations-automation' ),
			'image'   => 'assets/images/hero/developer-screens.jpg',
			'excerpt' => __( 'Connect analytics, CRM, email, forms, ecommerce data, and platform workflows without turning the site into an opaque plugin stack.', '004-nolan-young-theme-brightlane-commerce-engineering' ),
			'bullets' => array( __( 'Analytics instrumentation', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'CRM and email routing', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Form and lead workflow design', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Operational handoff documentation', '004-nolan-young-theme-brightlane-commerce-engineering' ) ),
		),
		'care-support'        => array(
			'title'   => __( 'Website Care & Support', '004-nolan-young-theme-brightlane-commerce-engineering' ),
			'url'     => nolan_young_template_page_url( 'services/website-care-support' ),
			'image'   => 'assets/images/portfolio/team-collaboration.jpg',
			'excerpt' => __( 'Retained launch-support sprints, performance triage, accessibility improvements, content updates, and prioritized improvement planning.', '004-nolan-young-theme-brightlane-commerce-engineering' ),
			'bullets' => array( __( 'Launch support sprints', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Performance and accessibility review', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Issue triage and QA notes', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Roadmaps for ongoing improvements', '004-nolan-young-theme-brightlane-commerce-engineering' ) ),
		),
	);
}

function nolan_young_template_articles() {
	return array(
		array( 'tag' => __( 'Commerce', '004-nolan-young-theme-brightlane-commerce-engineering' ), 'title' => __( 'Planning a WooCommerce to Shopify decision without guesswork', '004-nolan-young-theme-brightlane-commerce-engineering' ), 'url' => nolan_young_template_page_url( 'blog/woocommerce-shopify-planning' ), 'image' => 'assets/images/portfolio/ecommerce-planning.jpg', 'excerpt' => __( 'A practical way to compare platform fit, migration risk, catalog needs, and post-launch operations.', '004-nolan-young-theme-brightlane-commerce-engineering' ) ),
		array( 'tag' => __( 'WordPress', '004-nolan-young-theme-brightlane-commerce-engineering' ), 'title' => __( 'What custom WordPress theme engineering should make easier', '004-nolan-young-theme-brightlane-commerce-engineering' ), 'url' => nolan_young_template_page_url( 'blog/custom-wordpress-engineering' ), 'image' => 'assets/images/hero/developer-screens.jpg', 'excerpt' => __( 'How templates, build tooling, editor support, and local assets keep a serious site maintainable.', '004-nolan-young-theme-brightlane-commerce-engineering' ) ),
		array( 'tag' => __( 'Performance', '004-nolan-young-theme-brightlane-commerce-engineering' ), 'title' => __( 'A focused performance repair sprint for busy growth teams', '004-nolan-young-theme-brightlane-commerce-engineering' ), 'url' => nolan_young_template_page_url( 'blog/performance-repair-sprint' ), 'image' => 'assets/images/portfolio/performance-review.jpg', 'excerpt' => __( 'A sprint structure for auditing slow pages, heavy assets, tracking scripts, and fragile conversion paths.', '004-nolan-young-theme-brightlane-commerce-engineering' ) ),
		array( 'tag' => __( 'Launch', '004-nolan-young-theme-brightlane-commerce-engineering' ), 'title' => __( 'How retained launch support keeps the site moving', '004-nolan-young-theme-brightlane-commerce-engineering' ), 'url' => nolan_young_template_page_url( 'blog/retained-launch-support' ), 'image' => 'assets/images/portfolio/team-collaboration.jpg', 'excerpt' => __( 'What to review after release, how to triage improvements, and where support sprints create momentum.', '004-nolan-young-theme-brightlane-commerce-engineering' ) ),
	);
}

function nolan_young_template_work_items() {
	return array(
		array( 'category' => 'Strategy', 'title' => __( 'Migration Readiness Roadmap', '004-nolan-young-theme-brightlane-commerce-engineering' ), 'url' => nolan_young_template_page_url( 'work/migration-readiness-roadmap' ), 'image' => 'assets/images/portfolio/ecommerce-planning.jpg', 'excerpt' => __( 'Platform planning that surfaced catalog structure, data concerns, integration needs, and launch sequencing.', '004-nolan-young-theme-brightlane-commerce-engineering' ) ),
		array( 'category' => 'Design', 'title' => __( 'Conversion Homepage System', '004-nolan-young-theme-brightlane-commerce-engineering' ), 'url' => nolan_young_template_page_url( 'work/conversion-homepage-system' ), 'image' => 'assets/images/hero/agency-workspace.jpg', 'excerpt' => __( 'A homepage architecture built around customer questions, proof, service depth, and a cleaner inquiry path.', '004-nolan-young-theme-brightlane-commerce-engineering' ) ),
		array( 'category' => 'Development', 'title' => __( 'Custom WordPress Commerce Theme', '004-nolan-young-theme-brightlane-commerce-engineering' ), 'url' => nolan_young_template_page_url( 'work/custom-wordpress-commerce-theme' ), 'image' => 'assets/images/hero/developer-screens.jpg', 'excerpt' => __( 'A maintainable theme build using modular PHP, SCSS source files, local media, and compiled production bundles.', '004-nolan-young-theme-brightlane-commerce-engineering' ) ),
		array( 'category' => 'Integration', 'title' => __( 'CRM and Analytics Workflow', '004-nolan-young-theme-brightlane-commerce-engineering' ), 'url' => nolan_young_template_page_url( 'work/crm-analytics-workflow' ), 'image' => 'assets/images/portfolio/performance-review.jpg', 'excerpt' => __( 'Lead forms, analytics events, and CRM-ready routing designed for cleaner post-launch reporting.', '004-nolan-young-theme-brightlane-commerce-engineering' ) ),
		array( 'category' => 'Support', 'title' => __( 'Launch Support Sprint', '004-nolan-young-theme-brightlane-commerce-engineering' ), 'url' => nolan_young_template_page_url( 'work/launch-support-sprint' ), 'image' => 'assets/images/portfolio/team-collaboration.jpg', 'excerpt' => __( 'A retained sprint for release triage, content updates, accessibility fixes, and performance follow-through.', '004-nolan-young-theme-brightlane-commerce-engineering' ) ),
		array( 'category' => 'Results', 'title' => __( 'Performance Review Dashboard', '004-nolan-young-theme-brightlane-commerce-engineering' ), 'url' => nolan_young_template_page_url( 'work/performance-review-dashboard' ), 'image' => 'assets/images/portfolio/performance-review.jpg', 'excerpt' => __( 'A prioritized performance and UX review that turned scattered issues into a clear improvement queue.', '004-nolan-young-theme-brightlane-commerce-engineering' ) ),
	);
}

function nolan_young_template_render_image( $path, $alt = '', $class = '' ) {
	printf(
		'<img src="%1$s" alt="%2$s" class="%3$s" loading="lazy" decoding="async">',
		nolan_young_template_asset_uri( $path ),
		esc_attr( $alt ),
		esc_attr( $class )
	);
}

function nolan_young_template_render_logo() {
	?>
	<span class="brand-mark" aria-hidden="true"><?php echo file_get_contents( get_theme_file_path( 'assets/icons/icon1.svg' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
	<span class="site-branding__text">
		<span class="site-branding__name"><?php esc_html_e( 'Brightlane Commerce Engineering', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></span>
		<span class="site-branding__tagline"><?php esc_html_e( 'WordPress and Shopify systems.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></span>
	</span>
	<?php
}

function nolan_young_template_render_contact_form( $form_type = 'contact', $service = '' ) {
	$action = esc_url( admin_url( 'admin-post.php' ) );
	?>
	<form class="brightlane-form" method="post" action="<?php echo $action; ?>" novalidate data-enhanced-form>
		<input type="hidden" name="action" value="nolan_young_template_submit_form">
		<input type="hidden" name="form_type" value="<?php echo esc_attr( $form_type ); ?>">
		<input type="hidden" name="service" value="<?php echo esc_attr( $service ); ?>">
		<?php wp_nonce_field( 'nolan_young_template_form', 'nolan_young_template_form_nonce' ); ?>
		<div class="form-honeypot" aria-hidden="true"><label>Leave this field empty <input type="text" name="company_url" tabindex="-1" autocomplete="off"></label></div>
		<label><?php esc_html_e( 'Name', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?><input required name="name" type="text" autocomplete="name"></label>
		<label><?php esc_html_e( 'Email', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?><input required name="email" type="email" autocomplete="email"></label>
		<label><?php esc_html_e( 'Phone', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?><input name="phone" type="tel" autocomplete="tel"></label>
		<label><?php esc_html_e( 'Message', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?><textarea required name="message" rows="5"></textarea></label>
		<p class="form-note"><?php esc_html_e( 'Required fields are checked before submission. Your inquiry is stored privately for authorized site administrators.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p>
		<button class="btn btn-primary" type="submit"><?php esc_html_e( 'Send inquiry', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></button>
	</form>
	<?php
}

function nolan_young_template_render_newsletter_form() {
	?>
	<form class="newsletter-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" data-enhanced-form>
		<input type="hidden" name="action" value="nolan_young_template_newsletter_signup">
		<?php wp_nonce_field( 'nolan_young_template_newsletter', 'nolan_young_template_newsletter_nonce' ); ?>
		<div class="form-honeypot" aria-hidden="true"><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
		<label><?php esc_html_e( 'First name', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?><input name="first_name" type="text" autocomplete="given-name"></label>
		<label><?php esc_html_e( 'Email address', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?><input required name="email" type="email" autocomplete="email"></label>
		<button class="btn btn-secondary" type="submit"><?php esc_html_e( 'Subscribe', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></button>
	</form>
	<?php
}
