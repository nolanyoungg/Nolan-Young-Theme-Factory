<?php
// Newsletter Management

function nolan_yong_enqueue_newsletter_scripts() {
    wp_enqueue_script('nolan-newsletter-js', get_theme_file_uri('/assets/js/newsletter.js'), array('jquery'), null, true);
}
add_action('wp_enqueue_scripts', 'nolan_yong_enqueue_newsletter_scripts');

// Process Newsletter Signup Submission
function nolan_yong_process_newsletter_signup() {
    if (!isset($_POST['newsletter_form_nonce']) || !wp_verify_nonce($_POST['newsletter_form_nonce'], 'newsletter_form_nonce')) {
        wp_die(__('Security check failed.', 'nolan-yong'));
    }

    $email = sanitize_email($_POST['email']);
    $name = isset($_POST['name']) ? sanitize_text_field($_POST['name']) : '';

    if (empty($email)) {
        wp_die(__('Please enter your email address.', 'nolan-yong'));
    }

    // Normalize and check for duplicate active subscribers
    $normalized_email = strtolower($email);
    $existing_subscriber = get_post_by_meta('newsletter_subscriber', '_subscriber_email', true, array(
        'meta_value' => $normalized_email,
        'post_status' => array('publish')
    ));

    if ($existing_subscriber) {
        wp_die(__('This email address is already subscribed.', 'nolan-yong'));
    }

    // Create a new subscriber post
    $subscriber_id = wp_insert_post(array(
        'post_type' => 'newsletter_subscriber',
        'post_status' => 'publish',
        'post_title' => $name ? $name : __('Subscriber', 'nolan-yong'),
        'meta_input' => array(
            '_subscriber_email' => $normalized_email,
            '_subscriber_name' => $name,
            '_signup_date' => current_time('mysql')
        )
    ));

    if ($subscriber_id) {
        // Send email notification to the admin
        $to = get_option('admin_email');
        $subject = __('New Newsletter Subscriber', 'nolan-yong');
        $body = "Email: $email\nName: $name";
        $headers = array('Content-Type: text/plain; charset=UTF-8');

        wp_mail($to, $subject, $body, $headers);
    }

    // Redirect to success page or display a success message
    wp_redirect(home_url('/contact/?form=success'));
    exit;
}
add_action('init', 'nolan_yong_process_newsletter_signup');
?>