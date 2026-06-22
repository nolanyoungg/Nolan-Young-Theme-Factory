<?php
/**
 * The template for displaying the front page.
 *
 * @package Northstar_Websites_Premium_Theme
 */
get_header();

?>

<main id="main" class="site-main">
    <section class="hero">
        <div class="container">
            <h1>We Build Websites that Help Businesses Grow</h1>
            <p>Northstar Websites is a WordPress development company specializing in modern design, build, and support services.</p>
            <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" class="btn btn-primary">Let's Get Started</a>
        </div>
    </section>

    <section class="services-section">
        <div class="container">
            <h2>Our Services</h2>
            <?php
                $services = get_pages( array(
                    'parent' => 0,
                    'post_type' => 'page',
                    'orderby' => 'title',
                    'order' => 'ASC'
                ) );

                foreach ( $services as $service ) {
                    echo '<div class="service-card">';
                    echo '<h3>' . esc_html( $service->post_title ) . '</h3>';
                    echo '<p>' . esc_html( get_the_excerpt( $service->ID ) ) . '</p>';
                    echo '<a href="' . esc_url( get_permalink( $service->ID ) ) . '" class="btn btn-secondary">Learn More</a>';
                    echo '</div>';
                }
            ?>
        </div>
    </section>

    <section class="about-section">
        <div class="container">
            <h2>About Us</h2>
            <p>We are a team of experienced WordPress developers dedicated to helping businesses achieve their online goals.</p>
            <a href="<?php echo esc_url( home_url( '/about/' ) ); ?>" class="btn btn-primary">Meet the Team</a>
        </div>
    </section>

    <section class="work-section">
        <div class="container">
            <h2>Our Work</h2>
            <?php
                $recent_work = get_posts( array(
                    'post_type' => 'work',
                    'numberposts' => 3,
                    'post_status' => 'publish'
                ) );

                foreach ( $recent_work as $work ) {
                    echo '<div class="work-card">';
                    echo '<a href="' . esc_url( get_permalink( $work->ID ) ) . '">';
                    echo '<img src="' . esc_url( get_the_post_thumbnail_url( $work->ID, 'large' ) ) . '" alt="' . esc_attr( get_the_title( $work->ID ) ) . '">';
                    echo '</a>';
                    echo '<h3>' . esc_html( $work->post_title ) . '</h3>';
                    echo '<p>' . esc_html( wp_trim_words( $work->post_content, 15, '...' ) ) . '</p>';
                    echo '</div>';
                }
            ?>
        </div>
    </section>

    <section class="blog-section">
        <div class="container">
            <h2>From Our Blog</h2>
            <?php
                $recent_posts = wp_get_recent_posts( array(
                    'numberposts' => 3,
                    'post_status' => 'publish'
                ) );

                foreach ( $recent_posts as $post ) {
                    echo '<div class="blog-card">';
                    echo '<a href="' . esc_url( get_permalink( $post['ID'] ) ) . '">';
                    echo '<h3>' . esc_html( $post['post_title'] ) . '</h3>';
                    echo '<p>' . esc_html( wp_trim_words( $post['post_content'], 20, '...' ) ) . '</p>';
                    echo '</a>';
                    echo '</div>';
                }
            ?>
        </div>
    </section>
</main><!-- #main -->

<?php
get_footer();
?>
