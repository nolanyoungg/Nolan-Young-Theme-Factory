<?php
/*
Template Name: Work
*/

get_header();

?>
<main id="primary" class="site-main">
  <section class="work-section-hero">
    <div class="container">
      <h1>Our Work</h1>
      <p>See some of our recent projects and case studies.</p>
      <a href="#" class="btn btn-primary">View Our Portfolio</a>
    </div>
  </section>

  <section class="work-section-filter">
    <div class="container">
      <h2>Filter Projects</h2>
      <ul id="portfolio-filter">
        <li><button data-filter="*" class="active">All</button></li>
        <li><button data-filter=".strategy">Strategy</button></li>
        <li><button data-filter=".design">Design</button></li>
        <li><button data-filter=".development">Development</button></li>
      </ul>
    </div>
  </section>

  <section class="work-section-portfolio">
    <div class="container">
      <div class="portfolio-grid">
        <article class="portfolio-item design">
          <a href="/work/northstar-brand-refresh/" class="portfolio-link">
            <img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/placeholder.svg' ) ); ?>" alt="Northstar brand refresh project">
            <h3>Northstar Brand Refresh</h3>
          </a>
        </article>
        <article class="portfolio-item strategy">
          <a href="/work/service-positioning/" class="portfolio-link">
            <img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/placeholder.svg' ) ); ?>" alt="Service positioning project">
            <h3>Service Positioning</h3>
          </a>
        </article>
        <article class="portfolio-item development">
          <a href="/work/custom-wordpress-build/" class="portfolio-link">
            <img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/placeholder.svg' ) ); ?>" alt="Custom WordPress build project">
            <h3>Custom WordPress Build</h3>
          </a>
        </article>
      </div>
    </div>
  </section>

  <section class="work-section-contact">
    <div class="container">
      <h2>Contact Us to Discuss Your Project</h2>
      <p>Get in touch with us for a consultation on your next project.</p>
      <a href="/contact/" class="btn btn-primary">Contact Us</a>
    </div>
  </section>
</main>

<?php
get_footer();
