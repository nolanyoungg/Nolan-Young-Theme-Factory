<section class="featured-work">
    <h2 class="section-title">Featured Projects</h2>
    <div class="work-grid">
        <?php for ($i = 0; $i < 3; $i++): ?>
            <div class="work-card">
                <img src="<?php echo get_template_directory_uri(); ?>/assets/images/placeholder.svg" alt="Project Image">
                <h3 class="work-title">Project Title</h3>
                <p class="work-description">A brief description of the project and its impact on the business.</p>
            </div>
        <?php endfor; ?>
    </div>
    <a href="#" class="secondary-button">View All Work</a>
</section>
