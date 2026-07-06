<?php
/**
 * Shared ForgeCart Studio data and rendering helpers.
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
		'wordpress'   => array(
			'title'   => __( 'WordPress Websites', 'nolan-young-template' ),
			'url'     => nolan_young_template_page_url( 'services/wordpress-websites' ),
			'image'   => 'assets/images/hero/developer-screens.jpg',
			'alt'     => __( 'ForgeCart Studio developer screens and code workspace', 'nolan-young-template' ),
			'excerpt' => __( 'Custom content-rich WordPress sites for service brands, publishers, consultants, and local teams that need clear pages and practical editing workflows.', 'nolan-young-template' ),
			'bullets' => array( __( 'Information architecture and page planning', 'nolan-young-template' ), __( 'Responsive theme implementation', 'nolan-young-template' ), __( 'Reusable content sections', 'nolan-young-template' ), __( 'Editor handoff guidance', 'nolan-young-template' ) ),
		),
		'shopify'     => array(
			'title'   => __( 'Shopify Stores', 'nolan-young-template' ),
			'url'     => nolan_young_template_page_url( 'services/shopify-stores' ),
			'image'   => 'assets/images/portfolio/ecommerce-planning.jpg',
			'alt'     => __( 'ForgeCart Studio ecommerce planning and analytics workspace', 'nolan-young-template' ),
			'excerpt' => __( 'Store setup, theme customization, collection structure, merchandising sections, and checkout-readiness support for growing ecommerce teams.', 'nolan-young-template' ),
			'bullets' => array( __( 'Product and collection organization', 'nolan-young-template' ), __( 'Theme section customization', 'nolan-young-template' ), __( 'Merchandising page patterns', 'nolan-young-template' ), __( 'Launch checklist support', 'nolan-young-template' ) ),
		),
		'woocommerce' => array(
			'title'   => __( 'WooCommerce Builds', 'nolan-young-template' ),
			'url'     => nolan_young_template_page_url( 'services/woocommerce-builds' ),
			'image'   => 'assets/images/portfolio/performance-review.jpg',
			'alt'     => __( 'ForgeCart Studio performance review and analytics dashboard', 'nolan-young-template' ),
			'excerpt' => __( 'WooCommerce planning for teams that need commerce inside a WordPress content system without treating one platform as universally better.', 'nolan-young-template' ),
			'bullets' => array( __( 'Platform-fit guidance', 'nolan-young-template' ), __( 'Catalog and checkout planning', 'nolan-young-template' ), __( 'Content plus commerce structure', 'nolan-young-template' ), __( 'Maintenance considerations', 'nolan-young-template' ) ),
		),
		'migrations'  => array(
			'title'   => __( 'Platform Migrations', 'nolan-young-template' ),
			'url'     => nolan_young_template_page_url( 'services/platform-migrations' ),
			'image'   => 'assets/images/portfolio/team-collaboration.jpg',
			'alt'     => __( 'ForgeCart Studio team collaboration around a digital project', 'nolan-young-template' ),
			'excerpt' => __( 'Migration planning from older WordPress builds, Squarespace, Wix, custom sites, or legacy Shopify themes with content and launch risk made visible early.', 'nolan-young-template' ),
			'bullets' => array( __( 'Content inventory', 'nolan-young-template' ), __( 'Redirect and URL review', 'nolan-young-template' ), __( 'Theme replacement planning', 'nolan-young-template' ), __( 'Analytics handoff notes', 'nolan-young-template' ) ),
		),
		'conversion'  => array(
			'title'   => __( 'Conversion Design', 'nolan-young-template' ),
			'url'     => nolan_young_template_page_url( 'services/conversion-design' ),
			'image'   => 'assets/images/hero/agency-workspace.jpg',
			'alt'     => __( 'ForgeCart Studio strategy workspace with laptops and planning material', 'nolan-young-template' ),
			'excerpt' => __( 'Product pages, story pages, forms, newsletter capture, landing pages, and calls to action designed around clear next steps.', 'nolan-young-template' ),
			'bullets' => array( __( 'Landing page systems', 'nolan-young-template' ), __( 'Forms and email capture', 'nolan-young-template' ), __( 'Product story flow', 'nolan-young-template' ), __( 'Analytics event planning', 'nolan-young-template' ) ),
		),
		'care'        => array(
			'title'   => __( 'Site Care', 'nolan-young-template' ),
			'url'     => nolan_young_template_page_url( 'services/site-care' ),
			'image'   => 'assets/images/texture/studio-detail.jpg',
			'alt'     => '',
			'excerpt' => __( 'Practical maintenance for updates, backups, performance checks, small content edits, campaign pages, and ecommerce tune-ups.', 'nolan-young-template' ),
			'bullets' => array( __( 'Update and backup coordination', 'nolan-young-template' ), __( 'Performance review', 'nolan-young-template' ), __( 'Small content edits', 'nolan-young-template' ), __( 'Seasonal campaign support', 'nolan-young-template' ) ),
		),
	);
}

function nolan_young_template_articles() {
	return array(
		array( 'tag' => __( 'Planning', 'nolan-young-template' ), 'title' => __( 'How to choose between WordPress, Shopify, and WooCommerce', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'blog/wordpress-shopify-woocommerce-fit' ), 'image' => 'assets/images/portfolio/ecommerce-planning.jpg', 'alt' => __( 'ForgeCart Studio ecommerce planning and analytics workspace', 'nolan-young-template' ), 'excerpt' => __( 'A practical framework for matching platform strengths to content, catalog, checkout, and operating needs.', 'nolan-young-template' ) ),
		array( 'tag' => __( 'WordPress', 'nolan-young-template' ), 'title' => __( 'What a manageable WordPress page system includes', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'blog/manageable-wordpress-page-system' ), 'image' => 'assets/images/hero/developer-screens.jpg', 'alt' => __( 'ForgeCart Studio developer screens and code workspace', 'nolan-young-template' ), 'excerpt' => __( 'Reusable sections, editor rules, navigation patterns, and content guardrails that keep publishing clear.', 'nolan-young-template' ) ),
		array( 'tag' => __( 'Launch', 'nolan-young-template' ), 'title' => __( 'A launch checklist for service sites and online stores', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'blog/launch-checklist' ), 'image' => 'assets/images/portfolio/team-collaboration.jpg', 'alt' => __( 'ForgeCart Studio team collaboration around a digital project', 'nolan-young-template' ), 'excerpt' => __( 'Forms, redirects, product data, content review, accessibility, analytics, and handoff items to confirm before launch.', 'nolan-young-template' ) ),
		array( 'tag' => __( 'Care', 'nolan-young-template' ), 'title' => __( 'What to review after the first month online', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'blog/first-month-review' ), 'image' => 'assets/images/portfolio/performance-review.jpg', 'alt' => __( 'ForgeCart Studio performance review and analytics dashboard', 'nolan-young-template' ), 'excerpt' => __( 'Early signals that help teams improve content, calls to action, checkout clarity, and support workflows.', 'nolan-young-template' ) ),
	);
}

function nolan_young_template_work_items() {
	return array(
		array( 'category' => 'Strategy', 'title' => __( 'Platform Fit Roadmap', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'work/platform-fit-roadmap' ), 'image' => 'assets/images/hero/agency-workspace.jpg', 'alt' => __( 'ForgeCart Studio strategy workspace with laptops and planning material', 'nolan-young-template' ), 'excerpt' => __( 'A decision plan that clarified when WordPress, Shopify, and WooCommerce each made sense for the business model.', 'nolan-young-template' ) ),
		array( 'category' => 'Design', 'title' => __( 'Service Brand Website System', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'work/service-brand-website-system' ), 'image' => 'assets/images/portfolio/team-collaboration.jpg', 'alt' => __( 'ForgeCart Studio team collaboration around a digital project', 'nolan-young-template' ), 'excerpt' => __( 'An editorial page system for services, proof, resources, and contact paths that stayed easy to scan.', 'nolan-young-template' ) ),
		array( 'category' => 'Development', 'title' => __( 'Custom WordPress Theme Build', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'work/custom-wordpress-theme-build' ), 'image' => 'assets/images/hero/developer-screens.jpg', 'alt' => __( 'ForgeCart Studio developer screens and code workspace', 'nolan-young-template' ), 'excerpt' => __( 'A maintainable WordPress implementation with modular templates, local assets, and compiled production bundles.', 'nolan-young-template' ) ),
		array( 'category' => 'Integration', 'title' => __( 'Commerce Content Integration', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'work/commerce-content-integration' ), 'image' => 'assets/images/portfolio/ecommerce-planning.jpg', 'alt' => __( 'ForgeCart Studio ecommerce planning and analytics workspace', 'nolan-young-template' ), 'excerpt' => __( 'Product structure, campaign pages, email capture, and analytics handoff planned as one operating flow.', 'nolan-young-template' ) ),
		array( 'category' => 'Support', 'title' => __( 'Site Care Operating Plan', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'work/site-care-operating-plan' ), 'image' => 'assets/images/texture/studio-detail.jpg', 'alt' => '', 'excerpt' => __( 'A post-launch care rhythm for updates, content edits, performance review, and seasonal ecommerce adjustments.', 'nolan-young-template' ) ),
		array( 'category' => 'Results', 'title' => __( 'Conversion Path Refresh', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'work/conversion-path-refresh' ), 'image' => 'assets/images/portfolio/performance-review.jpg', 'alt' => __( 'ForgeCart Studio performance review and analytics dashboard', 'nolan-young-template' ), 'excerpt' => __( 'Navigation, page hierarchy, and form context were refined so visitors could understand the next step faster.', 'nolan-young-template' ) ),
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
		<span class="site-branding__name"><?php esc_html_e( 'ForgeCart Studio', 'nolan-young-template' ); ?></span>
		<span class="site-branding__tagline"><?php esc_html_e( 'WordPress sites and Shopify stores built to sell clearly.', 'nolan-young-template' ); ?></span>
	</span>
	<?php
}

function nolan_young_template_render_contact_form( $form_type = 'contact', $service = '' ) {
	$action = esc_url( admin_url( 'admin-post.php' ) );
	?>
	<form class="forgecart-form" method="post" action="<?php echo $action; ?>" novalidate data-enhanced-form>
		<input type="hidden" name="action" value="nolan_young_template_submit_form">
		<input type="hidden" name="form_type" value="<?php echo esc_attr( $form_type ); ?>">
		<input type="hidden" name="service" value="<?php echo esc_attr( $service ); ?>">
		<?php wp_nonce_field( 'nolan_young_template_form', 'nolan_young_template_form_nonce' ); ?>
		<div class="form-honeypot" aria-hidden="true"><label>Leave this field empty <input type="text" name="company_url" tabindex="-1" autocomplete="off"></label></div>
		<label><?php esc_html_e( 'Name', 'nolan-young-template' ); ?><input required name="name" type="text" autocomplete="name"></label>
		<label><?php esc_html_e( 'Email', 'nolan-young-template' ); ?><input required name="email" type="email" autocomplete="email"></label>
		<label><?php esc_html_e( 'Phone', 'nolan-young-template' ); ?><input name="phone" type="tel" autocomplete="tel"></label>
		<label><?php esc_html_e( 'Message', 'nolan-young-template' ); ?><textarea required name="message" rows="5"></textarea></label>
		<p class="form-note"><?php esc_html_e( 'Required fields are checked before submission. Inquiries are stored privately for authorized site administrators.', 'nolan-young-template' ); ?></p>
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
