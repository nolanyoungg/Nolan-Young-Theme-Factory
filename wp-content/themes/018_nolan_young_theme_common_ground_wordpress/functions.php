<?php
/** Common Ground classic theme integration. */
defined( 'ABSPATH' ) || exit;

function cground_setup() {
    load_theme_textdomain( '018_nolan_young_theme_common_ground_wordpress', get_template_directory() );
    add_theme_support( 'title-tag' );
    add_theme_support( 'automatic-feed-links' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
    register_nav_menus( array(
        'primary' => __( 'Primary navigation', '018_nolan_young_theme_common_ground_wordpress' ),
        'footer'  => __( 'Footer navigation', '018_nolan_young_theme_common_ground_wordpress' ),
    ) );
}
add_action( 'after_setup_theme', 'cground_setup' );

function cground_enqueue_assets() {
    $version = wp_get_theme()->get( 'Version' );
    wp_enqueue_style( 'cground-site', get_theme_file_uri( '/assets/css/bundle.css' ), array(), $version );
    wp_enqueue_style( 'cground-wordpress', get_theme_file_uri( '/assets/css/wordpress.css' ), array( 'cground-site' ), $version );
    wp_enqueue_script( 'cground-site', get_theme_file_uri( '/assets/js/bundle.js' ), array(), $version, true );
}
add_action( 'wp_enqueue_scripts', 'cground_enqueue_assets' );

/** Optional editor starting points; registering patterns never creates pages. */
function cground_register_patterns() {
    register_block_pattern_category( 'cground', array( 'label' => __( 'Common Ground layouts', '018_nolan_young_theme_common_ground_wordpress' ) ) );
    $designs = array(
        'home' => 'Home', 'about-us' => 'Studio', 'services' => 'Services',
        'work' => 'Work', 'blog' => 'Journal', 'policy' => 'Privacy',
        'single-service' => 'Renovations',
    );
    foreach ( $designs as $design => $label ) {
        ob_start();
        get_template_part( 'template-parts/design', $design );
        $content = ob_get_clean();
        register_block_pattern( 'cground/' . $design, array(
            'title' => 'Common Ground — ' . $label,
            'categories' => array( 'cground' ),
            'postTypes' => array( 'page' ),
            'description' => __( 'Original layout in an editable Custom HTML block. Edit its copy while keeping the layout classes and anchors.', '018_nolan_young_theme_common_ground_wordpress' ),
            'content' => '<!-- wp:html -->' . $content . '<!-- /wp:html -->',
        ) );
    }
}
add_action( 'init', 'cground_register_patterns' );

/** Fixed defaults use the same paths as the selected sample's WordPress routes. */
function cground_menu_links( $footer = false ) {
    $links = array(
        'work' => array( '/work/', 'Work', 'work' ),
        'about' => array( '/about/', 'Studio', 'about-us' ),
        'services' => array( '/services/', 'Services', 'services' ),
        'blog' => array( '/blog/', 'Journal', 'blog' ),
        'contact' => array( '/contact/', $footer ? 'Contact' : 'Start a project', 'contact' ),
    );
    if ( $footer ) {
        $links = array( 'home' => array( '/', 'Home', '' ) ) + $links;
        $contact = $links['contact'];
        unset( $links['contact'] );
        $links['renovations'] = array( '/services/featured/', 'Renovations', 'single-service' );
        $links['contact'] = $contact;
        $links['privacy'] = array( '/privacy-policy/', 'Privacy', 'policy' );
    }
    foreach ( $links as $key => $link ) {
        $current = 'home' === $key ? is_front_page() : is_page_template( 'page-templates/template-' . $link[2] . '.php' );
        if ( ! $footer && 'services' === $key && is_page_template( 'page-templates/template-single-service.php' ) ) {
            $current = true;
        }
        echo '<a href="' . esc_url( home_url( $link[0] ) ) . '"';
        if ( $current ) {
            echo ' aria-current="page"';
        }
        if ( ! $footer && 'contact' === $key ) {
            echo ' class="nav-cta"';
        }
        echo '>' . esc_html( $link[1] );
        if ( ! $footer && 'contact' === $key ) {
            echo ' <span aria-hidden="true">↗</span>';
        }
        echo '</a>';
    }
}

function cground_primary_fallback() {
    cground_menu_links();
}

function cground_footer_fallback() {
    cground_menu_links( true );
}

/** Keep the original contact-button treatment for assigned WordPress menus. */
function cground_menu_link_attributes( $atts, $item, $args ) {
    if ( isset( $args->theme_location ) && 'primary' === $args->theme_location && isset( $atts['href'] )
        && untrailingslashit( $atts['href'] ) === untrailingslashit( home_url( '/contact/' ) ) ) {
        $atts['class'] = isset( $atts['class'] ) ? $atts['class'] . ' nav-cta' : 'nav-cta';
    }
    return $atts;
}
add_filter( 'nav_menu_link_attributes', 'cground_menu_link_attributes', 10, 3 );

/** An empty page retains the designed content; editor content replaces its body. */
function cground_render_design( $design ) {
    $allowed = array( 'home', 'about-us', 'services', 'work', 'blog', 'contact', 'policy', 'single-service' );
    if ( ! in_array( $design, $allowed, true ) ) {
        return;
    }
    echo '<main id="main">';
    $rendered = false;
    if ( is_page() ) {
        while ( have_posts() ) {
            the_post();
            $rendered = true;
            if ( post_password_required() || '' !== trim( (string) get_post_field( 'post_content', get_the_ID() ) ) ) {
                get_template_part( 'template-parts/content', 'designed' );
            } else {
                get_template_part( 'template-parts/design', $design );
            }
        }
    }
    if ( ! $rendered ) {
        get_template_part( 'template-parts/design', $design );
    }
    echo '</main>';
}
