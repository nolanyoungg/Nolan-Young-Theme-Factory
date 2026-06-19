<?php
header('HTTP/1.1 403 Forbidden');
get_header();
?>

<main id="primary" class="site-main">
    <header class="page-header">
        <h1><?php esc_html_e( 'Forbidden', 'textdomain' ); ?></h1>
    </header>

    <div class="page-content">
        <p><?php esc_html_e( 'You do not have permission to access this page.', 'textdomain' ); ?></p>
    </div>
</main>

<?php get_footer(); ?>