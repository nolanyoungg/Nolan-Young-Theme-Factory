<?php
// inc/policy-routing.php

function northstar_policy_page_template($template) {
    if (is_post_type_archive('contact_form_submission') || is_post_type_archive('service_form_submission')) {
        return locate_template('page-forms.php');
    }
    return $template;
}
add_filter('template_include', 'northstar_policy_page_template');

function northstar_newsletter_page_template($template) {
    if (is_post_type_archive('newsletter_subscriber')) {
        return locate_template('page-newsletter.php');
    }
    return $template;
}
add_filter('template_include', 'northstar_newsletter_page_template');
