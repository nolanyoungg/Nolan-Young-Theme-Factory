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
				<p class="eyebrow"><?php esc_html_e( 'Featured work filter', 'nolan-young-template' ); ?></p>
				<h2 id="work-filter-title"><?php esc_html_e( 'Browse the kinds of website problems Northstar helps organize.', 'nolan-young-template' ); ?></h2>
			</div>
			<div class="filter-controls" role="tablist" aria-label="<?php esc_attr_e( 'Work categories', 'nolan-young-template' ); ?>">
				<button type="button" class="is-active" data-filter="all" aria-pressed="true"><?php esc_html_e( 'All', 'nolan-young-template' ); ?></button>
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
				<p class="eyebrow"><?php esc_html_e( 'Featured case study', 'nolan-young-template' ); ?></p>
				<h2><?php esc_html_e( 'A service website rebuilt around clearer choices.', 'nolan-young-template' ); ?></h2>
				<p><?php esc_html_e( 'This representative case study shows the kind of work the theme supports: a scattered service site became a more direct system of service pages, proof points, content prompts, and inquiry paths.', 'nolan-young-template' ); ?></p>
				<dl class="case-study__list">
					<dt><?php esc_html_e( 'Challenge', 'nolan-young-template' ); ?></dt><dd><?php esc_html_e( 'Visitors could not quickly compare services or understand the next step.', 'nolan-young-template' ); ?></dd>
					<dt><?php esc_html_e( 'Solution', 'nolan-young-template' ); ?></dt><dd><?php esc_html_e( 'Northstar-style templates emphasized services, process, support, and contact flow.', 'nolan-young-template' ); ?></dd>
					<dt><?php esc_html_e( 'Outcome', 'nolan-young-template' ); ?></dt><dd><?php esc_html_e( 'The site became easier to scan, maintain, and extend without claiming unsupported performance numbers.', 'nolan-young-template' ); ?></dd>
				</dl>
			</div>
			<?php nolan_young_template_render_image( 'assets/images/hero/case-study.svg', __( 'Website case study interface', 'nolan-young-template' ), 'media-frame' ); ?>
		</div>
	</section>

	<section class="section before-after" aria-labelledby="comparison-title">
		<div class="container">
			<div class="section-heading">
				<p class="eyebrow"><?php esc_html_e( 'Before and after', 'nolan-young-template' ); ?></p>
				<h2 id="comparison-title"><?php esc_html_e( 'From scattered pages to a guided website system.', 'nolan-young-template' ); ?></h2>
			</div>
			<div class="comparison-grid">
				<article><h3><?php esc_html_e( 'Before', 'nolan-young-template' ); ?></h3><ul><li><?php esc_html_e( 'Services described in disconnected page blocks.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Navigation relied on visitors guessing what mattered.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Forms lacked context for the inquiry type.', 'nolan-young-template' ); ?></li></ul></article>
				<article><h3><?php esc_html_e( 'After', 'nolan-young-template' ); ?></h3><ul><li><?php esc_html_e( 'Service paths, work examples, and FAQs support decisions.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Header panels expose the most important destinations.', 'nolan-young-template' ); ?></li><li><?php esc_html_e( 'Contact and service forms capture useful context.', 'nolan-young-template' ); ?></li></ul></article>
			</div>
		</div>
	</section>

	<section class="section">
		<div class="container">
			<div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Engagement options', 'nolan-young-template' ); ?></p><h2><?php esc_html_e( 'Choose the level of help that fits the project stage.', 'nolan-young-template' ); ?></h2></div>
			<div class="card-grid card-grid--three">
				<?php foreach ( array( __( 'Plan', 'nolan-young-template' ) => __( 'Strategy, sitemap, content priorities, and launch requirements for teams preparing a build.', 'nolan-young-template' ), __( 'Build', 'nolan-young-template' ) => __( 'Design and WordPress implementation for a focused business website or service section.', 'nolan-young-template' ), __( 'Improve', 'nolan-young-template' ) => __( 'Refinement, support, accessibility checks, and content improvements after launch.', 'nolan-young-template' ) ) as $title => $text ) : ?>
					<article class="info-card"><h3><?php echo esc_html( $title ); ?></h3><p><?php echo esc_html( $text ); ?></p><a class="btn btn-text" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Discuss fit', 'nolan-young-template' ); ?></a></article>
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
			<p class="eyebrow"><?php esc_html_e( 'FAQ', 'nolan-young-template' ); ?></p>
			<h2><?php esc_html_e( 'Questions teams usually ask before starting.', 'nolan-young-template' ); ?></h2>
			<?php
			$faqs = array(
				__( 'What do you need before a project starts?', 'nolan-young-template' ) => __( 'A clear business goal, decision maker, available content, and any technical requirements are enough to begin discovery.', 'nolan-young-template' ),
				__( 'Can the site be edited in WordPress?', 'nolan-young-template' ) => __( 'The theme is structured around reusable templates and WordPress-managed content so routine updates can stay practical.', 'nolan-young-template' ),
				__( 'How are timelines handled?', 'nolan-young-template' ) => __( 'Timelines depend on scope, content readiness, review cycles, and integrations. The process section is designed to make those dependencies visible early.', 'nolan-young-template' ),
				__( 'Do you support existing websites?', 'nolan-young-template' ) => __( 'Yes. Support can focus on cleanup, accessibility, content improvements, maintenance planning, or targeted rebuilds.', 'nolan-young-template' ),
				__( 'What happens after launch?', 'nolan-young-template' ) => __( 'Post-launch work can include issue review, documentation, content support, and a prioritized improvement list.', 'nolan-young-template' ),
				__( 'Can forms identify service inquiries?', 'nolan-young-template' ) => __( 'The service template includes a form that passes the related service identifier with each submission.', 'nolan-young-template' ),
				__( 'How do we get started?', 'nolan-young-template' ) => __( 'Use the contact form with a short project summary and the most important outcome you need the website to support.', 'nolan-young-template' ),
			);
			foreach ( $faqs as $question => $answer ) :
				?>
				<section class="accordion-item"><button type="button" aria-expanded="false"><?php echo esc_html( $question ); ?></button><div hidden><p><?php echo esc_html( $answer ); ?></p></div></section>
			<?php endforeach; ?>
		</div>
	</section>

	<section class="section final-cta section-dark">
		<div class="container center">
			<p class="eyebrow"><?php esc_html_e( 'Next step', 'nolan-young-template' ); ?></p>
			<h2><?php esc_html_e( 'Build a website that makes the next decision clearer.', 'nolan-young-template' ); ?></h2>
			<p><?php esc_html_e( 'Share the project stage, the audience, and the business action your site needs to support.', 'nolan-young-template' ); ?></p>
			<div class="button-row"><a class="btn btn-primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact Us', 'nolan-young-template' ); ?></a><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'View Work', 'nolan-young-template' ); ?></a></div>
		</div>
	</section>
</main>
<?php get_footer(); ?>
