<?php get_header(); ?>

?>
<main class="site-main">
    <section class="hero-section">
        <h1>Welcome to Northstar Websites</h1>
        <p>Specializing in modern WordPress design, build, and support services.</p>
        <a href="<?php echo home_url('/contact/'); ?>" class="btn btn-primary">Let's Work Together</a>
    </section>

    <section class="about-section">
        <h2>About Us</h2>
        <p>We are a dedicated team of web developers and designers committed to helping businesses thrive online.</p>
        <a href="<?php echo home_url('/about/'); ?>" class="btn btn-secondary">Learn More</a>
    </section>

    <section class="services-section">
        <h2>Our Services</h2>
        <div class="service-cards">
            <?php
            $services = [
                'Web Design' => 'Creating visually appealing and user-friendly websites.',
                'Development' => 'Building robust, scalable web applications.',
                'SEO Optimization' => 'Improving website visibility in search engine results.',
                'Hosting Solutions' => 'Providing reliable hosting services for your online presence.',
                'Maintenance' => 'Regular updates to keep your site running smoothly.'
            ];
            foreach ($services as $title => $description) {
                echo '<div class="service-card">';
                echo '<h3>' . esc_html($title) . '</h3>';
                echo '<p>' . esc_html($description) . '</p>';
                echo '</div>';
            }
            ?>
        </div>
    </section>

    <section class="work-section">
        <h2>Our Work</h2>
        <div class="work-cards">
            <?php
            $works = [
                'Project 1' => 'A brief description of Project 1.',
                'Project 2' => 'A brief description of Project 2.',
                'Project 3' => 'A brief description of Project 3.'
            ];
            foreach ($works as $title => $description) {
                echo '<div class="work-card">';
                echo '<h3>' . esc_html($title) . '</h3>';
                echo '<p>' . esc_html($description) . '</p>';
                echo '</div>';
            }
            ?>
        </div>
    </section>

    <section class="blog-section">
        <h2>Latest from Our Blog</h2>
        <div class="blog-cards">
            <?php
            $posts = [
                'WordPress Tips' => 'Tips for using WordPress effectively.',
                'SEO Best Practices' => 'How to improve your SEO.',
                'Design Trends' => 'Current trends in web design.'
            ];
            foreach ($posts as $title => $description) {
                echo '<div class="blog-card">';
                echo '<h3>' . esc_html($title) . '</h3>';
                echo '<p>' . esc_html($description) . '</p>';
                echo '<a href="' . home_url('/blog/' . strtolower(str_replace(' ', '-', $title)) . '/') . '" class="btn btn-secondary">Read More</a>';
                echo '</div>';
            }
            ?>
        </div>
    </section>
</main>

<?php get_footer(); ?>
