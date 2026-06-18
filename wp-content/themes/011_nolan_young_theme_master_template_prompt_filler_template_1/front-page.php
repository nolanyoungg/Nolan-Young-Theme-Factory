<?php
/**
 * Front page.
 *
 * @package Nolan_Young_Template
 */

get_header();
?>
<main id="primary" class="site-main">
	<?php
	get_template_part( 'template-parts/content', 'hero' );
	get_template_part( 'template-parts/content', 'featured-work' );
	get_template_part( 'template-parts/content', 'brand-statement' );
	get_template_part( 'template-parts/content', 'all-services' );
	get_template_part( 'template-parts/content', 'process' );
	nolan_young_template_render_work_filter( 'home-work-filter' );
	?>
	<section class="section case-study" aria-labelledby="case-study-title">
		<div class="container case-study__grid">
			<div><?php nolan_young_template_card_image( 'assets/images/portfolio/case-study-service-site.svg', __( 'Service website case study interface', 'nolan-young-template' ) ); ?></div>
			<div><p class="eyebrow"><?php esc_html_e( 'Case study pattern', 'nolan-young-template' ); ?></p><h2 id="case-study-title"><?php esc_html_e( 'A service website structured around better decisions.', 'nolan-young-template' ); ?></h2><p><?php esc_html_e( 'The challenge is common: important services are spread across unclear pages, visitors do not know where to begin, and the owner needs a site that is easier to update.', 'nolan-young-template' ); ?></p><dl><div><dt><?php esc_html_e( 'Challenge', 'nolan-young-template' ); ?></dt><dd><?php esc_html_e( 'Simplify a complex service offer without hiding necessary detail.', 'nolan-young-template' ); ?></dd></div><div><dt><?php esc_html_e( 'Solution', 'nolan-young-template' ); ?></dt><dd><?php esc_html_e( 'Reusable service cards, guided CTAs, article previews, and private inquiry records.', 'nolan-young-template' ); ?></dd></div><div><dt><?php esc_html_e( 'Outcome', 'nolan-young-template' ); ?></dt><dd><?php esc_html_e( 'A maintainable WordPress structure that can support future pages and resources.', 'nolan-young-template' ); ?></dd></div></dl></div>
		</div>
	</section>
	<section class="section section--soft before-after" aria-labelledby="comparison-title">
		<div class="container">
			<div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Before and after', 'nolan-young-template' ); ?></p><h2 id="comparison-title"><?php esc_html_e( 'Compare a scattered site with a guided service experience.', 'nolan-young-template' ); ?></h2></div>
			<div class="comparison-grid"><article><h3><?php esc_html_e( 'Before', 'nolan-young-template' ); ?></h3><ul><li><?php esc_html_e( 'Services compete for attention.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Forms ask for context too late.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Resources feel disconnected from conversion paths.', 'nolan-young-template' ); ?></li></ul></article><article><h3><?php esc_html_e( 'After', 'nolan-young-template' ); ?></h3><ul><li><?php esc_html_e( 'Pages guide visitors by need and readiness.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Inquiry forms carry service context into admin records.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Articles, proof, and process support the next step.', 'nolan-young-template' ); ?></li></ul></article></div>
		</div>
	</section>
	<section class="section packages" aria-labelledby="packages-title">
		<div class="container"><div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Engagement options', 'nolan-young-template' ); ?></p><h2 id="packages-title"><?php esc_html_e( 'Choose the level of help that fits the work ahead.', 'nolan-young-template' ); ?></h2></div><div class="card-grid card-grid--three">
			<?php foreach ( array( __( 'Focused Improvement', 'nolan-young-template' ), __( 'Complete Website Build', 'nolan-young-template' ), __( 'Ongoing Support', 'nolan-young-template' ) ) as $option ) : ?><article class="package-card"><h3><?php echo esc_html( $option ); ?></h3><p><?php esc_html_e( 'A clear scope can include planning, design, theme development, launch preparation, support, or a targeted mix of those services.', 'nolan-young-template' ); ?></p><a class="btn btn-secondary" href="<?php echo nolan_young_template_page_url( 'contact/' ); ?>"><?php esc_html_e( 'Discuss fit', 'nolan-young-template' ); ?></a></article><?php endforeach; ?>
		</div></div>
	</section>
	<?php
	get_template_part( 'template-parts/content', 'single-service-highlight' );
	?>
	<section class="section customer-experience" aria-labelledby="experience-title">
		<div class="container customer-experience__grid"><div><p class="eyebrow"><?php esc_html_e( 'Customer experience', 'nolan-young-template' ); ?></p><h2 id="experience-title"><?php esc_html_e( 'Know what is happening before, during, and after the build.', 'nolan-young-template' ); ?></h2></div><div class="card-grid"><article class="info-card"><h3><?php esc_html_e( 'Before', 'nolan-young-template' ); ?></h3><p><?php esc_html_e( 'You gather goals, content, examples, and operational needs so early choices are grounded.', 'nolan-young-template' ); ?></p></article><article class="info-card"><h3><?php esc_html_e( 'During', 'nolan-young-template' ); ?></h3><p><?php esc_html_e( 'The work moves through visible sections, reusable patterns, review points, and practical decisions.', 'nolan-young-template' ); ?></p></article><article class="info-card"><h3><?php esc_html_e( 'After', 'nolan-young-template' ); ?></h3><p><?php esc_html_e( 'The site includes documentation, maintainable assets, and support-ready admin records.', 'nolan-young-template' ); ?></p></article></div></div>
	</section>
	<?php
	get_template_part( 'template-parts/content', 'testimonials' );
	get_template_part( 'template-parts/content', 'blog-preview' );
	nolan_young_template_render_faqs();
	get_template_part( 'template-parts/content', 'cta-banner' );
	?>
</main>
<?php
get_footer();
