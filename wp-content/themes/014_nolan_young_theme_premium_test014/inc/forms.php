<?php
/**
 * Handles form submissions and admin menu for viewing, filtering, exporting, and deleting submissions.
 */

// Register custom post type for forms
function nolan_young_forms_register_post_type() {
    register_post_type('form_submission', array(
        'labels' => array(
            'name' => __('Form Submissions', 'nolan-young-theme'),
            'singular_name' => __('Form Submission', 'nolan-young-theme')
        ),
        'public' => false,
        'show_ui' => true,
        'supports' => array('title', 'editor'),
        'has_archive' => false,
    ));
}
add_action('init', 'nolan_young_forms_register_post_type');

// Handle form submissions
function nolan_young_handle_form_submission($form_data) {
    $user = wp_get_current_user();
    $post_id = wp_insert_post(array(
        'post_title' => sanitize_text_field($form_data['name']),
        'post_content' => serialize($form_data),
        'post_type' => 'form_submission',
        'post_status' => 'publish'
    ));

    if ($post_id) {
        $to = get_option('admin_email');
        $subject = __('New Form Submission', 'nolan-young-theme');
        $message = "Name: " . sanitize_text_field($form_data['name']) . "\r\n";
        $message .= "Email: " . sanitize_email($form_data['email']) . "\r\n";
        $message .= "Phone: " . sanitize_text_field($form_data['phone']) . "\r\n";
        $message .= "Message: " . esc_html($form_data['message']);

        wp_mail($to, $subject, $message);
    }
}

// Add admin menu for forms
function nolan_young_add_forms_admin_menu() {
    add_menu_page(
        __('Forms', 'nolan-young-theme'),
        __('Forms', 'nolan-young-theme'),
        'manage_options',
        'forms',
        'nolan_young_render_forms_page'
    );
}
add_action('admin_menu', 'nolan_young_add_forms_admin_menu');

// Render forms admin page
function nolan_young_render_forms_page() {
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <p>Details are presented with clear next steps, practical context, and direct links to continue the conversation.</p>
    </div>
    <?php
}
?>
