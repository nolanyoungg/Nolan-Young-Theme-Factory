<?php
/**
 * Template part for displaying the featured work section on the homepage.
 *
 * @link #
 *
 * @package NOLAN-YOUNG-theme-000
 */
?>

<div class="featured-work-section">
    <div class="container">
        <h2>Featured Work</h2>
        <div class="work-items">
            <!-- Placeholder for featured work items -->
            <div class="work-item">
                <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/portfolio/work-item-1.jpg'); ?>" alt="Work Item 1" loading="lazy">
                <h3>Project Title 1</h3>
                <p>A brief description of the project.</p>
                <a href="/work/project-title-1/" class="btn btn-text">View Project</a>
            </div>
            <div class="work-item">
                <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/portfolio/work-item-2.jpg'); ?>" alt="Work Item 2" loading="lazy">
                <h3>Project Title 2</h3>
                <p>A brief description of the project.</p>
                <a href="/work/project-title-2/" class="btn btn-text">View Project</a>
            </div>
            <!-- Add more work items as needed -->
        </div>
    </div>
</div>