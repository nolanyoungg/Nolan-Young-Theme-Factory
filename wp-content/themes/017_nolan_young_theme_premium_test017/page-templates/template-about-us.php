<?php
/**
 * Template Name: About Us
 */
get_header(); ?>

?>
<section class="about-section">
    <div class="container">
        <h1>About Northstar Websites</h1>
        <p>Welcome to Northstar Websites, where we craft modern and intuitive websites that help businesses grow. Our team of experts specializes in WordPress design, build, and support services.</p>

        <h2>Our Mission</h2>
        <p>We believe that every business deserves a website that showcases their unique brand and drives growth. Our mission is to provide exceptional web solutions tailored to meet the needs of our clients.</p>

        <h2>Our Team</h2>
        <div class="team-members">
            <div class="member">
                <img src="<?php echo get_template_directory_uri(); ?>/assets/images/team-member1.jpg" alt="Team Member 1">
                <h3>Jane Doe</h3>
                <p>Lead Developer</p>
            </div>
            <div class="member">
                <img src="<?php echo get_template_directory_uri(); ?>/assets/images/team-member2.jpg" alt="Team Member 2">
                <h3>John Smith</h3>
                <p>Project Manager</p>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
