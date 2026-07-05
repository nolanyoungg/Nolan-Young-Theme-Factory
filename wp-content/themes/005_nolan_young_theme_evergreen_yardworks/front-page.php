<?php
/**
 * Front page.
 *
 * @package Nolan_Young_Template
 */

get_header();
$services = nolan_young_template_services();
$plans    = nolan_young_template_plans();
$work     = nolan_young_template_work_items();
$articles = nolan_young_template_articles();
?>
<main id="primary" class="site-main">
	<?php get_template_part( 'template-parts/content', 'hero' ); ?>

	<section class="quick-trust" aria-label="<?php esc_attr_e( 'Evergreen Yardworks service highlights', '005-nolan-young-theme-evergreen-yardworks' ); ?>">
		<div class="container quick-trust__grid">
			<?php foreach ( array( 'Recurring plans', 'One-time cleanups', 'Garden bed refreshes', 'Seasonal scheduling' ) as $item ) : ?>
				<div><span aria-hidden="true"></span><?php echo esc_html( $item ); ?></div>
			<?php endforeach; ?>
		</div>
	</section>

	<section class="section service-selector" aria-labelledby="service-selector-title">
		<div class="container">
			<div class="section-heading section-heading--row">
				<div><p class="eyebrow"><?php esc_html_e( 'Choose the yard task', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h2 id="service-selector-title"><?php esc_html_e( 'A practical menu for lawns, beds, cleanup, and route care.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2></div>
				<a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/services/' ) ); ?>"><?php esc_html_e( 'View Services', '005-nolan-young-theme-evergreen-yardworks' ); ?></a>
			</div>
			<div class="service-selector__layout">
				<div class="service-selector__tabs" role="tablist" aria-label="<?php esc_attr_e( 'Evergreen Yardworks services', '005-nolan-young-theme-evergreen-yardworks' ); ?>">
					<?php foreach ( $services as $key => $service ) : ?>
						<button type="button" class="<?php echo 'weekly-mowing' === $key ? 'is-active' : ''; ?>" data-service-tab="<?php echo esc_attr( $key ); ?>" aria-pressed="<?php echo 'weekly-mowing' === $key ? 'true' : 'false'; ?>"><?php echo esc_html( $service['title'] ); ?></button>
					<?php endforeach; ?>
				</div>
				<div class="service-selector__panels">
					<?php foreach ( $services as $key => $service ) : ?>
						<article class="service-selector__panel <?php echo 'weekly-mowing' === $key ? 'is-active' : ''; ?>" data-service-panel="<?php echo esc_attr( $key ); ?>" <?php echo 'weekly-mowing' === $key ? '' : 'hidden'; ?>>
							<?php nolan_young_template_render_image( $service['image'], $service['title'] ); ?>
							<div><p class="eyebrow"><?php esc_html_e( 'Service detail', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h3><?php echo esc_html( $service['title'] ); ?></h3><p><?php echo esc_html( $service['excerpt'] ); ?></p><ul><?php foreach ( $service['bullets'] as $bullet ) : ?><li><?php echo esc_html( $bullet ); ?></li><?php endforeach; ?></ul><a class="btn btn-primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Ask About My Property', '005-nolan-young-theme-evergreen-yardworks' ); ?></a></div>
						</article>
					<?php endforeach; ?>
				</div>
			</div>
		</div>
	</section>

	<section class="section seasonal-band" aria-labelledby="seasonal-title">
		<div class="container seasonal-band__inner">
			<div><p class="eyebrow"><?php esc_html_e( 'Seasonal priority', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h2 id="seasonal-title"><?php esc_html_e( 'The right yard visit depends on the week, weather, and growth pattern.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2></div>
			<div class="season-tabs" data-season-tabs>
				<div class="season-tabs__controls" role="tablist" aria-label="<?php esc_attr_e( 'Seasonal yard tasks', '005-nolan-young-theme-evergreen-yardworks' ); ?>">
					<?php foreach ( array( 'spring' => 'Spring', 'summer' => 'Summer', 'fall' => 'Fall', 'winter' => 'Winter' ) as $key => $label ) : ?>
						<button type="button" data-season-tab="<?php echo esc_attr( $key ); ?>" class="<?php echo 'spring' === $key ? 'is-active' : ''; ?>" aria-pressed="<?php echo 'spring' === $key ? 'true' : 'false'; ?>"><?php echo esc_html( $label ); ?></button>
					<?php endforeach; ?>
				</div>
				<?php
				$season_copy = array(
					'spring' => __( 'Clear winter debris, reset beds, catch early weeds, and schedule the first clean edges before growth speeds up.', '005-nolan-young-theme-evergreen-yardworks' ),
					'summer' => __( 'Protect turf with sensible mowing height, watering guidance, trimming, and route visits that stay tidy through heat.', '005-nolan-young-theme-evergreen-yardworks' ),
					'fall'   => __( 'Manage leaves, final mowing, perennial cutbacks, bed cleanup, and winter-ready debris removal.', '005-nolan-young-theme-evergreen-yardworks' ),
					'winter' => __( 'Plan pruning, storm debris cleanup, early mulch timing, and the spring route before calendars fill.', '005-nolan-young-theme-evergreen-yardworks' ),
				);
				foreach ( $season_copy as $key => $text ) :
					?>
					<p class="season-tabs__panel <?php echo 'spring' === $key ? 'is-active' : ''; ?>" data-season-panel="<?php echo esc_attr( $key ); ?>" <?php echo 'spring' === $key ? '' : 'hidden'; ?>><?php echo esc_html( $text ); ?></p>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<section class="section plan-comparison" aria-labelledby="plans-title">
		<div class="container">
			<div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Plans', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h2 id="plans-title"><?php esc_html_e( 'Compare recurring care, lighter maintenance, and seasonal resets.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2></div>
			<div class="card-grid card-grid--plans">
				<?php foreach ( $plans as $plan ) : ?>
					<article class="package-card" data-reveal><h3><?php echo esc_html( $plan['title'] ); ?></h3><p><?php echo esc_html( $plan['text'] ); ?></p><a class="btn btn-text" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Compare Plans', '005-nolan-young-theme-evergreen-yardworks' ); ?></a></article>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<section class="section work-gallery" aria-labelledby="work-title">
		<div class="container">
			<div class="section-heading section-heading--row"><div><p class="eyebrow"><?php esc_html_e( 'Recent property-care examples', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h2 id="work-title"><?php esc_html_e( 'Work that looks tidy because the details are handled.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2></div><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/work/' ) ); ?>"><?php esc_html_e( 'See Seasonal Work', '005-nolan-young-theme-evergreen-yardworks' ); ?></a></div>
			<div class="portfolio-grid">
				<?php foreach ( $work as $item ) : ?>
					<article class="portfolio-card" data-category="<?php echo esc_attr( $item['category'] ); ?>" data-reveal><?php nolan_young_template_render_image( $item['image'], $item['title'] ); ?><p class="eyebrow"><?php echo esc_html( $item['category'] ); ?></p><h3><a href="<?php echo esc_url( $item['url'] ); ?>"><?php echo esc_html( $item['title'] ); ?></a></h3><p><?php echo esc_html( $item['excerpt'] ); ?></p></article>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<?php get_template_part( 'template-parts/content', 'process' ); ?>
	<?php get_template_part( 'template-parts/content', 'style-pillars' ); ?>

	<section class="section route-band">
		<div class="container route-band__grid">
			<div><p class="eyebrow"><?php esc_html_e( 'Service-area route', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h2><?php esc_html_e( 'Grouped visits keep routes efficient and properties predictable.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2><p><?php esc_html_e( 'Evergreen Yardworks plans visits by neighborhood, access notes, weather windows, and the kind of cleanup each property needs.', '005-nolan-young-theme-evergreen-yardworks' ); ?></p></div>
			<div class="route-map" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
		</div>
	</section>

	<section class="section education-grid" aria-labelledby="education-title">
		<div class="container">
			<div class="section-heading"><p class="eyebrow"><?php esc_html_e( 'Lawn health education', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h2 id="education-title"><?php esc_html_e( 'Small choices add up to a yard that looks cared for longer.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2></div>
			<div class="card-grid card-grid--three">
				<?php foreach ( array( 'Mowing height' => 'Cutting at the right height protects turf during heat and helps thin spots recover.', 'Edging' => 'Clean walks, drives, and bed lines make the whole property feel finished.', 'Weeds' => 'Early weed-pressure notes help decide whether a cleanup, mulch refresh, or lawn health step is next.', 'Watering' => 'New beds and stressed turf need practical watering guidance, not guesswork.', 'Compaction' => 'High-traffic areas are flagged so expectations and next steps stay realistic.', 'Mulch depth' => 'Mulch should protect beds without burying crowns, trunks, or low plantings.' ) as $title => $text ) : ?>
					<article class="info-card" data-reveal><h3><?php echo esc_html( $title ); ?></h3><p><?php echo esc_html( $text ); ?></p></article>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<?php get_template_part( 'template-parts/content', 'testimonials' ); ?>

	<section class="section estimate-section" id="estimate">
		<div class="container split">
			<div><p class="eyebrow"><?php esc_html_e( 'Estimate request', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><h2><?php esc_html_e( 'Tell us what needs to look handled.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2><p><?php esc_html_e( 'Share the property type, service area, services needed, timing, access notes, and whether you have photos. Evergreen Yardworks will use that context to recommend a next visit or recurring plan.', '005-nolan-young-theme-evergreen-yardworks' ); ?></p><?php nolan_young_template_render_image( 'assets/images/hero/garden-crew-hands.jpg', __( 'Evergreen Yardworks landscape crew hands planting and improving garden beds', '005-nolan-young-theme-evergreen-yardworks' ), 'media-frame' ); ?></div>
			<div class="contact-panel"><h3><?php esc_html_e( 'Request an Estimate', '005-nolan-young-theme-evergreen-yardworks' ); ?></h3><?php nolan_young_template_render_contact_form(); ?></div>
		</div>
	</section>

	<section class="section faq-section">
		<div class="container narrow">
			<p class="eyebrow"><?php esc_html_e( 'FAQ', '005-nolan-young-theme-evergreen-yardworks' ); ?></p>
			<h2><?php esc_html_e( 'Questions homeowners ask before booking yard care.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2>
			<?php
			$faqs = array(
				__( 'What affects pricing?', '005-nolan-young-theme-evergreen-yardworks' ) => __( 'Lot size, grass height, bed condition, access, slopes, cleanup volume, disposal needs, and visit frequency all affect an estimate.', '005-nolan-young-theme-evergreen-yardworks' ),
				__( 'Do you handle recurring and one-time work?', '005-nolan-young-theme-evergreen-yardworks' ) => __( 'Yes. Evergreen Yardworks can discuss weekly care, biweekly maintenance, bed refreshes, seasonal resets, and one-time cleanup visits.', '005-nolan-young-theme-evergreen-yardworks' ),
				__( 'What happens when it rains?', '005-nolan-young-theme-evergreen-yardworks' ) => __( 'Crew schedules adjust around weather, turf conditions, and safe access. The goal is a tidy result without tearing up wet lawns.', '005-nolan-young-theme-evergreen-yardworks' ),
				__( 'What should I share about pets or gates?', '005-nolan-young-theme-evergreen-yardworks' ) => __( 'Use the estimate form for gate codes, latch notes, pet routines, slopes, parking, and any areas that need special care.', '005-nolan-young-theme-evergreen-yardworks' ),
				__( 'Can you remove yard waste?', '005-nolan-young-theme-evergreen-yardworks' ) => __( 'Yard-waste handling depends on the material, local rules, and cleanup size. Include disposal needs in your request.', '005-nolan-young-theme-evergreen-yardworks' ),
				__( 'How far ahead should I schedule?', '005-nolan-young-theme-evergreen-yardworks' ) => __( 'Spring and fall cleanup slots fill fastest. Photos, service notes, and flexible timing help Evergreen Yardworks estimate and schedule sooner.', '005-nolan-young-theme-evergreen-yardworks' ),
			);
			foreach ( $faqs as $question => $answer ) :
				?>
				<section class="accordion-item"><button type="button" aria-expanded="false"><?php echo esc_html( $question ); ?></button><div hidden><p><?php echo esc_html( $answer ); ?></p></div></section>
			<?php endforeach; ?>
		</div>
	</section>

	<?php get_template_part( 'template-parts/content', 'blog-preview' ); ?>

	<section class="section final-cta section-dark">
		<div class="container center">
			<p class="eyebrow"><?php esc_html_e( 'Next yard visit', '005-nolan-young-theme-evergreen-yardworks' ); ?></p>
			<h2><?php esc_html_e( 'Get your next yard visit on the calendar.', '005-nolan-young-theme-evergreen-yardworks' ); ?></h2>
			<p><?php esc_html_e( 'Send a few property notes, choose the services that matter most, and Evergreen Yardworks will help you plan the next cleanup or recurring route.', '005-nolan-young-theme-evergreen-yardworks' ); ?></p>
			<div class="button-row"><a class="btn btn-primary" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Request an Estimate', '005-nolan-young-theme-evergreen-yardworks' ); ?></a><a class="btn btn-secondary" href="<?php echo esc_url( home_url( '/services/' ) ); ?>"><?php esc_html_e( 'View Services', '005-nolan-young-theme-evergreen-yardworks' ); ?></a></div>
		</div>
	</section>
</main>
<?php get_footer(); ?>

