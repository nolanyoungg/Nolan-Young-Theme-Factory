<?php
// Custom Comments Template

if (!have_comments()) :
    echo '<p>' . __('No comments yet.', 'nolan-yong') . '</p>';
endif;

wp_list_comments(array(
    'style' => 'div',
    'short_ping' => true,
    'avatar_size' => 50
));

comment_form();
?>