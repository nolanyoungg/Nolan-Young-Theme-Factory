<?php
/**
 * Front page.
 *
 * @package Nolan_Young_Template
 */

get_header();
$work     = nolan_young_template_work_items();
$faqs     = nolan_young_template_faqs();
?>
<main id="primary" class="site-main">
	<?php get_template_part( 'template-parts/content', 'hero' ); ?>
	<?php get_template_part( 'template-parts/content', 'featured-work' ); ?>
	<?php get_template_part( 'template-parts/content', 'brand-statement' ); ?>
	<?php get_template_part( 'template-parts/content', 'all-services' ); ?>
	<?php get_template_part( 'template-parts/content', 'process' ); ?>

	<section class="section portfolio-filter" aria-labelledby="work-filter-title">
		<div class="container">
			<div class="section-heading">
				<p class="eyebrow"><?php esc_html_e( 'Featured work filter', '007-nolan-young-theme-atlasframe-digital' ); ?></p>
				<h2 id="work-filter-title"><?php esc_html_e( 'Browse representative problem types by the work they require.', '007-nolan-young-theme-atlasframe-digital' ); ?></h2>
			</div>
			<div class="filter-controls" role="tablist" aria-label="<?php esc_attr_e( 'Work categories', '007-nolan-young-theme-atlasframe-digital' ); ?>">
				<button type="button" class="is-active" data-filter="all" aria-pressed="true"><?php esc_html_e( 'All', '007-nolan-young-theme-atlasframe-digital' ); ?></button>
				<?php foreach ( array( 'Strategy', 'Design', 'Development', 'Integration', 'Support', 'Results' ) as $category ) : ?>
					<button type="button" data-filter="<?php echo esc_attr( $category ); ?>" aria-pressed="false"><?php echo esc_html( $category ); ?></button>
				<?php endforeach; ?>
			</div>
			<div class="portfolio-grid" data-filter-grid>
				<?php foreach ( $work as $item ) : ?>
					<article class="portfolio-card" data-category="<?php echo esc_attr( $item['category'] ); ?>">
						<?php nolan_young_template_render_image( $item['image'], $item['alt'] ); ?>
						<p class="eyebrow"><?php echo esc_html( $item['category'] ); ?></p>
						<h3><a href="<?php echo esc_url( $item['url'] ); ?>"><?php echo esc_html( $item['title'] ); ?></a></h3>
						<p><?php echo esc_html( $item['excerpt'] ); ?></p>
					</article>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<section class="section case-study section-dark">
		<div class="container split">
			<div>
				<p class="eyebrow"><?php esc_html_e( 'Featured case study', '007-nolan-young-theme-atlasframe-digital' ); ?></p>
				<h2><?php esc_html_e( 'A WooCommerce catalog reframed around product clarity.', '007-nolan-young-theme-atlasframe-digital' ); ?></h2>
				<p><?php esc_html_e( 'This anonymized example shows the kind of work Atlasframe Digital is built to present: a store experience with clearer categories, product context, merchandising sections, and operational handoff.', '007-nolan-young-theme-atlasframe-digital' ); ?></p>
				<dl class="case-study__list">
					<dt><?php esc_html_e( 'Challenge', '007-nolan-young-theme-atlasframe-digital' ); ?></dt><dd><?php esc_html_e( 'Products, support content, and category paths were disconnected, making it harder for buyers to compare options.', '007-nolan-young-theme-atlasframe-digital' ); ?></dd>
					<dt><?php esc_html_e( 'Solution', '007-nolan-young-theme-atlasframe-digital' ); ?></dt><dd><?php esc_html_e( 'The site structure centered category roles, buyer questions, reusable product sections, and integration-ready inquiry flows.', '007-nolan-young-theme-atlasframe-digital' ); ?></dd>
					<dt><?php esc_html_e( 'Outcome', '007-nolan-young-theme-atlasframe-digital' ); ?></dt><dd><?php esc_html_e( 'The representative system became easier to scan, maintain, and extend without claiming unsupported performance numbers.', '007-nolan-young-theme-atlasframe-digital' ); ?></dd>
				</dl>
			</div>
			<?php nolan_young_template_render_image( 'assets/images/portfolio/ecommerce-planning.jpg', __( 'Atlasframe Digital ecommerce planning and analytics workspace', '007-nolan-young-theme-atlasframe-digital' ), 'media-frame' ); ?>
		</div>
	</section>

	<section class="section before-after" aria-labelledby="comparison-title">
		<div class="container">
			<div class="section-heading">
				<p class="eyebrow"><?php esc_html_e( 'Before and after', '007-nolan-young-theme-atlasframe-digital' ); ?></p>
				<h2 id="comparison-title"><?php esc_html_e( 'From scattered pages to planned WordPress systems.', '007-nolan-young-theme-atlasframe-digital' ); ?></h2>
			</div>
			<div class="comparison-grid">
				<article><h3><?php esc_html_e( 'Before', '007-nolan-young-theme-atlasframe-digital' ); ?></h3><ul><li><?php esc_html_e( 'Services described in disconnected page blocks.', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Manual handoffs depended on copying form details between tools.', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Theme changes were difficult to maintain because patterns were not documented.', '007-nolan-young-theme-atlasframe-digital' ); ?></li></ul></article>
				<article><h3><?php esc_html_e( 'After', '007-nolan-young-theme-atlasframe-digital' ); ?></h3><ul><li><?php esc_html_e( 'Service paths, work examples, and FAQs support decisions.', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Forms, newsletter handling, and admin exports support practical workflows.', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Reusable templates, SCSS, JavaScript, and documentation create a clearer maintenance path.', '007-nolan-young-theme-atlasframe-digital' ); ?></li></ul></article>
			</div>
		</div>
	</section>

	<section class="section engagement-options">
		<div class="container">
			<div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Engagement options', '007-nolan-young-theme-atlasframe-digital' ); ?></p><h2><?php esc_html_e( 'Choose the right level of help for the stage of the site.', '007-nolan-young-theme-atlasframe-digital' ); ?></h2></div>
			<div class="card-grid card-grid--three">
				<article class="info-card package-card"><h3><?php esc_html_e( 'Foundation Sprint', '007-nolan-young-theme-atlasframe-digital' ); ?></h3><p><?php esc_html_e( 'For teams that need a focused strategy and page-structure reset.', '007-nolan-young-theme-atlasframe-digital' ); ?></p><ul><li><?php esc_html_e( 'Discovery', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Sitemap direction', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Homepage and content priorities', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Technical recommendations', '007-nolan-young-theme-atlasframe-digital' ); ?></li></ul><a class="btn btn-text" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Discuss fit', '007-nolan-young-theme-atlasframe-digital' ); ?></a></article>
				<article class="info-card package-card"><h3><?php esc_html_e( 'Custom Theme Build', '007-nolan-young-theme-atlasframe-digital' ); ?></h3><p><?php esc_html_e( 'For teams ready for a full custom WordPress design and development project.', '007-nolan-young-theme-atlasframe-digital' ); ?></p><ul><li><?php esc_html_e( 'Design system', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Custom templates', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Component buildout', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Responsive QA and launch support', '007-nolan-young-theme-atlasframe-digital' ); ?></li></ul><a class="btn btn-text" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Discuss fit', '007-nolan-young-theme-atlasframe-digital' ); ?></a></article>
				<article class="info-card package-card"><h3><?php esc_html_e( 'Ongoing Website Care', '007-nolan-young-theme-atlasframe-digital' ); ?></h3><p><?php esc_html_e( 'For teams that want continued support after launch.', '007-nolan-young-theme-atlasframe-digital' ); ?></p><ul><li><?php esc_html_e( 'Updates', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Incremental improvements', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Content support', '007-nolan-young-theme-atlasframe-digital' ); ?></li><li><?php esc_html_e( 'Quality checks', '007-nolan-young-theme-atlasframe-digital' ); ?></li></ul><a class="btn btn-text" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Discuss fit', '007-nolan-young-theme-atlasframe-digital' ); ?></a></article>
			</div>
		</div>
	</section>

	<?php get_template_part( 'template-parts/content', 'single-service-highlight' ); ?>
	<?php get_template_part( 'template-parts/content', 'style-pillars' ); ?>
	<?php get_template_part( 'template-parts/content', 'testimonials' ); ?>
	<?php get_template_part( 'template-parts/content', 'blog-preview' ); ?>

	<section class="section faq-section">
		<div class="container narrow">
			<p class="eyebrow"><?php esc_html_e( 'FAQ', '007-nolan-young-theme-atlasframe-digital' ); ?></p>
			<h2><?php esc_html_e( 'Questions teams ask before choosing the next WordPress step.', '007-nolan-young-theme-atlasframe-digital' ); ?></h2>
			<?php foreach ( $faqs as $question => $answer ) : ?>
				<section class="accordion-item"><button type="button" aria-expanded="false"><?php echo esc_html( $question ); ?></button><div hidden><p><?php echo esc_html( $answer ); ?></p></div></section>
			<?php endforeach; ?>
		</div>
	</section>

	<section class="section final-cta section-dark">
		<div class="container split">
			<div>
				<p class="eyebrow"><?php esc_html_e( 'Next step', '007-nolan-young-theme-atlasframe-digital' ); ?></p>
				<h2><?php esc_html_e( 'Build a WordPress foundation your team can keep improving.', '007-nolan-young-theme-atlasframe-digital' ); ?></h2>
				<p><?php esc_html_e( 'Share the current site, business goals, timeline context, must-have functionality, and support needs. Atlasframe Digital will follow up with a practical next step.', '007-nolan-young-theme-atlasframe-digital' ); ?></p>
				<div class="button-row"><a class="btn btn-primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', '007-nolan-young-theme-atlasframe-digital' ); ?></a><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'Explore Work', '007-nolan-young-theme-atlasframe-digital' ); ?></a></div>
			</div>
			<?php nolan_young_template_render_image( 'assets/images/hero/agency-workspace.jpg', __( 'Atlasframe Digital strategy workspace with laptops and planning material', '007-nolan-young-theme-atlasframe-digital' ), 'media-frame' ); ?>
		</div>
	</section>
</main>
<?php get_footer(); ?>
