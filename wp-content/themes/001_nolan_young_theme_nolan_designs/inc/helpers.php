<?php
/**
 * Helpers and theme data.
 *
 * @package Nolan_Young_Template
 */

defined( 'ABSPATH' ) || exit;

function nolan_young_template_home_sections() {
	return array(
		array( 'key' => 'strategy', 'title' => 'Strategy', 'excerpt' => 'Discovery, positioning, and a plan that keeps the build aligned to business goals.' ),
		array( 'key' => 'design', 'title' => 'Design', 'excerpt' => 'Editorial interfaces with calm hierarchy, motion, and conversion-minded layout decisions.' ),
		array( 'key' => 'development', 'title' => 'Development', 'excerpt' => 'Maintainable WordPress builds, custom templates, and clean component structure.' ),
		array( 'key' => 'integration', 'title' => 'Integration', 'excerpt' => 'Forms, automations, CRM hooks, newsletter flows, and third-party systems.' ),
		array( 'key' => 'support', 'title' => 'Support', 'excerpt' => 'Ongoing care, content updates, and practical improvements after launch.' ),
		array( 'key' => 'results', 'title' => 'Results', 'excerpt' => 'A site that is easier to use, easier to manage, and easier to grow.' ),
	);
}

function nolan_young_template_services() {
	return array(
		'wordpress-design' => array( 'title' => 'WordPress Design', 'summary' => 'Premium editorial layouts and conversion-focused page systems.' ),
		'custom-theme-development' => array( 'title' => 'Custom Theme Development', 'summary' => 'Hand-built templates and reusable theme architecture.' ),
		'woocommerce' => array( 'title' => 'WooCommerce', 'summary' => 'Commerce experiences that stay fast, usable, and brand-led.' ),
		'website-redesign' => array( 'title' => 'Website Redesign', 'summary' => 'Modernize an existing site without losing what already works.' ),
		'integrations-automation' => array( 'title' => 'Integrations & Automation', 'summary' => 'Connect forms, newsletters, and back-office systems.' ),
		'website-care-support' => array( 'title' => 'Website Care & Support', 'summary' => 'Monthly support for updates, fixes, and steady improvement.' ),
	);
}

function nolan_young_template_blog_posts() {
	return array(
		array( 'title' => 'How to plan a WordPress redesign without losing clarity', 'tag' => 'Strategy', 'excerpt' => 'A practical process for setting goals, preserving content, and avoiding scope drift.' ),
		array( 'title' => 'Choosing the right homepage structure for a service business', 'tag' => 'Design', 'excerpt' => 'A breakdown of sections, hierarchy, and calls to action that support conversion.' ),
		array( 'title' => 'What reusable components do for long-term WordPress maintenance', 'tag' => 'Development', 'excerpt' => 'Why a disciplined component system keeps future work predictable and faster.' ),
		array( 'title' => 'A simple support rhythm that keeps sites healthy after launch', 'tag' => 'Support', 'excerpt' => 'Monthly checks, content updates, and a realistic plan for ongoing improvement.' ),
	);
}

function nolan_young_template_pages() {
	return array(
		'about'    => home_url( '/about/' ),
		'services' => home_url( '/services/' ),
		'work'     => home_url( '/work/' ),
		'blog'     => home_url( '/blog/' ),
		'contact'  => home_url( '/contact/' ),
	);
}

function nolan_young_template_asset( $relative_path ) {
	return get_theme_file_uri( 'assets/images/' . ltrim( $relative_path, '/' ) );
}

function nolan_young_template_svg_logo() {
	ob_start();
	?>
	<svg class="site-logo__mark" viewBox="0 0 64 64" role="img" aria-hidden="true" focusable="false">
		<rect x="4" y="4" width="56" height="56" rx="16" fill="currentColor" opacity="0.1"></rect>
		<path d="M18 44V20h8l20 24V20h8v24h-8L26 20v24h-8z" fill="currentColor"></path>
	</svg>
	<?php
	return trim( ob_get_clean() );
}

function nolan_young_template_action_links( $base ) {
	return array(
		'view' => $base,
		'cta'  => home_url( '/contact/' ),
	);
}

function nolan_young_template_render_hero_image() {
	return nolan_young_template_asset( 'hero/brand-illustration.svg' );
}
