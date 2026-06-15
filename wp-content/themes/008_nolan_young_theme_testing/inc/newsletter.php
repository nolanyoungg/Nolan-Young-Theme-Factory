<?php
// inc/newsletter.php - Handle newsletter subscriptions and display form

function nolan_young_theme_newsletter_form() {
    ob_start();
    ?>
    <form id="newsletter-form" class="bg-white p-6 rounded-lg shadow-md max-w-sm mx-auto mt-10" method="post">
        <input type="hidden" name="action" value="nolan_young_newsletter_form_action" />
        <div class="mb-4">
            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input type="email" name="email" id="email" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Your Email">
        </div>
        <div class="flex items-center justify-between">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Subscribe</button>
        </div>
    </form>
    <?php
    return ob_get_clean();
}

add_action('wp_ajax_nolan_young_newsletter_form_action', 'handle_newsletter_form_submission');
add_action('wp_ajax_nopriv_nolan_young_newsletter_form_action', 'handle_newsletter_form_submission');

function handle_newsletter_form_submission() {
    $email = sanitize_email($_POST['email']);

    // Newsletter subscription logic here

    wp_die();
}
