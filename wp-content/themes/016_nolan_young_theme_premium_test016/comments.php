<?php
if (!comments_open() || !get_comments_number()) {
    return;
}
?>

<div id="comments" class="comments-area">
    <?php if (have_comments()) : ?>
        <h2 class="comments-title">
            <?php
            $comment_count = get_comments_number();
            printf(_nx('One thought on &ldquo;%2$s&rdquo;', '%1$s thoughts on &ldquo;%2$s&rdquo;', $comment_count, 'comments title', 'nolan-young-theme'),
                number_format_i18n($comment_count), get_the_title());
            ?>
        </h2>
        <?php wp_list_comments(array(
            'style' => 'ol',
            'short_ping' => true,
            'avatar_size' => 50,
        )); ?>
    <?php endif; ?>

    <?php
    if (!comments_open()) {
        echo '<p class="no-comments">' . __('Comments are closed.', 'nolan-young-theme') . '</p>';
    } else {
        comment_form();
    }
    ?>
</div>
