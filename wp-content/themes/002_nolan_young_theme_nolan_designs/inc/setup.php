<?php
/**
 * Theme setup.
 *
 * @package NolanYoungThemeTemplate01
 */

defined( 'ABSPATH' ) || exit;

/**
 * Configure theme features and register navigation locations.
 *
 * @return void
 */
function nytt01_setup() {
	load_theme_textdomain(
		'nolan-young-theme-template-01',
		get_template_directory() . '/languages'
	);

	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'appearance-tools' );
	add_theme_support( 'customize-selective-refresh-widgets' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/editor.css' );

	add_theme_support(
		'html5',
		array(
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
			'navigation-widgets',
			'search-form',
		)
	);

	add_theme_support(
		'custom-logo',
		array(
			'height'      => 80,
			'width'       => 280,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);

	register_nav_menus(
		array(
			'primary' => esc_html__( 'Primary Navigation', 'nolan-young-theme-template-01' ),
			'footer'  => esc_html__( 'Footer Navigation', 'nolan-young-theme-template-01' ),
		)
	);

	add_image_size( 'nytt01-card', 720, 480, true );
}
add_action( 'after_setup_theme', 'nytt01_setup' );

/**
 * Set the default content width used by WordPress embeds and media.
 *
 * @return void
 */
function nytt01_set_content_width() {
	$GLOBALS['content_width'] = (int) apply_filters( 'nytt01_content_width', 760 );
}
add_action( 'after_setup_theme', 'nytt01_set_content_width', 0 );

/**
 * Register the footer widget area.
 *
 * @return void
 */
function nytt01_register_sidebars() {
	register_sidebar(
		array(
			'name'          => esc_html__( 'Footer Widgets', 'nolan-young-theme-template-01' ),
			'id'            => 'footer-widgets',
			'description'   => esc_html__( 'Widgets displayed in the site footer.', 'nolan-young-theme-template-01' ),
			'before_widget' => '<section id="%1$s" class="nytt01-footer-widget %2$s">',
			'after_widget'  => '</section>',
			'before_title'  => '<h2 class="nytt01-footer-widget__title">',
			'after_title'   => '</h2>',
		)
	);
}
add_action( 'widgets_init', 'nytt01_register_sidebars' );

/**
 * Create and assign the default primary menu when the theme is activated.
 *
 * The menu is intentionally created through WordPress so administrators can
 * manage it later from the Menus / Navigation UI.
 *
 * @return void
 */
function nytt01_maybe_create_default_primary_menu() {
	$menu_locations = get_nav_menu_locations();

	if ( ! empty( $menu_locations['primary'] ) ) {
		return;
	}

	$menu_name = 'Primary Navigation';
	$menu      = wp_get_nav_menu_object( $menu_name );
	$menu_id   = $menu ? (int) $menu->term_id : 0;

	if ( ! $menu_id ) {
		$menu_id = (int) wp_create_nav_menu( $menu_name );
	}

	if ( ! $menu_id ) {
		return;
	}

	$existing_items = wp_get_nav_menu_items( $menu_id );

	if ( empty( $existing_items ) ) {
		foreach ( nytt01_get_default_primary_menu_items() as $menu_item ) {
			wp_update_nav_menu_item( $menu_id, 0, $menu_item );
		}
	}

	$menu_locations['primary'] = $menu_id;
	set_theme_mod( 'nav_menu_locations', $menu_locations );
}
add_action( 'after_switch_theme', 'nytt01_maybe_create_default_primary_menu' );

/**
 * Return the default primary menu item definitions.
 *
 * @return array<int, array<string, mixed>>
 */
function nytt01_get_default_primary_menu_items() {
	$menu_items = array(
		array(
			'title'    => esc_html__( 'Services', 'nolan-young-theme-template-01' ),
			'slug'     => 'services',
			'mega_key' => 'services',
		),
		array(
			'title'    => esc_html__( 'About', 'nolan-young-theme-template-01' ),
			'slug'     => 'about',
			'alt'      => 'about-us',
			'mega_key' => 'about',
		),
		array(
			'title' => esc_html__( 'Work', 'nolan-young-theme-template-01' ),
			'slug'  => 'work',
		),
		array(
			'title'          => esc_html__( 'Blog', 'nolan-young-theme-template-01' ),
			'slug'           => 'blog',
			'use_posts_page' => true,
			'mega_key'       => 'blog',
		),
	);

	$prepared_items = array();

	foreach ( $menu_items as $menu_item ) {
		$page_id = 0;

		if ( ! empty( $menu_item['use_posts_page'] ) ) {
			$page_id = (int) get_option( 'page_for_posts' );
		}

		if ( ! $page_id && ! empty( $menu_item['slug'] ) ) {
			$page = get_page_by_path( sanitize_title( $menu_item['slug'] ) );
			if ( $page ) {
				$page_id = (int) $page->ID;
			}
		}

		if ( ! $page_id && ! empty( $menu_item['alt'] ) ) {
			$page = get_page_by_path( sanitize_title( $menu_item['alt'] ) );
			if ( $page ) {
				$page_id = (int) $page->ID;
			}
		}

		if ( $page_id ) {
			$prepared_items[] = array(
				'menu-item-title'     => $menu_item['title'],
				'menu-item-object-id' => $page_id,
				'menu-item-object'    => 'page',
				'menu-item-type'      => 'post_type',
				'menu-item-status'    => 'publish',
				'menu-item-classes'   => ! empty( $menu_item['mega_key'] ) ? 'nytt01-mega-' . sanitize_html_class( $menu_item['mega_key'] ) : '',
			);

			continue;
		}

		$prepared_items[] = array(
			'menu-item-title'  => $menu_item['title'],
			'menu-item-url'    => home_url( '/' . trailingslashit( sanitize_title( $menu_item['slug'] ) ) ),
			'menu-item-type'   => 'custom',
			'menu-item-status'  => 'publish',
			'menu-item-classes' => ! empty( $menu_item['mega_key'] ) ? 'nytt01-mega-' . sanitize_html_class( $menu_item['mega_key'] ) : '',
		);
	}

	return $prepared_items;
}
