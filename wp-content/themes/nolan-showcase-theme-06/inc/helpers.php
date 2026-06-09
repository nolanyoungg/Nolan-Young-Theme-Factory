<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_theme_defaults() {
	return array(
		'brand' => array(
			'name'        => 'Northstar Web Works',
			'title'       => 'Strategic WordPress sites for teams that need a polished launch, clear content, and dependable maintenance.',
			'lede'        => 'We design and build local-first websites with responsive layouts, practical automation, and a calm delivery workflow so each release feels deliberate and client-ready.',
			'primary_cta' => array(
				'label' => 'Start a project',
				'url'   => '#contact',
			),
			'secondary_cta' => array(
				'label' => 'View services',
				'url'   => '#services',
			),
		),
		'featured_work' => array(
			array(
				'title'       => 'Northstar Launch Site',
				'category'    => 'Website launch',
				'description' => 'A conversion-focused company site with a structured homepage, service depth, and a clear path to inquiry.',
				'image'       => 'assets/images/portfolio/portfolio-mercer.svg',
				'alt'         => 'Structured launch site mockup with layered interface panels and a data-forward composition.',
			),
			array(
				'title'       => 'Atlas Support Hub',
				'category'    => 'Client portal',
				'description' => 'A service dashboard concept focused on support requests, maintenance plans, and reporting clarity.',
				'image'       => 'assets/images/portfolio/portfolio-coast.svg',
				'alt'         => 'Portal concept with modular cards, status indicators, and a calm dashboard layout.',
			),
			array(
				'title'       => 'Pulse Analytics Refresh',
				'category'    => 'Conversion redesign',
				'description' => 'A cleaner analytics-led marketing site with stronger hierarchy, better scanning, and more persuasive calls to action.',
				'image'       => 'assets/images/portfolio/portfolio-bloom.svg',
				'alt'         => 'Redesign concept with bold call-to-action placement and analytics-style panels.',
			),
		),
		'services' => array(
			array(
				'title'       => 'Strategy & Discovery',
				'price'       => 'From $1,200',
				'description' => 'Project scoping, information architecture, content priorities, and a practical roadmap for the build.',
			),
			array(
				'title'       => 'WordPress Builds',
				'price'       => 'From $4,800',
				'description' => 'Classic theme development, local assets, responsive templates, and a production-ready front end.',
			),
			array(
				'title'       => 'Maintenance & Support',
				'price'       => 'Custom quote',
				'description' => 'Regular updates, content tweaks, performance checks, and a steady support lane after launch.',
			),
			array(
				'title'       => 'Content & Launch Systems',
				'price'       => 'From $950',
				'description' => 'Reusable page sections, launch checklists, and content patterns that keep future edits efficient.',
			),
		),
		'process' => array(
			array(
				'title'       => '1. Discovery',
				'description' => 'We align on goals, audience, site structure, and the practical constraints that shape the work.',
			),
			array(
				'title'       => '2. Build',
				'description' => 'We create the theme, content system, and responsive layout with accessible defaults and local assets.',
			),
			array(
				'title'       => '3. Launch',
				'description' => 'We package, validate, and hand off a site that is ready for WordPress installation and ongoing updates.',
			),
		),
		'testimonials' => array(
			array(
				'quote'  => 'Northstar delivered a site that feels composed, fast, and immediately trustworthy. The handoff was unusually clear.',
				'name'   => 'Mira Chen',
				'role'   => 'Founder, Lumen Home',
			),
			array(
				'quote'  => 'The new homepage finally explains what we do without sounding generic. It reads like a real company, not a template.',
				'name'   => 'Alec and Naomi',
				'role'   => 'Operations team',
			),
			array(
				'quote'  => 'Our maintenance backlog is now organized, visible, and easier to manage. The workflow feels durable, not improvised.',
				'name'   => 'Priya and Jonas',
				'role'   => 'Product leads',
			),
		),
		'journal' => array(
			array(
				'title' => 'How to brief a website when you need fewer revisions and faster approvals',
				'date'  => 'June 2026',
				'term'  => 'Project notes',
			),
			array(
				'title' => 'What to include in a launch checklist before a WordPress handoff',
				'date'  => 'May 2026',
				'term'  => 'Launch planning',
			),
			array(
				'title' => 'Why content hierarchy matters more than another decorative effect',
				'date'  => 'April 2026',
				'term'  => 'Design systems',
			),
		),
		'pillars' => array(
			array(
				'title'       => 'Clarity first',
				'description' => 'We prioritize hierarchy, copy flow, and a layout that helps visitors understand the business quickly.',
			),
			array(
				'title'       => 'Reliable delivery',
				'description' => 'We keep the workflow measurable, versioned, and easy to validate before a release goes live.',
			),
			array(
				'title'       => 'Practical craft',
				'description' => 'We use local assets, reusable sections, and direct implementation choices that are easy to maintain.',
			),
		),
		'policies' => array(
			array(
				'title'   => 'Scope',
				'content' => 'A short discovery phase and written scope keep the project focused and reduce change-order drift.',
			),
			array(
				'title'   => 'Revisions',
				'content' => 'Reasonable revision rounds are included during build and launch so the site can be polished without losing momentum.',
			),
			array(
				'title'   => 'Asset use',
				'content' => 'All local illustrations, icons, and patterns are packaged for the generated theme and remain self-contained.',
			),
			array(
				'title'   => 'Privacy',
				'content' => 'Client information is used only for project communication, delivery, and accounting purposes.',
			),
		),
	);
}

function nolan_theme_mod( $key, $default = '' ) {
	$value = get_theme_mod( $key, $default );
	return is_string( $value ) && $value !== '' ? $value : $default;
}

function nolan_asset_uri( $relative_path ) {
	return get_theme_file_uri( ltrim( $relative_path, '/' ) );
}

function nolan_get_studio_brand() {
	$defaults = nolan_theme_defaults();
	return array(
		'name'            => nolan_theme_mod( 'nolan_brand_name', $defaults['brand']['name'] ),
		'title'           => nolan_theme_mod( 'nolan_hero_title', $defaults['brand']['title'] ),
		'lede'            => nolan_theme_mod( 'nolan_hero_lede', $defaults['brand']['lede'] ),
		'primary_label'   => nolan_theme_mod( 'nolan_primary_cta_label', $defaults['brand']['primary_cta']['label'] ),
		'primary_url'     => nolan_theme_mod( 'nolan_primary_cta_url', $defaults['brand']['primary_cta']['url'] ),
		'secondary_label' => nolan_theme_mod( 'nolan_secondary_cta_label', $defaults['brand']['secondary_cta']['label'] ),
		'secondary_url'   => nolan_theme_mod( 'nolan_secondary_cta_url', $defaults['brand']['secondary_cta']['url'] ),
	);
}

function nolan_get_fallback_items( $key ) {
	$defaults = nolan_theme_defaults();
	return isset( $defaults[ $key ] ) ? $defaults[ $key ] : array();
}

function nolan_policy_pages() {
	return array(
		'privacy-policy'   => 'Privacy Policy',
		'terms-conditions' => 'Terms & Conditions',
		'cookie-policy'    => 'Cookie Policy',
		'refund-policy'    => 'Refund Policy',
	);
}

