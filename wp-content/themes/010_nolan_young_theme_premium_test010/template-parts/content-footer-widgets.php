<?php
/**
 * Template Part for Footer Widgets Section
 *
 * @package 010_nolan_young_theme_premium_test010
 */

?>
<section class="footer-widgets">
    <div class="container">
        <div class="widget-area">
            <?php if (is_active_sidebar('footer-1')) : dynamic_sidebar('footer-1'); endif; ?>
        </div>
        <div class="widget-area">
            <?php if (is_active_sidebar('footer-2')) : dynamic_sidebar('footer-2'); endif; ?>
        </div>
        <div class="widget-area">
            <?php if (is_active_sidebar('footer-3')) : dynamic_sidebar('footer-3'); endif; ?>
        </div>
    </div>
</section>
