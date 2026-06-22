<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header">
    <div class="container">
        <div class="header-logo">
            <a href="<?php echo home_url('/'); ?>">
                <svg width="100" height="32" viewBox="0 0 100 32" xmlns="http://www.w3.org/2000/svg">
                    <text x="5" y="24" font-family="Arial, sans-serif" font-size="24" fill="#2563eb">Northstar Websites</text>
                </svg>
            </a>
        </div>

        <nav class="primary-nav">
            <button class="nav-button services" aria-controls="services-menu" aria-expanded="false">Services</button>
            <button class="nav-button about" aria-controls="about-menu" aria-expanded="false">About</button>
            <button class="nav-button blog" aria-controls="blog-menu" aria-expanded="false">Blog</button>
            <a href="<?php echo home_url('/work/'); ?>" class="nav-link work">Work</a>
        </nav>

        <div class="cta-area">
            <a href="<?php echo home_url('/contact/'); ?>" class="btn btn-header-cta">Contact Us</a>
        </div>
    </div>

    <!-- Navigation Panels -->
    <div id="services-menu" class="nolan-menu" aria-hidden="true">
        <div class="menu-rail">
            <button class="rail-item" data-target="service1">Service 1</button>
            <button class="rail-item" data-target="service2">Service 2</button>
            <button class="rail-item" data-target="service3">Service 3</button>
            <button class="rail-item" data-target="service4">Service 4</button>
            <button class="rail-item" data-target="service5">Service 5</button>
            <button class="rail-item" data-target="service6">Service 6</button>
        </div>

        <div class="menu-content">
            <!-- Content for each service will be dynamically loaded here -->
        </div>
    </div>

    <div id="about-menu" class="nolan-menu" aria-hidden="true">
        <div class="menu-rail">
            <button class="rail-item" data-target="about1">About 1</button>
            <button class="rail-item" data-target="about2">About 2</button>
            <button class="rail-item" data-target="about3">About 3</button>
        </div>

        <div class="menu-content">
            <!-- Content for each about section will be dynamically loaded here -->
        </div>
    </div>

    <div id="blog-menu" class="nolan-menu" aria-hidden="true">
        <div class="menu-rail">
            <button class="rail-item" data-target="blog1">Blog 1</button>
            <button class="rail-item" data-target="blog2">Blog 2</button>
            <button class="rail-item" data-target="blog3">Blog 3</button>
            <button class="rail-item" data-target="blog4">Blog 4</button>
        </div>

        <div class="menu-content">
            <!-- Content for each blog post will be dynamically loaded here -->
        </div>
    </div>
</header>
