<?php
// inc/newsletter.php

function northstar_register_newsletter_subscriber() {
    register_post_type('newsletter_subscriber', array(
        'labels' => array(
            'name' => __('Newsletter Subscribers'),
            'singular_name' => __('Newsletter Subscriber')
        ),
        'public' => false,
        'show_ui' => true,
        'supports' => array('title', 'editor', 'author', 'date'),
    ));
}
add_action('init', 'northstar_register_newsletter_subscriber');

function northstar_process_newsletter_signup() {
    if (isset($_POST['newsletter_nonce']) && wp_verify_nonce($_POST['newsletter_nonce'], 'submit_newsletter_form')) {
        $email = sanitize_email($_POST['email']);
        $name = isset($_POST['name']) ? sanitize_text_field($_POST['name']) : '';

        if (!is_email($email)) {
            wp_die('Please enter a valid email address.');
        }

        $subscriber = get_posts(array(
            'post_type' => 'newsletter_subscriber',
            'meta_key' => '_email',
            'meta_value' => $email,
            'numberposts' => 1
        ));

        if (empty($subscriber)) {
            $post_data = array(
                'post_title' => sprintf('%s - %s', __('Newsletter Subscriber'), date('Y-m-d H:i:s')),
                'post_content' => '',
                'post_status' => 'publish',
                'post_type' => 'newsletter_subscriber',
            );

            $subscriber_id = wp_insert_post($post_data);

            if ($subscriber_id) {
                update_post_meta($subscriber_id, '_email', $email);
                update_post_meta($subscriber_id, '_name', $name);
                update_post_meta($subscriber_id, '_status', 'Active');

                // Send confirmation email
                wp_mail(get_option('admin_email'), 'New Newsletter Signup', sprintf('Name: %s\nEmail: %s', $name, $email));
            }
        } else {
            if (get_post_meta($subscriber[0]->ID, '_status', true) == 'Unsubscribed') {
                update_post_meta($subscriber[0]->ID, '_status', 'Active');
                // Send reactivation email
                wp_mail(get_option('admin_email'), 'Newsletter Subscriber Reactivated', sprintf('Name: %s\nEmail: %s', $name, $email));
            } else {
                wp_die('You are already subscribed.');
            }
        }
    }
}
add_action('init', 'northstar_process_newsletter_signup');
