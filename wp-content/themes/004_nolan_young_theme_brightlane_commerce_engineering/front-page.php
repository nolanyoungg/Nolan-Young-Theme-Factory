<?php
/**
 * Front page.
 *
 * @package Nolan_Young_Template
 */

get_header();
$services = nolan_young_template_services();
$work     = nolan_young_template_work_items();
$articles = nolan_young_template_articles();
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
				<p class="eyebrow"><?php esc_html_e( 'Featured work filter', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p>
				<h2 id="work-filter-title"><?php esc_html_e( 'Browse the kinds of commerce and platform problems Brightlane helps organize.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2>
			</div>
			<div class="filter-controls" role="tablist" aria-label="<?php esc_attr_e( 'Work categories', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?>">
				<button type="button" class="is-active" data-filter="all" aria-pressed="true"><?php esc_html_e( 'All', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></button>
				<?php foreach ( array( 'Strategy', 'Design', 'Development', 'Integration', 'Support', 'Results' ) as $category ) : ?>
					<button type="button" data-filter="<?php echo esc_attr( $category ); ?>" aria-pressed="false"><?php echo esc_html( $category ); ?></button>
				<?php endforeach; ?>
			</div>
			<div class="portfolio-grid" data-filter-grid>
				<?php foreach ( $work as $item ) : ?>
					<article class="portfolio-card" data-category="<?php echo esc_attr( $item['category'] ); ?>">
						<?php nolan_young_template_render_image( $item['image'], $item['title'] ); ?>
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
				<p class="eyebrow"><?php esc_html_e( 'Featured case study', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p>
				<h2><?php esc_html_e( 'A commerce site rebuilt around clearer decisions and cleaner operations.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2>
				<p><?php esc_html_e( 'This representative case study shows the kind of work the theme supports: a scattered platform experience becomes a more direct system of product paths, service explanations, proof points, analytics events, and inquiry flows.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p>
				<dl class="case-study__list">
					<dt><?php esc_html_e( 'Challenge', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></dt><dd><?php esc_html_e( 'Visitors could not quickly compare product paths, service support, or the next operational step.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></dd>
					<dt><?php esc_html_e( 'Solution', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></dt><dd><?php esc_html_e( 'Brightlane templates emphasized platform fit, service depth, process, support, analytics, and contact flow.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></dd>
					<dt><?php esc_html_e( 'Outcome', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></dt><dd><?php esc_html_e( 'The site became easier to scan, maintain, and improve without claiming unsupported performance numbers.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></dd>
				</dl>
			</div>
			<?php nolan_young_template_render_image( 'assets/images/portfolio/performance-review.jpg', __( 'Brightlane Commerce Engineering performance review and analytics dashboard', '004-nolan-young-theme-brightlane-commerce-engineering' ), 'media-frame' ); ?>
		</div>
	</section>

	<section class="section before-after" aria-labelledby="comparison-title">
		<div class="container">
			<div class="section-heading">
				<p class="eyebrow"><?php esc_html_e( 'Before and after', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p>
				<h2 id="comparison-title"><?php esc_html_e( 'From scattered pages to a guided website system.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2>
			</div>
			<div class="comparison-grid">
				<article><h3><?php esc_html_e( 'Before', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h3><ul><li><?php esc_html_e( 'Services described in disconnected page blocks.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></li><li><?php esc_html_e( 'Navigation relied on visitors guessing what mattered.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></li><li><?php esc_html_e( 'Forms lacked context for the inquiry type.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></li></ul></article>
				<article><h3><?php esc_html_e( 'After', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h3><ul><li><?php esc_html_e( 'Service paths, work examples, and FAQs support decisions.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></li><li><?php esc_html_e( 'Header panels expose the most important destinations.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></li><li><?php esc_html_e( 'Contact and service forms capture useful context.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></li></ul></article>
			</div>
		</div>
	</section>

	<section class="section">
		<div class="container">
			<div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Engagement options', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p><h2><?php esc_html_e( 'Choose the level of help that fits the project stage.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2></div>
			<div class="card-grid card-grid--three">
				<?php foreach ( array( __( 'Plan', '004-nolan-young-theme-brightlane-commerce-engineering' ) => __( 'Strategy, sitemap, content priorities, and launch requirements for teams preparing a build.', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Build', '004-nolan-young-theme-brightlane-commerce-engineering' ) => __( 'Design and WordPress implementation for a focused business website or service section.', '004-nolan-young-theme-brightlane-commerce-engineering' ), __( 'Improve', '004-nolan-young-theme-brightlane-commerce-engineering' ) => __( 'Refinement, support, accessibility checks, and content improvements after launch.', '004-nolan-young-theme-brightlane-commerce-engineering' ) ) as $title => $text ) : ?>
					<article class="info-card"><h3><?php echo esc_html( $title ); ?></h3><p><?php echo esc_html( $text ); ?></p><a class="btn btn-text" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Discuss fit', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a></article>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<?php get_template_part( 'template-parts/content', 'single-service-highlight' ); ?>
	<?php get_template_part( 'template-parts/content', 'style-pillars' ); ?>
	<?php get_template_part( 'template-parts/content', 'testimonials' ); ?>
	<?php get_template_part( 'template-parts/content', 'blog-preview' ); ?>

	<section class="section faq-section">
		<div class="container narrow">
			<p class="eyebrow"><?php esc_html_e( 'FAQ', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p>
			<h2><?php esc_html_e( 'Questions teams usually ask before starting.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2>
			<?php
			$faqs = array(
				__( 'What do you need before a project starts?', '004-nolan-young-theme-brightlane-commerce-engineering' ) => __( 'A clear business goal, decision maker, available content, and any technical requirements are enough to begin discovery.', '004-nolan-young-theme-brightlane-commerce-engineering' ),
				__( 'Can the site be edited in WordPress?', '004-nolan-young-theme-brightlane-commerce-engineering' ) => __( 'The theme is structured around reusable templates and WordPress-managed content so routine updates can stay practical.', '004-nolan-young-theme-brightlane-commerce-engineering' ),
				__( 'How are timelines handled?', '004-nolan-young-theme-brightlane-commerce-engineering' ) => __( 'Timelines depend on scope, content readiness, review cycles, and integrations. The process section is designed to make those dependencies visible early.', '004-nolan-young-theme-brightlane-commerce-engineering' ),
				__( 'Do you support existing websites?', '004-nolan-young-theme-brightlane-commerce-engineering' ) => __( 'Yes. Support can focus on cleanup, accessibility, content improvements, maintenance planning, or targeted rebuilds.', '004-nolan-young-theme-brightlane-commerce-engineering' ),
				__( 'What happens after launch?', '004-nolan-young-theme-brightlane-commerce-engineering' ) => __( 'Post-launch work can include issue review, documentation, content support, and a prioritized improvement list.', '004-nolan-young-theme-brightlane-commerce-engineering' ),
				__( 'Can forms identify service inquiries?', '004-nolan-young-theme-brightlane-commerce-engineering' ) => __( 'The service template includes a form that passes the related service identifier with each submission.', '004-nolan-young-theme-brightlane-commerce-engineering' ),
				__( 'How do we get started?', '004-nolan-young-theme-brightlane-commerce-engineering' ) => __( 'Use the contact form with a short project summary and the most important outcome you need the website to support.', '004-nolan-young-theme-brightlane-commerce-engineering' ),
			);
			foreach ( $faqs as $question => $answer ) :
				?>
				<section class="accordion-item"><button type="button" aria-expanded="false"><?php echo esc_html( $question ); ?></button><div hidden><p><?php echo esc_html( $answer ); ?></p></div></section>
			<?php endforeach; ?>
		</div>
	</section>

	<section class="section final-cta section-dark">
		<div class="container center">
			<p class="eyebrow"><?php esc_html_e( 'Next step', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p>
			<h2><?php esc_html_e( 'Build a website that makes the next decision clearer.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></h2>
			<p><?php esc_html_e( 'Share the project stage, the audience, and the business action your site needs to support.', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></p>
			<div class="button-row"><a class="btn btn-primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'View Work', '004-nolan-young-theme-brightlane-commerce-engineering' ); ?></a></div>
		</div>
	</section>
</main>
<?php get_footer(); ?>
