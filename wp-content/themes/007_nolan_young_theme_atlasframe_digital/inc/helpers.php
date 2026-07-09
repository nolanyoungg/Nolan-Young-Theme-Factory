<?php
/**
 * Shared Atlasframe Digital data and rendering helpers.
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
		'wordpress-design'         => array(
			'title'       => __( 'WordPress Design', '007-nolan-young-theme-atlasframe-digital' ),
			'menu_title'  => __( 'Design systems for clearer WordPress journeys', '007-nolan-young-theme-atlasframe-digital' ),
			'url'         => nolan_young_template_page_url( 'services/wordpress-design' ),
			'image'       => 'assets/images/hero/agency-workspace.jpg',
			'alt'         => __( 'Atlasframe Digital strategy workspace with laptops and planning material', '007-nolan-young-theme-atlasframe-digital' ),
			'excerpt'     => __( 'UX direction, page architecture, responsive layouts, and conversion paths for teams whose current site feels dated or unclear.', '007-nolan-young-theme-atlasframe-digital' ),
			'description' => __( 'Plan pages, visual patterns, and conversion paths before production work begins.', '007-nolan-young-theme-atlasframe-digital' ),
			'ideal'       => __( 'Teams whose current WordPress site looks dated, has unclear page flow, or no longer reflects the quality of the business.', '007-nolan-young-theme-atlasframe-digital' ),
			'bullets'     => array( __( 'Sitemap direction', '007-nolan-young-theme-atlasframe-digital' ), __( 'Homepage and service-page composition', '007-nolan-young-theme-atlasframe-digital' ), __( 'Responsive content hierarchy', '007-nolan-young-theme-atlasframe-digital' ), __( 'Reusable design patterns', '007-nolan-young-theme-atlasframe-digital' ) ),
		),
		'custom-theme-development' => array(
			'title'       => __( 'Custom Theme Development', '007-nolan-young-theme-atlasframe-digital' ),
			'menu_title'  => __( 'Custom themes built as maintainable systems', '007-nolan-young-theme-atlasframe-digital' ),
			'url'         => nolan_young_template_page_url( 'services/custom-theme-development' ),
			'image'       => 'assets/images/hero/developer-screens.jpg',
			'alt'         => __( 'Atlasframe Digital developer screens and code workspace', '007-nolan-young-theme-atlasframe-digital' ),
			'excerpt'     => __( 'Bespoke WordPress theme builds with clean templates, reusable components, SCSS, accessible JavaScript, and documented structure.', '007-nolan-young-theme-atlasframe-digital' ),
			'description' => __( 'Build the theme structure, template parts, SCSS, JavaScript behavior, and documentation around how the site will actually be maintained.', '007-nolan-young-theme-atlasframe-digital' ),
			'ideal'       => __( 'Teams that need a maintainable custom theme instead of a fragile page-builder stack.', '007-nolan-young-theme-atlasframe-digital' ),
			'bullets'     => array( __( 'Custom templates', '007-nolan-young-theme-atlasframe-digital' ), __( 'Reusable components', '007-nolan-young-theme-atlasframe-digital' ), __( 'Build pipeline', '007-nolan-young-theme-atlasframe-digital' ), __( 'Editor settings', '007-nolan-young-theme-atlasframe-digital' ), __( 'Launch-ready documentation', '007-nolan-young-theme-atlasframe-digital' ) ),
		),
		'woocommerce'              => array(
			'title'       => __( 'WooCommerce', '007-nolan-young-theme-atlasframe-digital' ),
			'menu_title'  => __( 'Commerce pages that help buyers decide', '007-nolan-young-theme-atlasframe-digital' ),
			'url'         => nolan_young_template_page_url( 'services/woocommerce' ),
			'image'       => 'assets/images/portfolio/ecommerce-planning.jpg',
			'alt'         => __( 'Atlasframe Digital ecommerce planning and analytics workspace', '007-nolan-young-theme-atlasframe-digital' ),
			'excerpt'     => __( 'Storefront structure, product presentation, checkout-adjacent support, merchandising sections, and operational clarity.', '007-nolan-young-theme-atlasframe-digital' ),
			'description' => __( 'Shape WooCommerce storefront experiences around product clarity, trust, and operational handoff.', '007-nolan-young-theme-atlasframe-digital' ),
			'ideal'       => __( 'Product teams that need a stronger storefront experience on WordPress.', '007-nolan-young-theme-atlasframe-digital' ),
			'bullets'     => array( __( 'Product and category structure', '007-nolan-young-theme-atlasframe-digital' ), __( 'Merchandising sections', '007-nolan-young-theme-atlasframe-digital' ), __( 'Checkout-adjacent content', '007-nolan-young-theme-atlasframe-digital' ), __( 'Store support planning', '007-nolan-young-theme-atlasframe-digital' ) ),
		),
		'website-redesign'         => array(
			'title'       => __( 'Website Redesign', '007-nolan-young-theme-atlasframe-digital' ),
			'menu_title'  => __( 'Redesigns that improve structure, not just style', '007-nolan-young-theme-atlasframe-digital' ),
			'url'         => nolan_young_template_page_url( 'services/website-redesign' ),
			'image'       => 'assets/images/portfolio/performance-review.jpg',
			'alt'         => __( 'Atlasframe Digital performance review and analytics dashboard', '007-nolan-young-theme-atlasframe-digital' ),
			'excerpt'     => __( 'Sharper, faster, clearer WordPress presences for businesses with stale messaging, weak navigation, inconsistent pages, or slow performance.', '007-nolan-young-theme-atlasframe-digital' ),
			'description' => __( 'Rework stale WordPress sites into clearer, faster, easier-to-manage experiences.', '007-nolan-young-theme-atlasframe-digital' ),
			'ideal'       => __( 'Businesses with stale messaging, weak navigation, inconsistent pages, or slow performance.', '007-nolan-young-theme-atlasframe-digital' ),
			'bullets'     => array( __( 'Content audit', '007-nolan-young-theme-atlasframe-digital' ), __( 'Visual refresh', '007-nolan-young-theme-atlasframe-digital' ), __( 'Performance-minded templates', '007-nolan-young-theme-atlasframe-digital' ), __( 'Migration planning', '007-nolan-young-theme-atlasframe-digital' ), __( 'Launch QA', '007-nolan-young-theme-atlasframe-digital' ) ),
		),
		'integrations-automation'  => array(
			'title'       => __( 'Integrations & Automation', '007-nolan-young-theme-atlasframe-digital' ),
			'menu_title'  => __( 'Practical workflows around the website', '007-nolan-young-theme-atlasframe-digital' ),
			'url'         => nolan_young_template_page_url( 'services/integrations-automation' ),
			'image'       => 'assets/images/portfolio/team-collaboration.jpg',
			'alt'         => __( 'Atlasframe Digital team collaboration around a digital project', '007-nolan-young-theme-atlasframe-digital' ),
			'excerpt'     => __( 'Connect WordPress forms, subscriber flows, CRM handoffs, reporting needs, and admin routines without overcomplicating the site.', '007-nolan-young-theme-atlasframe-digital' ),
			'description' => __( 'Connect forms, subscriber flows, CRM handoffs, reporting, and operational workflows.', '007-nolan-young-theme-atlasframe-digital' ),
			'ideal'       => __( 'Teams manually copying lead, customer, or content data between tools.', '007-nolan-young-theme-atlasframe-digital' ),
			'bullets'     => array( __( 'Lead flow mapping', '007-nolan-young-theme-atlasframe-digital' ), __( 'Form and newsletter handling', '007-nolan-young-theme-atlasframe-digital' ), __( 'Admin workflows', '007-nolan-young-theme-atlasframe-digital' ), __( 'Integration-ready architecture', '007-nolan-young-theme-atlasframe-digital' ) ),
		),
		'website-care-support'     => array(
			'title'       => __( 'Website Care & Support', '007-nolan-young-theme-atlasframe-digital' ),
			'menu_title'  => __( 'Care that keeps the site useful after launch', '007-nolan-young-theme-atlasframe-digital' ),
			'url'         => nolan_young_template_page_url( 'services/website-care-support' ),
			'image'       => 'assets/images/texture/studio-detail.jpg',
			'alt'         => '',
			'excerpt'     => __( 'Ongoing updates, quality checks, small improvements, content support, and technical stewardship after launch.', '007-nolan-young-theme-atlasframe-digital' ),
			'description' => __( 'Maintain the WordPress system, prioritize improvements, and keep content and interactions aligned with the business.', '007-nolan-young-theme-atlasframe-digital' ),
			'ideal'       => __( 'Teams that need their site to stay stable and useful after launch.', '007-nolan-young-theme-atlasframe-digital' ),
			'bullets'     => array( __( 'Update rhythm', '007-nolan-young-theme-atlasframe-digital' ), __( 'QA checklist', '007-nolan-young-theme-atlasframe-digital' ), __( 'Improvement backlog', '007-nolan-young-theme-atlasframe-digital' ), __( 'Content support', '007-nolan-young-theme-atlasframe-digital' ), __( 'Technical stewardship', '007-nolan-young-theme-atlasframe-digital' ) ),
		),
	);
}

function nolan_young_template_process_steps() {
	return array(
		'diagnose' => array( 'title' => __( 'Diagnose', '007-nolan-young-theme-atlasframe-digital' ), 'text' => __( 'Clarify goals, audience, content issues, technical constraints, and what the site needs to support.', '007-nolan-young-theme-atlasframe-digital' ) ),
		'frame'    => array( 'title' => __( 'Frame', '007-nolan-young-theme-atlasframe-digital' ), 'text' => __( 'Plan the sitemap, page roles, service hierarchy, conversion paths, and technical approach.', '007-nolan-young-theme-atlasframe-digital' ) ),
		'design'   => array( 'title' => __( 'Design', '007-nolan-young-theme-atlasframe-digital' ), 'text' => __( 'Build a visual system and page compositions that make the business easier to understand.', '007-nolan-young-theme-atlasframe-digital' ) ),
		'develop'  => array( 'title' => __( 'Develop', '007-nolan-young-theme-atlasframe-digital' ), 'text' => __( 'Implement the WordPress theme, templates, SCSS, JavaScript behavior, forms, and admin-facing features.', '007-nolan-young-theme-atlasframe-digital' ) ),
		'validate' => array( 'title' => __( 'Validate', '007-nolan-young-theme-atlasframe-digital' ), 'text' => __( 'Check responsive behavior, accessibility, build output, PHP quality, forms, navigation, and content consistency.', '007-nolan-young-theme-atlasframe-digital' ) ),
		'support'  => array( 'title' => __( 'Support', '007-nolan-young-theme-atlasframe-digital' ), 'text' => __( 'Provide post-launch care, small improvements, documentation, and practical next steps.', '007-nolan-young-theme-atlasframe-digital' ) ),
	);
}

function nolan_young_template_articles() {
	return array(
		array( 'tag' => __( 'Rebuild', '007-nolan-young-theme-atlasframe-digital' ), 'title' => __( 'How to Tell When a WordPress Site Needs a Rebuild', '007-nolan-young-theme-atlasframe-digital' ), 'url' => nolan_young_template_page_url( 'blog/wordpress-site-rebuild-signs' ), 'image' => 'assets/images/portfolio/performance-review.jpg', 'alt' => __( 'Atlasframe Digital performance review and analytics dashboard', '007-nolan-young-theme-atlasframe-digital' ), 'excerpt' => __( 'A practical way to separate content cleanup, redesign, and a full custom theme rebuild.', '007-nolan-young-theme-atlasframe-digital' ) ),
		array( 'tag' => __( 'Theme Build', '007-nolan-young-theme-atlasframe-digital' ), 'title' => __( 'What a Custom Theme Should Include Before Launch', '007-nolan-young-theme-atlasframe-digital' ), 'url' => nolan_young_template_page_url( 'blog/custom-theme-launch-inclusions' ), 'image' => 'assets/images/hero/developer-screens.jpg', 'alt' => __( 'Atlasframe Digital developer screens and code workspace', '007-nolan-young-theme-atlasframe-digital' ), 'excerpt' => __( 'Templates, reusable parts, editor settings, build outputs, documentation, and QA checks to confirm before launch.', '007-nolan-young-theme-atlasframe-digital' ) ),
		array( 'tag' => __( 'Services', '007-nolan-young-theme-atlasframe-digital' ), 'title' => __( 'Planning Service Pages That Help Buyers Decide', '007-nolan-young-theme-atlasframe-digital' ), 'url' => nolan_young_template_page_url( 'blog/planning-service-pages' ), 'image' => 'assets/images/hero/agency-workspace.jpg', 'alt' => __( 'Atlasframe Digital strategy workspace with laptops and planning material', '007-nolan-young-theme-atlasframe-digital' ), 'excerpt' => __( 'How to frame audience fit, deliverables, next steps, and FAQs without burying visitors in generic copy.', '007-nolan-young-theme-atlasframe-digital' ) ),
		array( 'tag' => __( 'Integration', '007-nolan-young-theme-atlasframe-digital' ), 'title' => __( 'Reducing Manual Lead Handoffs from WordPress', '007-nolan-young-theme-atlasframe-digital' ), 'url' => nolan_young_template_page_url( 'blog/reducing-manual-lead-handoffs' ), 'image' => 'assets/images/portfolio/team-collaboration.jpg', 'alt' => __( 'Atlasframe Digital team collaboration around a digital project', '007-nolan-young-theme-atlasframe-digital' ), 'excerpt' => __( 'Simple ways to map forms, notifications, exports, subscriber flows, and admin routines before building integrations.', '007-nolan-young-theme-atlasframe-digital' ) ),
		array( 'tag' => __( 'Care', '007-nolan-young-theme-atlasframe-digital' ), 'title' => __( 'A Practical Website Care Checklist', '007-nolan-young-theme-atlasframe-digital' ), 'url' => nolan_young_template_page_url( 'blog/practical-website-care-checklist' ), 'image' => 'assets/images/texture/studio-detail.jpg', 'alt' => '', 'excerpt' => __( 'A measured rhythm for updates, content checks, accessibility review, forms, and small improvements after launch.', '007-nolan-young-theme-atlasframe-digital' ) ),
		array( 'tag' => __( 'WooCommerce', '007-nolan-young-theme-atlasframe-digital' ), 'title' => __( 'WooCommerce Storefront Signals That Build Confidence', '007-nolan-young-theme-atlasframe-digital' ), 'url' => nolan_young_template_page_url( 'blog/woocommerce-storefront-confidence' ), 'image' => 'assets/images/portfolio/ecommerce-planning.jpg', 'alt' => __( 'Atlasframe Digital ecommerce planning and analytics workspace', '007-nolan-young-theme-atlasframe-digital' ), 'excerpt' => __( 'Product clarity, category structure, merchandising context, and checkout-adjacent content that help buyers decide.', '007-nolan-young-theme-atlasframe-digital' ) ),
	);
}

function nolan_young_template_work_items() {
	return array(
		array( 'category' => 'Strategy', 'title' => __( 'Service Website Reframe', '007-nolan-young-theme-atlasframe-digital' ), 'url' => nolan_young_template_page_url( 'work/service-website-reframe' ), 'image' => 'assets/images/hero/agency-workspace.jpg', 'alt' => __( 'Atlasframe Digital strategy workspace with laptops and planning material', '007-nolan-young-theme-atlasframe-digital' ), 'excerpt' => __( 'An anonymized planning example for clarifying service hierarchy, page roles, and next-step paths.', '007-nolan-young-theme-atlasframe-digital' ) ),
		array( 'category' => 'Design', 'title' => __( 'WooCommerce Catalog Refresh', '007-nolan-young-theme-atlasframe-digital' ), 'url' => nolan_young_template_page_url( 'work/woocommerce-catalog-refresh' ), 'image' => 'assets/images/portfolio/ecommerce-planning.jpg', 'alt' => __( 'Atlasframe Digital ecommerce planning and analytics workspace', '007-nolan-young-theme-atlasframe-digital' ), 'excerpt' => __( 'A storefront structure concept for making categories, product context, and merchandising sections easier to scan.', '007-nolan-young-theme-atlasframe-digital' ) ),
		array( 'category' => 'Development', 'title' => __( 'Membership Content System', '007-nolan-young-theme-atlasframe-digital' ), 'url' => nolan_young_template_page_url( 'work/membership-content-system' ), 'image' => 'assets/images/hero/developer-screens.jpg', 'alt' => __( 'Atlasframe Digital developer screens and code workspace', '007-nolan-young-theme-atlasframe-digital' ), 'excerpt' => __( 'A representative custom theme architecture for reusable templates, protected content paths, and documented handoff.', '007-nolan-young-theme-atlasframe-digital' ) ),
		array( 'category' => 'Integration', 'title' => __( 'Lead Flow Automation', '007-nolan-young-theme-atlasframe-digital' ), 'url' => nolan_young_template_page_url( 'work/lead-flow-automation' ), 'image' => 'assets/images/portfolio/team-collaboration.jpg', 'alt' => __( 'Atlasframe Digital team collaboration around a digital project', '007-nolan-young-theme-atlasframe-digital' ), 'excerpt' => __( 'A workflow example for routing form context, subscriber data, and admin exports without fragile manual copying.', '007-nolan-young-theme-atlasframe-digital' ) ),
		array( 'category' => 'Support', 'title' => __( 'Performance Cleanup', '007-nolan-young-theme-atlasframe-digital' ), 'url' => nolan_young_template_page_url( 'work/performance-cleanup' ), 'image' => 'assets/images/portfolio/performance-review.jpg', 'alt' => __( 'Atlasframe Digital performance review and analytics dashboard', '007-nolan-young-theme-atlasframe-digital' ), 'excerpt' => __( 'A focused improvement example for tightening templates, assets, forms, and responsive behavior after review.', '007-nolan-young-theme-atlasframe-digital' ) ),
		array( 'category' => 'Results', 'title' => __( 'Care Plan Backlog', '007-nolan-young-theme-atlasframe-digital' ), 'url' => nolan_young_template_page_url( 'work/care-plan-backlog' ), 'image' => 'assets/images/texture/studio-detail.jpg', 'alt' => '', 'excerpt' => __( 'A neutral support example showing how updates, quality checks, content requests, and small improvements are prioritized.', '007-nolan-young-theme-atlasframe-digital' ) ),
	);
}

function nolan_young_template_faqs() {
	return array(
		__( 'How do we know whether we need a redesign or a rebuild?', '007-nolan-young-theme-atlasframe-digital' ) => __( 'A redesign may be enough when the underlying theme and content model are sound. A rebuild is usually the better path when templates are fragile, editing is difficult, performance is poor, or the current structure cannot support the business.', '007-nolan-young-theme-atlasframe-digital' ),
		__( 'Can Atlasframe Digital work with an existing WordPress site?', '007-nolan-young-theme-atlasframe-digital' ) => __( 'Yes. Existing sites can be diagnosed, reframed, redesigned, rebuilt, or moved into an ongoing care plan depending on the technical condition and business need.', '007-nolan-young-theme-atlasframe-digital' ),
		__( 'What should we prepare before starting?', '007-nolan-young-theme-atlasframe-digital' ) => __( 'Bring the current site, goals, audience notes, must-have functionality, known content issues, and any operational workflows the website needs to support.', '007-nolan-young-theme-atlasframe-digital' ),
		__( 'Does every project include WooCommerce?', '007-nolan-young-theme-atlasframe-digital' ) => __( 'No. WooCommerce is included only when storefront planning, product presentation, checkout-adjacent content, or ecommerce operations are part of the project.', '007-nolan-young-theme-atlasframe-digital' ),
		__( 'How are integrations handled?', '007-nolan-young-theme-atlasframe-digital' ) => __( 'Integrations start with data-flow planning. Forms, subscriber handling, CRM handoffs, reporting needs, and admin routines are mapped before implementation choices are made.', '007-nolan-young-theme-atlasframe-digital' ),
		__( 'What happens after launch?', '007-nolan-young-theme-atlasframe-digital' ) => __( 'Post-launch support can include updates, small improvements, content support, quality checks, documentation, and an improvement backlog.', '007-nolan-young-theme-atlasframe-digital' ),
		__( 'Can the theme be maintained by an internal team?', '007-nolan-young-theme-atlasframe-digital' ) => __( 'The theme is structured around real templates, reusable parts, documented build outputs, and editor-ready settings so internal teams have a clearer foundation to maintain.', '007-nolan-young-theme-atlasframe-digital' ),
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
		<span class="site-branding__name"><?php esc_html_e( 'Atlasframe Digital', '007-nolan-young-theme-atlasframe-digital' ); ?></span>
		<span class="site-branding__tagline"><?php esc_html_e( 'WordPress systems studio', '007-nolan-young-theme-atlasframe-digital' ); ?></span>
	</span>
	<?php
}

function nolan_young_template_render_contact_form( $form_type = 'contact', $service = '' ) {
	$action = esc_url( admin_url( 'admin-post.php' ) );
	?>
	<form class="atlasframe-form" method="post" action="<?php echo $action; ?>" novalidate data-enhanced-form>
		<input type="hidden" name="action" value="nolan_young_template_submit_form">
		<input type="hidden" name="form_type" value="<?php echo esc_attr( $form_type ); ?>">
		<input type="hidden" name="service" value="<?php echo esc_attr( $service ); ?>">
		<?php wp_nonce_field( 'nolan_young_template_form', 'nolan_young_template_form_nonce' ); ?>
		<div class="form-honeypot" aria-hidden="true"><label>Leave this field empty <input type="text" name="company_url" tabindex="-1" autocomplete="off"></label></div>
		<label><?php esc_html_e( 'Name', '007-nolan-young-theme-atlasframe-digital' ); ?><input required name="name" type="text" autocomplete="name"></label>
		<label><?php esc_html_e( 'Email', '007-nolan-young-theme-atlasframe-digital' ); ?><input required name="email" type="email" autocomplete="email"></label>
		<label><?php esc_html_e( 'Phone', '007-nolan-young-theme-atlasframe-digital' ); ?><input name="phone" type="tel" autocomplete="tel"></label>
		<label><?php esc_html_e( 'Message', '007-nolan-young-theme-atlasframe-digital' ); ?><textarea required name="message" rows="5" placeholder="<?php esc_attr_e( 'Current site, goals, timeline context, must-have functionality, and support needs.', '007-nolan-young-theme-atlasframe-digital' ); ?>"></textarea></label>
		<p class="form-note"><?php esc_html_e( 'Share the project context and Atlasframe Digital will follow up with a practical next step.', '007-nolan-young-theme-atlasframe-digital' ); ?></p>
		<button class="btn btn-primary" type="submit"><?php esc_html_e( 'Send inquiry', '007-nolan-young-theme-atlasframe-digital' ); ?></button>
	</form>
	<?php
}

function nolan_young_template_render_newsletter_form() {
	?>
	<form class="newsletter-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" data-enhanced-form>
		<input type="hidden" name="action" value="nolan_young_template_newsletter_signup">
		<?php wp_nonce_field( 'nolan_young_template_newsletter', 'nolan_young_template_newsletter_nonce' ); ?>
		<div class="form-honeypot" aria-hidden="true"><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
		<label><?php esc_html_e( 'First name', '007-nolan-young-theme-atlasframe-digital' ); ?><input name="first_name" type="text" autocomplete="given-name"></label>
		<label><?php esc_html_e( 'Email address', '007-nolan-young-theme-atlasframe-digital' ); ?><input required name="email" type="email" autocomplete="email"></label>
		<button class="btn btn-secondary" type="submit"><?php esc_html_e( 'Subscribe', '007-nolan-young-theme-atlasframe-digital' ); ?></button>
	</form>
	<?php
}
