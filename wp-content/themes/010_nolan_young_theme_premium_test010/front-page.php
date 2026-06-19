<?php
/*
Template Name: Front Page Template
*/
get_header();
?>
<main id="primary" class="site-main">
    <section class="hero-section">
        <h1>Grow Your Business with Us</h1>
        <p>We specialize in modern WordPress design and development services.</p>
        <div class="cta-buttons">
            <a href="/services/" class="btn btn-primary">Our Services</a>
            <a href="/contact/" class="btn btn-secondary">Get Started</a>
        </div>
    </section>

    <section class="featured-work-strip">
        <?php
        $work_posts = new WP_Query(array(
            'post_type' => 'work',
            'posts_per_page' => 3,
            'orderby' => 'date',
            'order' => 'DESC'
        ));
        while ($work_posts->have_posts()) : $work_posts->the_post();
            ?>
            <div class="work-item">
                <?php if (has_post_thumbnail()) {
                    the_post_thumbnail('large');
                } else { ?>
                    <img src="/assets/images/placeholder.svg" alt="Placeholder">
                <?php } ?>
                <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
            </div>
        <?php endwhile; wp_reset_postdata(); ?>
    </section>

    <section class="brand-statement">
        <h2>Our Mission</h2>
        <p>We are dedicated to helping businesses grow with custom WordPress solutions.</p>
    </section>

    <section class="services-overview">
        <?php
        $service_posts = new WP_Query(array(
            'post_type' => 'service',
            'posts_per_page' => 6,
            'orderby' => 'date',
            'order' => 'DESC'
        ));
        while ($service_posts->have_posts()) : $service_posts->the_post();
            ?>
            <div class="service-card">
                <?php if (has_post_thumbnail()) {
                    the_post_thumbnail('thumbnail');
                } else { ?>
                    <img src="/assets/images/placeholder.svg" alt="Placeholder">
                <?php } ?>
                <h3><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
            </div>
        <?php endwhile; wp_reset_postdata(); ?>
    </section>

    <section class="signature-process">
        <h2>Our Process</h2>
        <p>We take you through a comprehensive journey from inquiry to support and follow-up.</p>
    </section>

    <section class="featured-work-filter">
        <?php include('template-parts/featured-work-filter.php'); ?>
    </section>

    <section class="featured-case-study">
        <h2>Case Study</h2>
        <div class="case-study-content">
            <img src="/assets/images/case-study-image.jpg" alt="Case Study Image">
            <p>Challenge: [Describe the challenge]<br>Solution: [Describe the solution]<br>Outcome: [Describe the outcome]</p>
        </div>
    </section>

    <section class="before-and-after">
        <?php include('template-parts/before-after.php'); ?>
    </section>

    <section class="packages-and-engagement-options">
        <h2>Engagement Options</h2>
        <div class="option-cards">
            <div class="option-card">
                <h3>Basic Package</h3>
                <p>[Description of the package]</p>
            </div>
            <div class="option-card">
                <h3>Standard Package</h3>
                <p>[Description of the package]</p>
            </div>
            <div class="option-card">
                <h3>Premium Package</h3>
                <p>[Description of the package]</p>
            </div>
        </div>
    </section>

    <section class="business-solutions-feature">
        <h2>Business Solutions</h2>
        <p>[Describe a focused solution area]</p>
    </section>

    <section class="customer-experience-feature">
        <h2>Your Experience with Us</h2>
        <p>[Explain what customers can expect before, during, and after working with the company]</p>
    </section>

    <section class="testimonials-and-proof">
        <?php
        $testimonial_posts = new WP_Query(array(
            'post_type' => 'testimonial',
            'posts_per_page' => 3,
            'orderby' => 'date',
            'order' => 'DESC'
        ));
        while ($testimonial_posts->have_posts()) : $testimonial_posts->the_post();
            ?>
            <div class="testimonial-item">
                <img src="/assets/images/testimonial-image.jpg" alt="Testimonial Image">
                <p><?php the_content(); ?></p>
                <h4><?php the_title(); ?> - <?php echo get_post_meta(get_the_ID(), 'client_company', true); ?></h4>
            </div>
        <?php endwhile; wp_reset_postdata(); ?>
    </section>

    <section class="blog-preview">
        <?php
        $blog_posts = new WP_Query(array(
            'post_type' => 'post',
            'posts_per_page' => 4,
            'orderby' => 'date',
            'order' => 'DESC'
        ));
        while ($blog_posts->have_posts()) : $blog_posts->the_post();
            ?>
            <div class="blog-card">
                <?php if (has_post_thumbnail()) {
                    the_post_thumbnail('thumbnail');
                } else { ?>
                    <img src="/assets/images/placeholder.svg" alt="Placeholder">
                <?php } ?>
                <h4><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h4>
                <p><?php echo wp_trim_words(get_the_excerpt(), 20); ?></p>
            </div>
        <?php endwhile; wp_reset_postdata(); ?>
    </section>

    <section class="faq">
        <h2>Frequently Asked Questions</h2>
        <div class="accordion">
            <!-- FAQ items go here -->
        </div>
    </section>

    <section class="final-cta">
        <p>Ready to take the next step?</p>
        <a href="/contact/" class="btn btn-primary">Contact Us</a>
        <a href="/work/" class="btn btn-secondary">View Our Work</a>
    </section>
</main>

<?php get_footer(); ?>
