<?php
/**
 * Template Part for Featured Work Section
 *
 * @package 010_nolan_young_theme_premium_test010
 */

?>
<section class="featured-work">
    <div class="container">
        <h2>Featured Projects</h2>
        <div class="work-previews">
            <a href="<?php echo esc_url(home_url('/work/project1/')); ?>" class="work-preview">
                <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/project1.jpg'); ?>" alt="Project 1">
                <h3>Project 1</h3>
                <p>A brief description of Project 1.</p>
            </a>
            <a href="<?php echo esc_url(home_url('/work/project2/')); ?>" class="work-preview">
                <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/project2.jpg'); ?>" alt="Project 2">
                <h3>Project 2</h3>
                <p>A brief description of Project 2.</p>
            </a>
            <a href="<?php echo esc_url(home_url('/work/project3/')); ?>" class="work-preview">
                <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/project3.jpg'); ?>" alt="Project 3">
                <h3>Project 3</h3>
                <p>A brief description of Project 3.</p>
            </a>
        </div>
    </div>
</section>
