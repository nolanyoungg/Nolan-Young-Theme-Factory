<?php
/**
 * Shared Circuit Commerce Studio data and rendering helpers.
 *
 * @package Nolan_Young_Theme
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
		'wordpress-design'       => array(
			'title'   => __( 'WordPress Design', 'nolan-young-theme-circuit-commerce-studio' ),
			'url'     => nolan_young_template_page_url( 'services/wordpress-design' ),
			'image'   => 'assets/images/hero/automation-architecture.svg',
			'excerpt' => __( 'Editorial page systems, conversion-aware layouts, and a sharper visual hierarchy for service brands.', 'nolan-young-theme-circuit-commerce-studio' ),
			'bullets' => array( __( 'Information architecture', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Wireframes and content rhythm', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Editorial hero systems', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Accessible interaction states', 'nolan-young-theme-circuit-commerce-studio' ) ),
		),
		'custom-theme-development' => array(
			'title'   => __( 'Custom Theme Development', 'nolan-young-theme-circuit-commerce-studio' ),
			'url'     => nolan_young_template_page_url( 'services/custom-theme-development' ),
			'image'   => 'assets/images/portfolio/service-development.svg',
			'excerpt' => __( 'Maintainable WordPress builds that separate source, template parts, and compiled assets cleanly.', 'nolan-young-theme-circuit-commerce-studio' ),
			'bullets' => array( __( 'Template parts', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Build tooling', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Responsive sections', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Editor support', 'nolan-young-theme-circuit-commerce-studio' ) ),
		),
		'woocommerce'            => array(
			'title'   => __( 'WooCommerce', 'nolan-young-theme-circuit-commerce-studio' ),
			'url'     => nolan_young_template_page_url( 'services/woocommerce' ),
			'image'   => 'assets/images/portfolio/commerce-migration-dashboard.png',
			'excerpt' => __( 'Storefront structure, product discovery, cart flows, and commerce-focused page composition.', 'nolan-young-theme-circuit-commerce-studio' ),
			'bullets' => array( __( 'Product journeys', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Cart and checkout support', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Merchandising hierarchy', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Conversion review', 'nolan-young-theme-circuit-commerce-studio' ) ),
		),
		'website-redesign'        => array(
			'title'   => __( 'Website Redesign', 'nolan-young-theme-circuit-commerce-studio' ),
			'url'     => nolan_young_template_page_url( 'services/website-redesign' ),
			'image'   => 'assets/images/portfolio/wordpress-performance-map.png',
			'excerpt' => __( 'Reframe a dated site into a clearer story with sharper proof, navigation, and page flow.', 'nolan-young-theme-circuit-commerce-studio' ),
			'bullets' => array( __( 'Structure review', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Messaging cleanup', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Page-by-page refresh', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Launch sequencing', 'nolan-young-theme-circuit-commerce-studio' ) ),
		),
		'integrations-automation' => array(
			'title'   => __( 'Integrations & Automation', 'nolan-young-theme-circuit-commerce-studio' ),
			'url'     => nolan_young_template_page_url( 'services/integrations-automation' ),
			'image'   => 'assets/images/hero/automation-architecture.svg',
			'excerpt' => __( 'Connect forms, analytics, and internal workflows so the site supports real operations.', 'nolan-young-theme-circuit-commerce-studio' ),
			'bullets' => array( __( 'Form routing', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Analytics instrumentation', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Admin workflows', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Automation guardrails', 'nolan-young-theme-circuit-commerce-studio' ) ),
		),
		'website-care-support'   => array(
			'title'   => __( 'Website Care & Support', 'nolan-young-theme-circuit-commerce-studio' ),
			'url'     => nolan_young_template_page_url( 'services/website-care-support' ),
			'image'   => 'assets/images/portfolio/service-support.svg',
			'excerpt' => __( 'Retained updates, maintenance, and improvement cycles that keep the site dependable.', 'nolan-young-theme-circuit-commerce-studio' ),
			'bullets' => array( __( 'Fix and triage', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Content updates', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Release support', 'nolan-young-theme-circuit-commerce-studio' ), __( 'Ongoing recommendations', 'nolan-young-theme-circuit-commerce-studio' ) ),
		),
	);
}

function nolan_young_template_articles() {
	return array(
		array( 'tag' => __( 'Strategy', 'nolan-young-theme-circuit-commerce-studio' ), 'title' => __( 'What a useful commerce brief should include', 'nolan-young-theme-circuit-commerce-studio' ), 'url' => nolan_young_template_page_url( 'blog/commerce-brief-guide' ), 'image' => 'assets/images/portfolio/article-brief.svg', 'excerpt' => __( 'Goals, audience, pages, integrations, and launch decisions that keep a build on track.', 'nolan-young-theme-circuit-commerce-studio' ) ),
		array( 'tag' => __( 'Design', 'nolan-young-theme-circuit-commerce-studio' ), 'title' => __( 'Structuring a homepage that earns the next click', 'nolan-young-theme-circuit-commerce-studio' ), 'url' => nolan_young_template_page_url( 'blog/homepage-structure' ), 'image' => 'assets/images/portfolio/article-structure.svg', 'excerpt' => __( 'How editorial rhythm and service hierarchy can guide visitors without pressure.', 'nolan-young-theme-circuit-commerce-studio' ) ),
		array( 'tag' => __( 'Development', 'nolan-young-theme-circuit-commerce-studio' ), 'title' => __( 'A practical launch checklist for WordPress and Shopify', 'nolan-young-theme-circuit-commerce-studio' ), 'url' => nolan_young_template_page_url( 'blog/launch-checklist' ), 'image' => 'assets/images/portfolio/article-launch.svg', 'excerpt' => __( 'Content, redirects, forms, performance, and QA checks to review before release.', 'nolan-young-theme-circuit-commerce-studio' ) ),
		array( 'tag' => __( 'Results', 'nolan-young-theme-circuit-commerce-studio' ), 'title' => __( 'What to review after the first month online', 'nolan-young-theme-circuit-commerce-studio' ), 'url' => nolan_young_template_page_url( 'blog/first-month-review' ), 'image' => 'assets/images/portfolio/article-review.svg', 'excerpt' => __( 'Early signals that help teams improve content, calls to action, and support workflows.', 'nolan-young-theme-circuit-commerce-studio' ) ),
	);
}

function nolan_young_template_work_items() {
	return array(
		array( 'category' => 'Strategy', 'title' => __( 'Service Website Roadmap', 'nolan-young-theme-circuit-commerce-studio' ), 'url' => nolan_young_template_page_url( 'work/service-website-roadmap' ), 'image' => 'assets/images/portfolio/work-roadmap.svg', 'excerpt' => __( 'A reorganized site plan that clarified service pages, lead paths, and editorial priorities.', 'nolan-young-theme-circuit-commerce-studio' ) ),
		array( 'category' => 'Design', 'title' => __( 'Professional Services Redesign', 'nolan-young-theme-circuit-commerce-studio' ), 'url' => nolan_young_template_page_url( 'work/professional-services-redesign' ), 'image' => 'assets/images/portfolio/work-redesign.svg', 'excerpt' => __( 'A modern visual system with calmer navigation, stronger page hierarchy, and reusable sections.', 'nolan-young-theme-circuit-commerce-studio' ) ),
		array( 'category' => 'Development', 'title' => __( 'Custom WordPress Theme', 'nolan-young-theme-circuit-commerce-studio' ), 'url' => nolan_young_template_page_url( 'work/custom-wordpress-theme' ), 'image' => 'assets/images/portfolio/work-theme.svg', 'excerpt' => __( 'A maintainable theme build using modular PHP, SCSS source files, and compiled production bundles.', 'nolan-young-theme-circuit-commerce-studio' ) ),
		array( 'category' => 'Integration', 'title' => __( 'Inquiry Workflow Upgrade', 'nolan-young-theme-circuit-commerce-studio' ), 'url' => nolan_young_template_page_url( 'work/inquiry-workflow-upgrade' ), 'image' => 'assets/images/portfolio/work-inquiry.svg', 'excerpt' => __( 'Structured forms and admin views that made new website inquiries easier to review and export.', 'nolan-young-theme-circuit-commerce-studio' ) ),
		array( 'category' => 'Support', 'title' => __( 'Content Care System', 'nolan-young-theme-circuit-commerce-studio' ), 'url' => nolan_young_template_page_url( 'work/content-care-system' ), 'image' => 'assets/images/portfolio/work-care.svg', 'excerpt' => __( 'A support workflow for keeping content accurate, pages current, and small improvements moving.', 'nolan-young-theme-circuit-commerce-studio' ) ),
		array( 'category' => 'Results', 'title' => __( 'Conversion Path Refresh', 'nolan-young-theme-circuit-commerce-studio' ), 'url' => nolan_young_template_page_url( 'work/conversion-path-refresh' ), 'image' => 'assets/images/portfolio/work-results.svg', 'excerpt' => __( 'Navigation and CTA updates that made important actions clearer without overstating outcomes.', 'nolan-young-theme-circuit-commerce-studio' ) ),
	);
}

function nolan_young_template_render_image( $path, $alt = '', $class = '' ) {
	$loading = in_array( $class, array( 'hero', 'media-frame' ), true ) ? 'eager' : 'lazy';
	printf(
		'<img src="%1$s" alt="%2$s" class="%3$s" loading="%4$s" decoding="async">',
		nolan_young_template_asset_uri( $path ),
		esc_attr( $alt ),
		esc_attr( $class ),
		esc_attr( $loading )
	);
}

function nolan_young_template_render_logo() {
	?>
	<span class="brand-mark" aria-hidden="true"><?php echo file_get_contents( get_theme_file_path( 'assets/icons/icon1.svg' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
	<span class="site-branding__text">
		<span class="site-branding__name"><?php esc_html_e( 'Circuit Commerce Studio', 'nolan-young-theme-circuit-commerce-studio' ); ?></span>
		<span class="site-branding__tagline"><?php esc_html_e( 'WordPress and Shopify systems for teams that ship, sell, and scale.', 'nolan-young-theme-circuit-commerce-studio' ); ?></span>
	</span>
	<?php
}

function nolan_young_template_render_contact_form( $form_type = 'contact', $service = '' ) {
	$action = esc_url( admin_url( 'admin-post.php' ) );
	?>
	<form class="northstar-form" method="post" action="<?php echo $action; ?>" novalidate data-enhanced-form>
		<input type="hidden" name="action" value="nolan_young_template_submit_form">
		<input type="hidden" name="form_type" value="<?php echo esc_attr( $form_type ); ?>">
		<input type="hidden" name="service" value="<?php echo esc_attr( $service ); ?>">
		<?php wp_nonce_field( 'nolan_young_template_form', 'nolan_young_template_form_nonce' ); ?>
		<div class="form-honeypot" aria-hidden="true"><label><?php esc_html_e( 'Leave this field empty', 'nolan-young-theme-circuit-commerce-studio' ); ?> <input type="text" name="company_url" tabindex="-1" autocomplete="off"></label></div>
		<label><?php esc_html_e( 'Name', 'nolan-young-theme-circuit-commerce-studio' ); ?><input required name="name" type="text" autocomplete="name"></label>
		<label><?php esc_html_e( 'Email', 'nolan-young-theme-circuit-commerce-studio' ); ?><input required name="email" type="email" autocomplete="email"></label>
		<label><?php esc_html_e( 'Phone', 'nolan-young-theme-circuit-commerce-studio' ); ?><input name="phone" type="tel" autocomplete="tel"></label>
		<label><?php esc_html_e( 'Message', 'nolan-young-theme-circuit-commerce-studio' ); ?><textarea required name="message" rows="5"></textarea></label>
		<p class="form-note"><?php esc_html_e( 'Required fields are checked before submission. Your inquiry is stored privately for authorized site administrators.', 'nolan-young-theme-circuit-commerce-studio' ); ?></p>
		<button class="btn btn-primary" type="submit"><?php esc_html_e( 'Send inquiry', 'nolan-young-theme-circuit-commerce-studio' ); ?></button>
	</form>
	<?php
}

function nolan_young_template_render_newsletter_form() {
	?>
	<form class="newsletter-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" data-enhanced-form>
		<input type="hidden" name="action" value="nolan_young_template_newsletter_signup">
		<?php wp_nonce_field( 'nolan_young_template_newsletter', 'nolan_young_template_newsletter_nonce' ); ?>
		<div class="form-honeypot" aria-hidden="true"><label><?php esc_html_e( 'Leave this empty', 'nolan-young-theme-circuit-commerce-studio' ); ?> <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
		<label><?php esc_html_e( 'First name', 'nolan-young-theme-circuit-commerce-studio' ); ?><input name="first_name" type="text" autocomplete="given-name"></label>
		<label><?php esc_html_e( 'Email address', 'nolan-young-theme-circuit-commerce-studio' ); ?><input required name="email" type="email" autocomplete="email"></label>
		<button class="btn btn-secondary" type="submit"><?php esc_html_e( 'Subscribe', 'nolan-young-theme-circuit-commerce-studio' ); ?></button>
	</form>
	<?php
}
