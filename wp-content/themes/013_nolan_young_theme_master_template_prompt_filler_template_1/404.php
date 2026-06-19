<?php
get_header();

?>
<main id="primary" class="site-main">
  <section class="error-404 not-found">
    <header class="page-header">
      <h1 class="page-title">Oops! That page can't be found.</h1>
    </header>

    <div class="page-content">
      <p>It looks like nothing was found at this location. Maybe try a search?</p>

      <?php get_search_form(); ?>

      <div class="widget widget_categories">
        <h2>Try visiting one of these:</h2>
        <ul>
          <?php wp_list_categories('orderby=name&show_count=1'); ?>
        </ul>
      </div>

      <div class="widget widget_recent_entries">
        <h2>Recent Posts</h2>
        <ul>
          <?php wp_get_archives('type=postbypost&limit=5'); ?>
        </ul>
      </div>
    </div>
  </section>
</main>

<?php
get_footer();
