<?php
/**
 * Shared data and rendering helpers.
 *
 * @package Nolan_Young_Template
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_young_template_page_url( $path = '' ) {
	return esc_url( home_url( '/' . ltrim( $path, '/' ) ) );
}

function nolan_young_template_asset_url( $path ) {
	return esc_url( get_theme_file_uri( ltrim( $path, '/' ) ) );
}

function nolan_young_template_services() {
	return array(
		array(
			'key' => 'strategy',
			'title' => __( 'Website Strategy', 'nolan-young-template' ),
			'url' => nolan_young_template_page_url( 'services/#website-strategy' ),
			'image' => 'assets/images/portfolio/service-strategy.svg',
			'excerpt' => __( 'Clarify goals, audience needs, content priorities, and conversion paths before design starts.', 'nolan-young-template' ),
			'details' => array( __( 'Discovery workshops', 'nolan-young-template' ), __( 'Site maps and page plans', 'nolan-young-template' ), __( 'Messaging structure', 'nolan-young-template' ), __( 'Measurement planning', 'nolan-young-template' ) ),
		),
		array(
			'key' => 'design',
			'title' => __( 'Modern WordPress Design', 'nolan-young-template' ),
			'url' => nolan_young_template_page_url( 'services/#modern-wordpress-design' ),
			'image' => 'assets/images/portfolio/service-design.svg',
			'excerpt' => __( 'Create polished, responsive interfaces that make services easy to understand and act on.', 'nolan-young-template' ),
			'details' => array( __( 'Responsive page systems', 'nolan-young-template' ), __( 'Reusable component styling', 'nolan-young-template' ), __( 'Accessible interface states', 'nolan-young-template' ), __( 'Editor-friendly layouts', 'nolan-young-template' ) ),
		),
		array(
			'key' => 'development',
			'title' => __( 'Custom Theme Development', 'nolan-young-template' ),
			'url' => nolan_young_template_page_url( 'services/#custom-theme-development' ),
			'image' => 'assets/images/portfolio/service-development.svg',
			'excerpt' => __( 'Build maintainable WordPress themes with clean templates, local assets, and practical editor support.', 'nolan-young-template' ),
			'details' => array( __( 'Theme architecture', 'nolan-young-template' ), __( 'Template parts and page templates', 'nolan-young-template' ), __( 'Performance-minded assets', 'nolan-young-template' ), __( 'Quality review before launch', 'nolan-young-template' ) ),
		),
		array(
			'key' => 'integration',
			'title' => __( 'Content and Tool Integration', 'nolan-young-template' ),
			'url' => nolan_young_template_page_url( 'services/#content-tool-integration' ),
			'image' => 'assets/images/portfolio/service-integration.svg',
			'excerpt' => __( 'Connect forms, content flows, analytics-ready events, and operational pages without adding runtime clutter.', 'nolan-young-template' ),
			'details' => array( __( 'Lead capture flows', 'nolan-young-template' ), __( 'Content migration planning', 'nolan-young-template' ), __( 'Admin workflow setup', 'nolan-young-template' ), __( 'Portable configuration', 'nolan-young-template' ) ),
		),
		array(
			'key' => 'support',
			'title' => __( 'Launch and Support', 'nolan-young-template' ),
			'url' => nolan_young_template_page_url( 'services/#launch-support' ),
			'image' => 'assets/images/portfolio/service-support.svg',
			'excerpt' => __( 'Prepare the handoff, document key workflows, and support updates after the site goes live.', 'nolan-young-template' ),
			'details' => array( __( 'Pre-launch checklist', 'nolan-young-template' ), __( 'Editor guidance', 'nolan-young-template' ), __( 'Post-launch updates', 'nolan-young-template' ), __( 'Issue triage', 'nolan-young-template' ) ),
		),
		array(
			'key' => 'optimization',
			'title' => __( 'Conversion Improvement', 'nolan-young-template' ),
			'url' => nolan_young_template_page_url( 'services/#conversion-improvement' ),
			'image' => 'assets/images/portfolio/service-results.svg',
			'excerpt' => __( 'Refine important pages so visitors can compare services, ask better questions, and contact with confidence.', 'nolan-young-template' ),
			'details' => array( __( 'Page audits', 'nolan-young-template' ), __( 'Call-to-action refinement', 'nolan-young-template' ), __( 'Accessibility improvements', 'nolan-young-template' ), __( 'Content clarity reviews', 'nolan-young-template' ) ),
		),
	);
}

function nolan_young_template_work_items() {
	return array(
		array( 'title' => __( 'Service Firm Rebuild', 'nolan-young-template' ), 'category' => 'Strategy', 'image' => 'assets/images/portfolio/work-service-firm.svg', 'url' => nolan_young_template_page_url( 'work/#service-firm-rebuild' ), 'excerpt' => __( 'A clearer service architecture with direct inquiry paths and easier editorial maintenance.', 'nolan-young-template' ) ),
		array( 'title' => __( 'Consulting Resource Hub', 'nolan-young-template' ), 'category' => 'Design', 'image' => 'assets/images/portfolio/work-resource-hub.svg', 'url' => nolan_young_template_page_url( 'work/#consulting-resource-hub' ), 'excerpt' => __( 'Editorial article cards, topic navigation, and structured calls to action for a knowledge-heavy team.', 'nolan-young-template' ) ),
		array( 'title' => __( 'Local Services Conversion Pages', 'nolan-young-template' ), 'category' => 'Development', 'image' => 'assets/images/portfolio/work-conversion-pages.svg', 'url' => nolan_young_template_page_url( 'work/#conversion-pages' ), 'excerpt' => __( 'Reusable WordPress page sections for services, FAQs, proof, and contact flows.', 'nolan-young-template' ) ),
		array( 'title' => __( 'Operations-Friendly Lead Flow', 'nolan-young-template' ), 'category' => 'Integration', 'image' => 'assets/images/portfolio/work-lead-flow.svg', 'url' => nolan_young_template_page_url( 'work/#lead-flow' ), 'excerpt' => __( 'Private submission storage, admin review, exports, and owner notifications.', 'nolan-young-template' ) ),
		array( 'title' => __( 'Launch Support System', 'nolan-young-template' ), 'category' => 'Support', 'image' => 'assets/images/portfolio/work-launch-support.svg', 'url' => nolan_young_template_page_url( 'work/#launch-support-system' ), 'excerpt' => __( 'Documentation, update routines, and practical handoff resources for site owners.', 'nolan-young-template' ) ),
		array( 'title' => __( 'Inquiry Page Refinement', 'nolan-young-template' ), 'category' => 'Results', 'image' => 'assets/images/portfolio/work-inquiry-refinement.svg', 'url' => nolan_young_template_page_url( 'work/#inquiry-refinement' ), 'excerpt' => __( 'A focused contact experience that asks for useful context without overburdening visitors.', 'nolan-young-template' ) ),
	);
}

function nolan_young_template_articles() {
	return array(
		array( 'tag' => __( 'Planning', 'nolan-young-template' ), 'title' => __( 'What to Prepare Before a Website Redesign', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'blog/prepare-before-website-redesign/' ), 'image' => 'assets/images/portfolio/article-planning.svg', 'excerpt' => __( 'A practical list of goals, content, examples, and decision points that makes the first conversation more useful.', 'nolan-young-template' ) ),
		array( 'tag' => __( 'WordPress', 'nolan-young-template' ), 'title' => __( 'Choosing Pages for a Service Business Website', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'blog/service-business-pages/' ), 'image' => 'assets/images/portfolio/article-pages.svg', 'excerpt' => __( 'How to organize services, proof, resources, and contact paths so visitors can move with less friction.', 'nolan-young-template' ) ),
		array( 'tag' => __( 'Design', 'nolan-young-template' ), 'title' => __( 'Why Reusable Sections Make Sites Easier to Maintain', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'blog/reusable-sections/' ), 'image' => 'assets/images/portfolio/article-sections.svg', 'excerpt' => __( 'A compact guide to component thinking for teams that need a polished site they can keep current.', 'nolan-young-template' ) ),
		array( 'tag' => __( 'Support', 'nolan-young-template' ), 'title' => __( 'A Calm Launch Checklist for WordPress Projects', 'nolan-young-template' ), 'url' => nolan_young_template_page_url( 'blog/wordpress-launch-checklist/' ), 'image' => 'assets/images/portfolio/article-launch.svg', 'excerpt' => __( 'The checks that help reduce surprises before a new service website goes live.', 'nolan-young-template' ) ),
	);
}

function nolan_young_template_faqs() {
	return array(
		array( 'q' => __( 'How does a project usually start?', 'nolan-young-template' ), 'a' => __( 'Northstar Websites starts with a focused discovery conversation about goals, audiences, content, current pain points, and what the website needs to help visitors do.', 'nolan-young-template' ) ),
		array( 'q' => __( 'Can an existing WordPress site be improved instead of rebuilt?', 'nolan-young-template' ), 'a' => __( 'Yes. Some projects are targeted improvements to structure, content, forms, accessibility, or design consistency rather than a full rebuild.', 'nolan-young-template' ) ),
		array( 'q' => __( 'What information is useful before requesting a quote?', 'nolan-young-template' ), 'a' => __( 'Useful context includes your primary services, important pages, examples of sites you admire, current content status, preferred timeline, and any tools the site must support.', 'nolan-young-template' ) ),
		array( 'q' => __( 'Do you create content?', 'nolan-young-template' ), 'a' => __( 'The theme is structured to support clear service content. Project work can include content planning, page outlines, and editing guidance without inventing unsupported business claims.', 'nolan-young-template' ) ),
		array( 'q' => __( 'Will the site work on mobile devices?', 'nolan-young-template' ), 'a' => __( 'Layouts, navigation, forms, cards, and footer sections are designed mobile-first so the experience remains usable on small screens.', 'nolan-young-template' ) ),
		array( 'q' => __( 'What happens after launch?', 'nolan-young-template' ), 'a' => __( 'Launch support can include handoff notes, editor guidance, small follow-up adjustments, and recommendations for responsible ongoing maintenance.', 'nolan-young-template' ) ),
		array( 'q' => __( 'How are contact and newsletter submissions handled?', 'nolan-young-template' ), 'a' => __( 'Submissions are stored privately in WordPress admin areas with nonce validation, sanitization, exports, and owner notification support.', 'nolan-young-template' ) ),
	);
}

function nolan_young_template_card_image( $path, $alt = '' ) {
	printf(
		'<img src="%1$s" alt="%2$s" loading="lazy" decoding="async">',
		nolan_young_template_asset_url( $path ),
		esc_attr( $alt )
	);
}

function nolan_young_template_render_service_cards() {
	echo '<div class="card-grid card-grid--services">';
	foreach ( nolan_young_template_services() as $service ) {
		echo '<article class="service-card" id="' . esc_attr( $service['key'] ) . '">';
		echo '<div class="service-card__media">';
		nolan_young_template_card_image( $service['image'], $service['title'] );
		echo '</div><div class="service-card__body">';
		echo '<h3>' . esc_html( $service['title'] ) . '</h3>';
		echo '<p>' . esc_html( $service['excerpt'] ) . '</p>';
		echo '<a class="btn btn-text" href="' . esc_url( $service['url'] ) . '">' . esc_html__( 'Explore service', 'nolan-young-template' ) . '</a>';
		echo '</div></article>';
	}
	echo '</div>';
}

function nolan_young_template_render_work_filter( $id = 'featured-work-filter' ) {
	$categories = array( 'Strategy', 'Design', 'Development', 'Integration', 'Support', 'Results' );
	echo '<section class="section section--soft portfolio-filter" aria-labelledby="' . esc_attr( $id ) . '-title">';
	echo '<div class="container"><div class="section-heading"><p class="eyebrow">' . esc_html__( 'Work in focus', 'nolan-young-template' ) . '</p><h2 id="' . esc_attr( $id ) . '-title">' . esc_html__( 'Filter examples by the kind of progress you need.', 'nolan-young-template' ) . '</h2></div>';
	echo '<div class="portfolio-filter__controls" role="list" aria-label="' . esc_attr__( 'Filter featured work', 'nolan-young-template' ) . '"><button class="filter-button is-active" type="button" data-filter="all" aria-pressed="true">' . esc_html__( 'All', 'nolan-young-template' ) . '</button>';
	foreach ( $categories as $category ) {
		echo '<button class="filter-button" type="button" data-filter="' . esc_attr( $category ) . '" aria-pressed="false">' . esc_html( $category ) . '</button>';
	}
	echo '</div><div class="portfolio-filter__grid">';
	foreach ( nolan_young_template_work_items() as $item ) {
		echo '<article class="work-card" data-category="' . esc_attr( $item['category'] ) . '">';
		echo '<div class="work-card__media">';
		nolan_young_template_card_image( $item['image'], $item['title'] );
		echo '</div><div class="work-card__content"><p class="eyebrow">' . esc_html( $item['category'] ) . '</p><h3>' . esc_html( $item['title'] ) . '</h3><p>' . esc_html( $item['excerpt'] ) . '</p><a class="btn btn-text" href="' . esc_url( $item['url'] ) . '">' . esc_html__( 'View work detail', 'nolan-young-template' ) . '</a></div></article>';
	}
	echo '</div></div></section>';
}

function nolan_young_template_render_faqs( $heading = '' ) {
	$heading = $heading ? $heading : __( 'Questions businesses ask before starting.', 'nolan-young-template' );
	echo '<section class="section faq-section" aria-labelledby="faq-title"><div class="container"><div class="section-heading"><p class="eyebrow">' . esc_html__( 'FAQ', 'nolan-young-template' ) . '</p><h2 id="faq-title">' . esc_html( $heading ) . '</h2></div><div class="accordion" data-accordion>';
	foreach ( nolan_young_template_faqs() as $index => $faq ) {
		$panel_id = 'faq-panel-' . absint( $index );
		echo '<div class="accordion__item"><button class="accordion__trigger" type="button" aria-expanded="false" aria-controls="' . esc_attr( $panel_id ) . '">' . esc_html( $faq['q'] ) . '<span aria-hidden="true">+</span></button><div id="' . esc_attr( $panel_id ) . '" class="accordion__panel" hidden><p>' . esc_html( $faq['a'] ) . '</p></div></div>';
	}
	echo '</div></div></section>';
}
