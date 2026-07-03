<?php
/**
 * Shared Stackforge Commerce Labs data and rendering helpers.
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
		'wordpress-design'          => array(
			'title'   => __( 'WordPress Design', 'nolan-young-template' ),
			'url'     => nolan_young_template_page_url( 'services/wordpress-design' ),
			'image'   => 'assets/images/portfolio/service-design.svg',
			'excerpt' => __( 'Editorial page systems, clear hierarchy, and flexible components that make publishing easier for your team.', 'nolan-young-template' ),
			'bullets' => array( __( 'Homepage and landing page systems', 'nolan-young-template' ), __( 'Content-led layouts', 'nolan-young-template' ), __( 'Reusable blocks and patterns', 'nolan-young-template' ) ),
		),
		'custom-theme-development' => array(
			'title'   => __( 'Custom Theme Development', 'nolan-young-template' ),
			'url'     => nolan_young_template_page_url( 'services/custom-theme-development' ),
			'image'   => 'assets/images/portfolio/service-development.svg',
			'excerpt' => __( 'Lean WordPress builds with maintained source, compiled assets, and a structure that is practical to extend later.', 'nolan-young-template' ),
			'bullets' => array( __( 'Theme architecture and templates', 'nolan-young-template' ), __( 'Accessible UI patterns', 'nolan-young-template' ), __( 'Performance-conscious builds', 'nolan-young-template' ) ),
		),
		'woocommerce'               => array(
			'title'   => __( 'WooCommerce', 'nolan-young-template' ),
			'url'     => nolan_young_template_page_url( 'services/woocommerce' ),
			'image'   => 'assets/images/hero/platform-command-center.png',
			'excerpt' => __( 'Commerce foundations for catalogs, merchandising, checkout clarity, and better paths to purchase.', 'nolan-young-template' ),
			'bullets' => array( __( 'Product and category structure', 'nolan-young-template' ), __( 'Cart and checkout improvements', 'nolan-young-template' ), __( 'Merchandising support', 'nolan-young-template' ) ),
		),
		'website-redesign'          => array(
			'title'   => __( 'Website Redesign', 'nolan-young-template' ),
			'url'     => nolan_young_template_page_url( 'services/website-redesign' ),
			'image'   => 'assets/images/portfolio/service-strategy.svg',
			'excerpt' => __( 'A careful restructure of content, presentation, and conversion flow for sites that need a clearer story.', 'nolan-young-template' ),
			'bullets' => array( __( 'Content audit and prioritization', 'nolan-young-template' ), __( 'Navigation and IA changes', 'nolan-young-template' ), __( 'Conversion path refinement', 'nolan-young-template' ) ),
		),
		'integrations-automation'   => array(
			'title'   => __( 'Integrations & Automation', 'nolan-young-template' ),
			'url'     => nolan_young_template_page_url( 'services/integrations-automation' ),
			'image'   => 'assets/images/portfolio/service-integration.svg',
			'excerpt' => __( 'Practical connections between forms, analytics, CRMs, fulfillment tools, and internal workflows.', 'nolan-young-template' ),
			'bullets' => array( __( 'Admin workflow support', 'nolan-young-template' ), __( 'Event and analytics plumbing', 'nolan-young-template' ), __( 'Operational handoff notes', 'nolan-young-template' ) ),
		),
		'website-care-support'      => array(
			'title'   => __( 'Website Care & Support', 'nolan-young-template' ),
			'url'     => nolan_young_template_page_url( 'services/website-care-support' ),
			'image'   => 'assets/images/portfolio/service-support.svg',
			'excerpt' => __( 'Retainers, fixes, small improvements, and steady maintenance that keeps the site useful after launch.', 'nolan-young-template' ),
			'bullets' => array( __( 'Content updates and QA', 'nolan-young-template' ), __( 'Bug triage and fixes', 'nolan-young-template' ), __( 'Maintenance planning', 'nolan-young-template' ) ),
		),
		'optimization-results'      => array(
			'title'   => __( 'Optimization & Results', 'nolan-young-template' ),
			'url'     => nolan_young_template_page_url( 'services/optimization-results' ),
			'image'   => 'assets/images/portfolio/service-results.svg',
			'excerpt' => __( 'Improve speed, clarity, accessibility, and conversions using practical changes backed by the data you already have.', 'nolan-young-template' ),
			'bullets' => array( __( 'Core Web Vitals improvements', 'nolan-young-template' ), __( 'CTA and page flow tuning', 'nolan-young-template' ), __( 'Measurement-ready updates', 'nolan-young-template' ) ),
		),
	);
}

function nolan_young_template_articles() {
	return array(
		array( 'tag' => __( 'Strategy', 'nolan-young-template' ), 'title' => __( 'What should a service website brief include?', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'blog/service-website-brief' ), 'image' => 'assets/images/portfolio/article-brief.svg', 'excerpt' => __( 'A practical brief keeps project scope, content decisions, and launch priorities aligned from day one.', 'nolan-young-template' ) ),
		array( 'tag' => __( 'Development', 'nolan-young-template' ), 'title' => __( 'How to keep a WordPress build maintainable', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'blog/maintainable-wordpress-builds' ), 'image' => 'assets/images/portfolio/article-structure.svg', 'excerpt' => __( 'Reusable parts, sensible naming, and separated source files keep future work predictable.', 'nolan-young-template' ) ),
		array( 'tag' => __( 'Launch', 'nolan-young-template' ), 'title' => __( 'A launch checklist for ecommerce and service sites', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'blog/launch-checklist' ), 'image' => 'assets/images/portfolio/article-launch.svg', 'excerpt' => __( 'Before going live, review forms, redirects, search, analytics, and key mobile flows.', 'nolan-young-template' ) ),
		array( 'tag' => __( 'Support', 'nolan-young-template' ), 'title' => __( 'What to review after the first month online', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'blog/first-month-review' ), 'image' => 'assets/images/portfolio/article-review.svg', 'excerpt' => __( 'Early post-launch observations can shape the next round of improvements without guesswork.', 'nolan-young-template' ) ),
	);
}

function nolan_young_template_work_items() {
	return array(
		array( 'category' => 'Strategy', 'title' => __( 'Commerce Roadmap', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'work/commerce-roadmap' ), 'image' => 'assets/images/portfolio/work-roadmap.svg', 'excerpt' => __( 'Reframed priorities, page structure, and CTA paths for a clearer service and commerce story.', 'nolan-young-template' ) ),
		array( 'category' => 'Design', 'title' => __( 'Editorial Redesign', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'work/editorial-redesign' ), 'image' => 'assets/images/portfolio/work-redesign.svg', 'excerpt' => __( 'A calmer visual language with better scanning, stronger hierarchy, and reusable modules.', 'nolan-young-template' ) ),
		array( 'category' => 'Development', 'title' => __( 'Custom Theme System', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'work/custom-theme-system' ), 'image' => 'assets/images/portfolio/work-theme.svg', 'excerpt' => __( 'A modular build with maintained source, production bundles, and practical component reuse.', 'nolan-young-template' ) ),
		array( 'category' => 'Integration', 'title' => __( 'Inquiry Workflow', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'work/inquiry-workflow' ), 'image' => 'assets/images/portfolio/work-inquiry.svg', 'excerpt' => __( 'Private form storage, exportable submissions, and a cleaner admin review process.', 'nolan-young-template' ) ),
		array( 'category' => 'Support', 'title' => __( 'Care Retainer', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'work/care-retainer' ), 'image' => 'assets/images/portfolio/work-care.svg', 'excerpt' => __( 'A lightweight support model for updates, fixes, and periodic improvements after launch.', 'nolan-young-template' ) ),
		array( 'category' => 'Results', 'title' => __( 'Conversion Refresh', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'work/conversion-refresh' ), 'image' => 'assets/images/portfolio/work-results.svg', 'excerpt' => __( 'Smarter structure and CTA treatment to make important actions more visible and usable.', 'nolan-young-template' ) ),
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
	<span class="brand-mark" aria-hidden="true"><?php echo file_get_contents( get_theme_file_path( 'assets/icons/platform-mark.svg' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
	<span class="site-branding__text">
		<span class="site-branding__name"><?php esc_html_e( 'Stackforge Commerce Labs', 'nolan-young-template' ); ?></span>
		<span class="site-branding__tagline"><?php esc_html_e( 'Custom WordPress, Shopify, and automation builds.', 'nolan-young-template' ); ?></span>
	</span>
	<?php
}

function nolan_young_template_render_contact_form( $form_type = 'contact', $service = '' ) {
	?>
	<form class="stackforge-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" novalidate data-enhanced-form>
		<input type="hidden" name="action" value="nolan_young_template_submit_form">
		<input type="hidden" name="form_type" value="<?php echo esc_attr( $form_type ); ?>">
		<input type="hidden" name="service" value="<?php echo esc_attr( $service ); ?>">
		<?php wp_nonce_field( 'nolan_young_template_form', 'nolan_young_template_form_nonce' ); ?>
		<p class="form-honeypot" aria-hidden="true"><label><?php esc_html_e( 'Leave this field empty', 'nolan-young-template' ); ?><input type="text" name="company_url" tabindex="-1" autocomplete="off"></label></p>
		<label><?php esc_html_e( 'Name', 'nolan-young-template' ); ?><input required name="name" type="text" autocomplete="name"></label>
		<label><?php esc_html_e( 'Email', 'nolan-young-template' ); ?><input required name="email" type="email" autocomplete="email"></label>
		<label><?php esc_html_e( 'Phone', 'nolan-young-template' ); ?><input name="phone" type="tel" autocomplete="tel"></label>
		<label><?php esc_html_e( 'Message', 'nolan-young-template' ); ?><textarea required name="message" rows="6"></textarea></label>
		<p class="form-note"><?php esc_html_e( 'Your inquiry is stored privately and sent to the configured administrator email.', 'nolan-young-template' ); ?></p>
		<button class="btn btn-primary" type="submit"><?php esc_html_e( 'Send inquiry', 'nolan-young-template' ); ?></button>
	</form>
	<?php
}

function nolan_young_template_render_newsletter_form() {
	?>
	<form class="newsletter-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" data-enhanced-form>
		<input type="hidden" name="action" value="nolan_young_template_newsletter_signup">
		<?php wp_nonce_field( 'nolan_young_template_newsletter', 'nolan_young_template_newsletter_nonce' ); ?>
		<p class="form-honeypot" aria-hidden="true"><label><?php esc_html_e( 'Leave this field empty', 'nolan-young-template' ); ?><input type="text" name="website" tabindex="-1" autocomplete="off"></label></p>
		<label><?php esc_html_e( 'First name', 'nolan-young-template' ); ?><input name="first_name" type="text" autocomplete="given-name"></label>
		<label><?php esc_html_e( 'Email address', 'nolan-young-template' ); ?><input required name="email" type="email" autocomplete="email"></label>
		<button class="btn btn-secondary" type="submit"><?php esc_html_e( 'Subscribe', 'nolan-young-template' ); ?></button>
	</form>
	<?php
}
