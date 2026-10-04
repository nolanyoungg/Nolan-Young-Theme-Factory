<?php
/** Classic fallback for posts, archives, searches, and single posts. */
defined( 'ABSPATH' ) || exit;
get_header();
?>
<main id="main" class="wrap space-bottom">
<?php if ( have_posts() ) : ?>
    <?php if ( ! is_singular() ) : ?>
        <header class="page-heading"><h1><?php
        if ( is_search() ) {
            printf( esc_html__( 'Search results for: %s', '018_nolan_young_theme_common_ground_wordpress' ), esc_html( get_search_query() ) );
        } elseif ( is_archive() ) {
            the_archive_title();
        } else {
            esc_html_e( 'Journal', '018_nolan_young_theme_common_ground_wordpress' );
        }
        ?></h1></header>
    <?php endif; ?>
    <?php while ( have_posts() ) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class( 'section' ); ?>>
            <?php if ( is_singular() ) : ?>
                <header class="section-head"><h1><?php the_title(); ?></h1></header>
            <?php else : ?>
                <header class="section-head"><h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2></header>
            <?php endif; ?>
            <div class="entry-content">
                <?php
                if ( is_singular() ) {
                    the_content();
                    wp_link_pages();
                } else {
                    the_excerpt();
                }
                ?>
            </div>
        </article>
    <?php endwhile; ?>
    <?php if ( is_singular( 'post' ) ) { the_post_navigation(); } else { the_posts_pagination(); } ?>
<?php else : ?>
    <div class="page-heading"><h1><?php esc_html_e( 'Nothing here yet.', '018_nolan_young_theme_common_ground_wordpress' ); ?></h1><p class="lede"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Return home', '018_nolan_young_theme_common_ground_wordpress' ); ?></a></p></div>
<?php endif; ?>
</main>
<?php get_footer(); ?>
