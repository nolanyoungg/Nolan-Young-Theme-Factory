<?php
/**
 * The Footer for our theme.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @package NOLAN-YOUNG Theme
 */
?>

    </div><!-- #content -->

    <footer id="colophon" class="site-footer">
        <div class="container">
            <div class="footer-content">
                <?php get_template_part( 'template-parts/content-footer-widgets' ); ?>
                <?php get_template_part( 'template-parts/content-legal' ); ?>
            </div>
        </div><!-- .container -->
    </footer><!-- #colophon -->

</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
