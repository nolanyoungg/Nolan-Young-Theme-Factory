<?php
// inc/forms.php - Handle form submissions and display forms

function nolan_young_theme_contact_form() {
    ob_start();
    ?>
    <form id="contact-form" class="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-10" method="post">
        <input type="hidden" name="action" value="nolan_young_contact_form_action" />
        <div class="mb-4">
            <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <input type="text" name="name" id="name" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Your Name">
        </div>
        <div class="mb-4">
            <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input type="email" name="email" id="email" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Your Email">
        </div>
        <div class="mb-4">
            <label for="phone" class="block text-gray-700 text-sm font-bold mb-2">Phone</label>
            <input type="tel" name="phone" id="phone" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Your Phone">
        </div>
        <div class="mb-4">
            <label for="message" class="block text-gray-700 text-sm font-bold mb-2">Message</label>
            <textarea name="message" id="message" required class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Your Message"></textarea>
        </div>
        <div class="flex items-center justify-between">
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Send</button>
        </div>
    </form>
    <?php
    return ob_get_clean();
}

add_action('wp_ajax_nolan_young_contact_form_action', 'handle_contact_form_submission');
add_action('wp_ajax_nopriv_nolan_young_contact_form_action', 'handle_contact_form_submission');

function handle_contact_form_submission() {
    $name = sanitize_text_field($_POST['name']);
    $email = sanitize_email($_POST['email']);
    $phone = sanitize_text_field($_POST['phone']);
    $message = sanitize_textarea_field($_POST['message']);

    // Email sending logic here

    wp_die();
}
