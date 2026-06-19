<?php
/*
Template Name: Blog
*/

get_header();

?>
<main id="primary" class="site-main">
  <section class="blog-section-hero">
    <div class="container">
      <h1>Blog</h1>
      <p>Stay informed with our latest articles and insights.</p>
      <a href="#" class="btn btn-primary">Read More</a>
    </div>
  </section>

  <section class="blog-section-featured">
    <div class="container">
      <div class="blog-post-grid">
        <article class="blog-post-preview">
          <h2><a href="/blog/designing-for-conversion/">Designing for conversion</a></h2>
          <p>Learn how structure, trust signals, and simple calls to action can improve lead flow.</p>
          <a href="/blog/designing-for-conversion/" class="btn btn-secondary">Read More</a>
        </article>
        <article class="blog-post-preview">
          <h2><a href="/blog/wordpress-maintenance-basics/">WordPress maintenance basics</a></h2>
          <p>A practical look at updates, backups, and the operational habits that keep a site healthy.</p>
          <a href="/blog/wordpress-maintenance-basics/" class="btn btn-secondary">Read More</a>
        </article>
        <article class="blog-post-preview">
          <h2><a href="/blog/content-that-builds-trust/">Content that builds trust</a></h2>
          <p>See how service pages, proof points, and clarity support better engagement.</p>
          <a href="/blog/content-that-builds-trust/" class="btn btn-secondary">Read More</a>
        </article>
      </div>
    </div>
  </section>

  <section class="blog-section-pagination">
    <div class="container">
      <nav class="pagination-nav" aria-label="Blog navigation">
        <a href="/blog/" class="pagination-link is-current">1</a>
        <a href="/blog/page/2/" class="pagination-link">2</a>
        <a href="/blog/page/3/" class="pagination-link">3</a>
      </nav>
    </div>
  </section>
</main>

<?php
get_footer();
