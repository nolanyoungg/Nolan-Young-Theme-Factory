<?php
/**
 * The Footer for our theme.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @package Northstar_Websites_Premium_Theme
 */
?>

    </div><!-- #content -->

    <footer id="colophon" class="site-footer" role="contentinfo">
        <div class="container">
            <div class="cta-band">
                <h2>We're here to help your business grow.</h2>
                <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>" class="btn btn-primary">Let's Talk</a>
            </div>

            <div class="footer-content">
                <div class="services-column">
                    <h3>Services</h3>
                    <ul>
                        <?php
                            $services = get_pages( array(
                                'parent' => 0,
                                'post_type' => 'page',
                                'orderby' => 'title',
                                'order' => 'ASC'
                            ) );

                            foreach ( $services as $service ) {
                                echo '<li><a href="' . esc_url( get_permalink( $service->ID ) ) . '">' . esc_html( $service->post_title ) . '</a></li>';
                            }
                        ?>
                    </ul>
                </div>

                <div class="company-column">
                    <h3>Company</h3>
                    <ul>
                        <li><a href="<?php echo esc_url( home_url( '/about/' ) ); ?>">About Us</a></li>
                        <li><a href="<?php echo esc_url( home_url( '/work/' ) ); ?>">Our Work</a></li>
                        <li><a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>">Blog</a></li>
                        <li><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact</a></li>
                    </ul>
                </div>

                <div class="blog-column">
                    <h3>Recent Posts</h3>
                    <?php
                        $recent_posts = wp_get_recent_posts( array(
                            'numberposts' => 4,
                            'post_status' => 'publish'
                        ) );

                        foreach ( $recent_posts as $post ) {
                            echo '<div class="blog-card">';
                            echo '<a href="' . esc_url( get_permalink( $post['ID'] ) ) . '">';
                            echo '<h4>' . esc_html( $post['post_title'] ) . '</h4>';
                            echo '<p>' . esc_html( wp_trim_words( $post['post_content'], 10, '...' ) ) . '</p>';
                            echo '</a>';
                            echo '</div>';
                        }
                    ?>
                </div>
            </div>

            <div class="contact-block">
                <h3>Contact Us</h3>
                <address>123 Main Street, Anytown, USA<br><a href="mailto:contact@northstarwebsites.com">contact@northstarwebsites.com</a></address>
            </div>

            <div class="legal-row">
                &copy; <?php echo date('Y'); ?> Northstar Websites. All rights reserved.
                <nav class="legal-nav">
                    <ul>
                        <li><a href="<?php echo esc_url( home_url( '/privacy-policy/' ) ); ?>">Privacy Policy</a></li>
                        <li><a href="<?php echo esc_url( home_url( '/terms-of-service/' ) ); ?>">Terms of Service</a></li>
                    </ul>
                </nav>
            </div>
        </div><!-- .container -->
    </footer><!-- #colophon -->

<?php wp_footer(); ?>

</body>
</html>
