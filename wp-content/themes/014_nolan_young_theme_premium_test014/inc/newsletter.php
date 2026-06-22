<?php
/**
 * Handles newsletter subscriptions and admin menu for managing subscribers.
 */

// Register custom post type for newsletters
function nolan_young_newsletter_register_post_type() {
    register_post_type('newsletter_subscriber', array(
        'labels' => array(
            'name' => __('Newsletter Subscribers', 'nolan-young-theme'),
            'singular_name' => __('Newsletter Subscriber', 'nolan-young-theme')
        ),
        'public' => false,
        'show_ui' => true,
        'supports' => array('title', 'editor'),
        'has_archive' => false,
    ));
}
add_action('init', 'nolan_young_newsletter_register_post_type');

// Handle newsletter signup
function nolan_young_handle_newsletter_signup($subscriber_data) {
    $email = sanitize_email($subscriber_data['email']);
    $name = isset($subscriber_data['name']) ? sanitize_text_field($subscriber_data['name']) : '';

    // Check for existing active subscriber with the same email
    $existing_subscriber = get_posts(array(
        'post_type' => 'newsletter_subscriber',
        'posts_per_page' => 1,
        'meta_query' => array(
            array(
                'key' => '_email',
                'value' => $email,
                'compare' => '='
            )
        )
    ));

    if (!empty($existing_subscriber)) {
        // If existing subscriber is unsubscribed, reactivate them
        if (get_post_meta($existing_subscriber[0]->ID, '_status', true) === 'Unsubscribed') {
            update_post_meta($existing_subscriber[0]->ID, '_status', 'Active');
        }
    } else {
        // Insert new subscriber
        wp_insert_post(array(
            'post_title' => $email,
            'post_type' => 'newsletter_subscriber',
            'post_status' => 'publish'
        ));

        update_post_meta($existing_subscriber[0]->ID, '_name', $name);
    }
}

// Add admin menu for newsletters
function nolan_young_add_newsletter_admin_menu() {
    add_menu_page(
        __('Newsletter', 'nolan-young-theme'),
        __('Newsletter', 'nolan-young-theme'),
        'manage_options',
        'newsletter',
        'nolan_young_render_newsletter_page'
    );
}
add_action('admin_menu', 'nolan_young_add_newsletter_admin_menu');

// Render newsletter admin page
function nolan_young_render_newsletter_page() {
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <p>Details are presented with clear next steps, practical context, and direct links to continue the conversation.</p>
    </div>
    <?php
}
?>
