<?php get_header(); ?>
?>
<div class="container search-container">
  <h1>Search Results for: <?php echo get_search_query(); ?></h1>
  <?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
    <div class="search-item">
      <h2><a href='<?php the_permalink(); ?>'><?php the_title(); ?></a></h2>
      <p><?php the_excerpt(); ?></p>
    </div>
  <?php endwhile; else : ?>
    <p>No results found.</p>
  <?php endif; ?>
</div>
<?php get_footer(); ?>
