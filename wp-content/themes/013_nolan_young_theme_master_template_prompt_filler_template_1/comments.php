<?php
// Comment template with custom styling and structure

?>
<ol class="comment-list">
    <?php
        wp_list_comments( array('style' => 'ul', 'short_ping' => true) );
    ?>
</ol>

