<?php
/**
 * Shared Northstar Websites data and rendering helpers.
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
		'strategy'    => array(
			'title'   => __( 'Website Strategy', 'nolan-young-template' ),
			'url'     => nolan_young_template_page_url( 'services/website-strategy' ),
			'image'   => 'assets/images/portfolio/service-strategy.svg',
			'excerpt' => __( 'A practical roadmap for content, structure, conversion paths, and launch priorities before design begins.', 'nolan-young-template' ),
			'bullets' => array( __( 'Discovery and goals', 'nolan-young-template' ), __( 'Sitemap and content model', 'nolan-young-template' ), __( 'Conversion path planning', 'nolan-young-template' ), __( 'Launch priorities', 'nolan-young-template' ) ),
		),
		'design'      => array(
			'title'   => __( 'Modern WordPress Design', 'nolan-young-template' ),
			'url'     => nolan_young_template_page_url( 'services/wordpress-design' ),
			'image'   => 'assets/images/portfolio/service-design.svg',
			'excerpt' => __( 'Content-forward page designs with responsive layouts, accessible patterns, and a flexible visual system.', 'nolan-young-template' ),
			'bullets' => array( __( 'Page design systems', 'nolan-young-template' ), __( 'Reusable sections', 'nolan-young-template' ), __( 'Mobile-first layouts', 'nolan-young-template' ), __( 'Editor-friendly styling', 'nolan-young-template' ) ),
		),
		'development' => array(
			'title'   => __( 'Custom Theme Build', 'nolan-young-template' ),
			'url'     => nolan_young_template_page_url( 'services/custom-theme-build' ),
			'image'   => 'assets/images/portfolio/service-development.svg',
			'excerpt' => __( 'Clean WordPress theme implementation with maintainable templates, local assets, and predictable build tooling.', 'nolan-young-template' ),
			'bullets' => array( __( 'Theme architecture', 'nolan-young-template' ), __( 'Template parts', 'nolan-young-template' ), __( 'Performance-minded assets', 'nolan-young-template' ), __( 'Quality checks', 'nolan-young-template' ) ),
		),
		'integration' => array(
			'title'   => __( 'Content and Tool Integration', 'nolan-young-template' ),
			'url'     => nolan_young_template_page_url( 'services/content-tool-integration' ),
			'image'   => 'assets/images/portfolio/service-integration.svg',
			'excerpt' => __( 'Connect forms, publishing workflows, analytics-ready events, and practical operational details without clutter.', 'nolan-young-template' ),
			'bullets' => array( __( 'Forms and routing', 'nolan-young-template' ), __( 'Content structures', 'nolan-young-template' ), __( 'Admin workflows', 'nolan-young-template' ), __( 'Launch configuration', 'nolan-young-template' ) ),
		),
		'support'     => array(
			'title'   => __( 'Care and Support', 'nolan-young-template' ),
			'url'     => nolan_young_template_page_url( 'services/care-support' ),
			'image'   => 'assets/images/portfolio/service-support.svg',
			'excerpt' => __( 'Post-launch improvements, troubleshooting, updates, and guidance that keep the site useful after launch.', 'nolan-young-template' ),
			'bullets' => array( __( 'Site health review', 'nolan-young-template' ), __( 'Content support', 'nolan-young-template' ), __( 'Issue triage', 'nolan-young-template' ), __( 'Improvement planning', 'nolan-young-template' ) ),
		),
		'results'     => array(
			'title'   => __( 'Optimization and Results', 'nolan-young-template' ),
			'url'     => nolan_young_template_page_url( 'services/optimization-results' ),
			'image'   => 'assets/images/portfolio/service-results.svg',
			'excerpt' => __( 'Refine navigation, calls to action, page speed, and content clarity based on business priorities.', 'nolan-young-template' ),
			'bullets' => array( __( 'Conversion review', 'nolan-young-template' ), __( 'Usability fixes', 'nolan-young-template' ), __( 'Content improvements', 'nolan-young-template' ), __( 'Maintenance roadmap', 'nolan-young-template' ) ),
		),
	);
}

function nolan_young_template_articles() {
	return array(
		array( 'tag' => __( 'Planning', 'nolan-young-template' ), 'title' => __( 'What a useful website brief should include', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'blog/website-brief-guide' ), 'image' => 'assets/images/portfolio/article-brief.svg', 'excerpt' => __( 'A concise guide to goals, audiences, content, and decisions that make a build move cleanly.', 'nolan-young-template' ) ),
		array( 'tag' => __( 'WordPress', 'nolan-young-template' ), 'title' => __( 'Choosing a WordPress structure that stays manageable', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'blog/wordpress-structure' ), 'image' => 'assets/images/portfolio/article-structure.svg', 'excerpt' => __( 'How templates, reusable parts, and editor settings can keep future publishing straightforward.', 'nolan-young-template' ) ),
		array( 'tag' => __( 'Launch', 'nolan-young-template' ), 'title' => __( 'A practical website launch checklist', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'blog/launch-checklist' ), 'image' => 'assets/images/portfolio/article-launch.svg', 'excerpt' => __( 'Content, redirects, forms, accessibility, and performance checks to review before a site goes live.', 'nolan-young-template' ) ),
		array( 'tag' => __( 'Support', 'nolan-young-template' ), 'title' => __( 'What to review after the first month online', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'blog/first-month-review' ), 'image' => 'assets/images/portfolio/article-review.svg', 'excerpt' => __( 'Early signals that help teams improve content, calls to action, and support workflows.', 'nolan-young-template' ) ),
	);
}

function nolan_young_template_work_items() {
	return array(
		array( 'category' => 'Strategy', 'title' => __( 'Service Website Roadmap', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'work/service-website-roadmap' ), 'image' => 'assets/images/portfolio/work-roadmap.svg', 'excerpt' => __( 'A reorganized site plan that clarified service pages, lead paths, and editorial priorities.', 'nolan-young-template' ) ),
		array( 'category' => 'Design', 'title' => __( 'Professional Services Redesign', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'work/professional-services-redesign' ), 'image' => 'assets/images/portfolio/work-redesign.svg', 'excerpt' => __( 'A modern visual system with calmer navigation, stronger page hierarchy, and reusable sections.', 'nolan-young-template' ) ),
		array( 'category' => 'Development', 'title' => __( 'Custom WordPress Theme', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'work/custom-wordpress-theme' ), 'image' => 'assets/images/portfolio/work-theme.svg', 'excerpt' => __( 'A maintainable theme build using modular PHP, SCSS source files, and compiled production bundles.', 'nolan-young-template' ) ),
		array( 'category' => 'Integration', 'title' => __( 'Inquiry Workflow Upgrade', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'work/inquiry-workflow-upgrade' ), 'image' => 'assets/images/portfolio/work-inquiry.svg', 'excerpt' => __( 'Structured forms and admin views that made new website inquiries easier to review and export.', 'nolan-young-template' ) ),
		array( 'category' => 'Support', 'title' => __( 'Content Care System', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'work/content-care-system' ), 'image' => 'assets/images/portfolio/work-care.svg', 'excerpt' => __( 'A support workflow for keeping content accurate, pages current, and small improvements moving.', 'nolan-young-template' ) ),
		array( 'category' => 'Results', 'title' => __( 'Conversion Path Refresh', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'work/conversion-path-refresh' ), 'image' => 'assets/images/portfolio/work-results.svg', 'excerpt' => __( 'Navigation and CTA updates that made important actions clearer without overstating outcomes.', 'nolan-young-template' ) ),
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
		<span class="site-branding__name"><?php esc_html_e( 'Northstar Codeworks', 'nolan-young-template' ); ?></span>
		<span class="site-branding__tagline"><?php esc_html_e( 'Websites that help businesses grow.', 'nolan-young-template' ); ?></span>
	</span>
	<?php
}

function nolan_young_template_render_contact_form( $form_type = 'contact', $service = '' ) {
	$action = esc_url( admin_url( 'admin-post.php' ) );
	$is_service_form = 'single-service' === $form_type;
	?>
	<form class="northstar-form" method="post" action="<?php echo $action; ?>" novalidate data-enhanced-form>
		<input type="hidden" name="action" value="nolan_young_template_submit_form">
		<input type="hidden" name="form_type" value="<?php echo esc_attr( $form_type ); ?>">
		<input type="hidden" name="service" value="<?php echo esc_attr( $service ); ?>">
		<?php wp_nonce_field( 'nolan_young_template_form', 'nolan_young_template_form_nonce' ); ?>
		<div class="form-honeypot" aria-hidden="true"><label>Leave this field empty <input type="text" name="company_url" tabindex="-1" autocomplete="off"></label></div>
		<label><?php esc_html_e( 'Name', 'nolan-young-template' ); ?><input required name="name" type="text" autocomplete="name"></label>
		<label><?php esc_html_e( 'Email', 'nolan-young-template' ); ?><input required name="email" type="email" autocomplete="email"></label>
		<label><?php esc_html_e( 'Phone', 'nolan-young-template' ); ?><input name="phone" type="tel" autocomplete="tel"></label>
		<label><?php esc_html_e( 'Company / Organization', 'nolan-young-template' ); ?><input name="company" type="text" autocomplete="organization"></label>
		<?php if ( $is_service_form ) : ?>
			<label><?php esc_html_e( 'Project type', 'nolan-young-template' ); ?>
				<select name="project_type">
					<option value=""><?php esc_html_e( 'Select one', 'nolan-young-template' ); ?></option>
					<option value="custom-web-application"><?php esc_html_e( 'Custom web application', 'nolan-young-template' ); ?></option>
					<option value="internal-tool"><?php esc_html_e( 'Internal tool or admin portal', 'nolan-young-template' ); ?></option>
					<option value="api-integration"><?php esc_html_e( 'API integration', 'nolan-young-template' ); ?></option>
					<option value="automation-system"><?php esc_html_e( 'Workflow automation', 'nolan-young-template' ); ?></option>
					<option value="modernization"><?php esc_html_e( 'Legacy system modernization', 'nolan-young-template' ); ?></option>
					<option value="technical-discovery"><?php esc_html_e( 'Technical discovery', 'nolan-young-template' ); ?></option>
				</select>
			</label>
			<label><?php esc_html_e( 'Budget range', 'nolan-young-template' ); ?>
				<select name="budget_range">
					<option value=""><?php esc_html_e( 'Select one', 'nolan-young-template' ); ?></option>
					<option value="under-10k"><?php esc_html_e( 'Under $10k', 'nolan-young-template' ); ?></option>
					<option value="10k-25k"><?php esc_html_e( '$10k - $25k', 'nolan-young-template' ); ?></option>
					<option value="25k-50k"><?php esc_html_e( '$25k - $50k', 'nolan-young-template' ); ?></option>
					<option value="50k-plus"><?php esc_html_e( '$50k+', 'nolan-young-template' ); ?></option>
				</select>
			</label>
		<?php endif; ?>
		<label><?php esc_html_e( 'Message', 'nolan-young-template' ); ?><textarea required name="message" rows="5"></textarea></label>
		<p class="form-note"><?php esc_html_e( 'Required fields are checked before submission. Your inquiry is stored privately for authorized site administrators.', 'nolan-young-template' ); ?></p>
		<button class="btn btn-primary" type="submit"><?php esc_html_e( 'Send inquiry', 'nolan-young-template' ); ?></button>
	</form>
	<?php
}

function nolan_young_template_render_newsletter_form() {
	?>
	<form class="newsletter-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" data-enhanced-form>
		<input type="hidden" name="action" value="nolan_young_template_newsletter_signup">
		<?php wp_nonce_field( 'nolan_young_template_newsletter', 'nolan_young_template_newsletter_nonce' ); ?>
		<div class="form-honeypot" aria-hidden="true"><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
		<label><?php esc_html_e( 'First name', 'nolan-young-template' ); ?><input name="first_name" type="text" autocomplete="given-name"></label>
		<label><?php esc_html_e( 'Email address', 'nolan-young-template' ); ?><input required name="email" type="email" autocomplete="email"></label>
		<button class="btn btn-secondary" type="submit"><?php esc_html_e( 'Subscribe', 'nolan-young-template' ); ?></button>
	</form>
	<?php
}
