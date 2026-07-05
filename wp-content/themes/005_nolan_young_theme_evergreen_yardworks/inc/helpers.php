<?php
/**
 * Shared Evergreen Yardworks data and rendering helpers.
 *
 * @package Nolan_Young_Template
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function nolan_young_template_page_url( $slug ) {
	return esc_url( home_url( '/' . trim( $slug, '/' ) . '/' ) );
}

function nolan_young_template_asset_uri( $path ) {
	return esc_url( get_theme_file_uri( ltrim( $path, '/' ) ) );
}

function nolan_young_template_services() {
	return array(
		'weekly-mowing'      => array(
			'title'   => __( 'Weekly Mowing', '005-nolan-young-theme-evergreen-yardworks' ),
			'url'     => nolan_young_template_page_url( 'services/weekly-mowing' ),
			'image'   => 'assets/images/portfolio/lawn-maintenance.jpg',
			'excerpt' => __( 'Route-based mowing with clean edging, careful trimming, hard-surface blowoff, and visit notes after every stop.', '005-nolan-young-theme-evergreen-yardworks' ),
			'bullets' => array( __( 'Scheduled mowing', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Edges along walks and drives', '005-nolan-young-theme-evergreen-yardworks' ), __( 'String trimming and blowoff', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Photo-ready closeout notes', '005-nolan-young-theme-evergreen-yardworks' ) ),
		),
		'lawn-health'        => array(
			'title'   => __( 'Lawn Health', '005-nolan-young-theme-evergreen-yardworks' ),
			'url'     => nolan_young_template_page_url( 'services/lawn-health' ),
			'image'   => 'assets/images/hero/curb-appeal-lawn.jpg',
			'excerpt' => __( 'Practical guidance on mowing height, spot seeding, shade patterns, weeds, watering, compaction, and seasonal timing.', '005-nolan-young-theme-evergreen-yardworks' ),
			'bullets' => array( __( 'Sun and shade observations', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Mowing-height guidance', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Weed-pressure notes', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Watering and recovery tips', '005-nolan-young-theme-evergreen-yardworks' ) ),
		),
		'bed-refresh'        => array(
			'title'   => __( 'Mulch and Bed Refresh', '005-nolan-young-theme-evergreen-yardworks' ),
			'url'     => nolan_young_template_page_url( 'services/mulch-bed-refresh' ),
			'image'   => 'assets/images/portfolio/landscape-install.jpg',
			'excerpt' => __( 'Bed edging, weed clearing, mulch installation, plant-spacing cleanup, and front-yard curb appeal resets.', '005-nolan-young-theme-evergreen-yardworks' ),
			'bullets' => array( __( 'Fresh bed edges', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Weed and debris removal', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Mulch installed at sensible depth', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Entry and foundation bed polish', '005-nolan-young-theme-evergreen-yardworks' ) ),
		),
		'spring-cleanup'     => array(
			'title'   => __( 'Spring Cleanup', '005-nolan-young-theme-evergreen-yardworks' ),
			'url'     => nolan_young_template_page_url( 'services/spring-cleanup' ),
			'image'   => 'assets/images/hero/garden-crew-hands.jpg',
			'excerpt' => __( 'Winter debris removal, the first trim, bed reset, early weed cleanup, and practical growth-season preparation.', '005-nolan-young-theme-evergreen-yardworks' ),
			'bullets' => array( __( 'Winter debris cleared', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Beds reset for growth', '005-nolan-young-theme-evergreen-yardworks' ), __( 'First-season trimming', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Cleanup notes for next visits', '005-nolan-young-theme-evergreen-yardworks' ) ),
		),
		'fall-cleanup'       => array(
			'title'   => __( 'Fall Cleanup', '005-nolan-young-theme-evergreen-yardworks' ),
			'url'     => nolan_young_template_page_url( 'services/fall-cleanup' ),
			'image'   => 'assets/images/portfolio/seasonal-planting.jpg',
			'excerpt' => __( 'Leaf removal, final mowing, perennial cutbacks where appropriate, bed cleanup, and winter-ready closeout.', '005-nolan-young-theme-evergreen-yardworks' ),
			'bullets' => array( __( 'Leaf and yard-waste removal', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Final mow and edge', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Perennial cutback guidance', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Winter-ready cleanup', '005-nolan-young-theme-evergreen-yardworks' ) ),
		),
		'pruning-trimming'   => array(
			'title'   => __( 'Pruning and Trimming', '005-nolan-young-theme-evergreen-yardworks' ),
			'url'     => nolan_young_template_page_url( 'services/pruning-trimming' ),
			'image'   => 'assets/images/portfolio/landscape-install.jpg',
			'excerpt' => __( 'Shape maintenance for shrubs, hedges, and small ornamental plants with careful sightline and walkway cleanup.', '005-nolan-young-theme-evergreen-yardworks' ),
			'bullets' => array( __( 'Shrub and hedge shaping', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Small ornamental plant care', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Walkway sightlines', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Debris removed after trimming', '005-nolan-young-theme-evergreen-yardworks' ) ),
		),
		'seasonal-planting'  => array(
			'title'   => __( 'Seasonal Planting', '005-nolan-young-theme-evergreen-yardworks' ),
			'url'     => nolan_young_template_page_url( 'services/seasonal-planting' ),
			'image'   => 'assets/images/portfolio/seasonal-planting.jpg',
			'excerpt' => __( 'Annual color, planters, front-entry improvements, and small garden updates that make the home feel cared for.', '005-nolan-young-theme-evergreen-yardworks' ),
			'bullets' => array( __( 'Annual color plans', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Porch and entry planters', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Small garden updates', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Plant spacing cleanup', '005-nolan-young-theme-evergreen-yardworks' ) ),
		),
		'storm-debris'       => array(
			'title'   => __( 'Storm Debris Cleanup', '005-nolan-young-theme-evergreen-yardworks' ),
			'url'     => nolan_young_template_page_url( 'services/storm-debris-cleanup' ),
			'image'   => 'assets/images/hero/garden-crew-hands.jpg',
			'excerpt' => __( 'Small branch, leaf, and debris cleanup after windy weather so lawns, beds, walks, and drives look handled again.', '005-nolan-young-theme-evergreen-yardworks' ),
			'bullets' => array( __( 'Small branch pickup', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Walks and drives cleared', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Bed debris removed', '005-nolan-young-theme-evergreen-yardworks' ), __( 'Follow-up maintenance notes', '005-nolan-young-theme-evergreen-yardworks' ) ),
		),
	);
}

function nolan_young_template_plans() {
	return array(
		array( 'title' => __( 'Weekly Care Plan', '005-nolan-young-theme-evergreen-yardworks' ), 'text' => __( 'Best for fast-growing lawns and properties that need a consistent route day, crisp edges, and tidy hard surfaces.', '005-nolan-young-theme-evergreen-yardworks' ) ),
		array( 'title' => __( 'Biweekly Maintenance', '005-nolan-young-theme-evergreen-yardworks' ), 'text' => __( 'A lighter recurring option for lower-growth yards, townhomes, rentals, and homeowners who handle some tasks themselves.', '005-nolan-young-theme-evergreen-yardworks' ) ),
		array( 'title' => __( 'Seasonal Reset', '005-nolan-young-theme-evergreen-yardworks' ), 'text' => __( 'One-time cleanup for spring growth, fall leaves, storm debris, listing photos, move-ins, and overdue curb appeal.', '005-nolan-young-theme-evergreen-yardworks' ) ),
		array( 'title' => __( 'Garden Bed Refresh', '005-nolan-young-theme-evergreen-yardworks' ), 'text' => __( 'Focused bed edging, weeding, mulch, pruning, and planting for entries, foundation beds, and common areas.', '005-nolan-young-theme-evergreen-yardworks' ) ),
		array( 'title' => __( 'HOA and Small Commercial', '005-nolan-young-theme-evergreen-yardworks' ), 'text' => __( 'Route-minded maintenance for small shared spaces, storefront entries, rental portfolios, and managed properties.', '005-nolan-young-theme-evergreen-yardworks' ) ),
	);
}

function nolan_young_template_articles() {
	return array(
		array( 'tag' => __( 'Spring', '005-nolan-young-theme-evergreen-yardworks' ), 'title' => __( 'When to Schedule Spring Cleanup', '005-nolan-young-theme-evergreen-yardworks' ), 'url' => nolan_young_template_page_url( 'blog/spring-cleanup-schedule' ), 'image' => 'assets/images/hero/garden-crew-hands.jpg', 'excerpt' => __( 'How to time debris removal, first cuts, bed reset work, and early weeds before the growth season gets ahead of you.', '005-nolan-young-theme-evergreen-yardworks' ) ),
		array( 'tag' => __( 'Mulch', '005-nolan-young-theme-evergreen-yardworks' ), 'title' => __( 'Mulch Depth Without Smothering Plants', '005-nolan-young-theme-evergreen-yardworks' ), 'url' => nolan_young_template_page_url( 'blog/mulch-depth-guide' ), 'image' => 'assets/images/portfolio/landscape-install.jpg', 'excerpt' => __( 'A practical guide to keeping mulch useful for moisture and curb appeal without piling it against stems or trunks.', '005-nolan-young-theme-evergreen-yardworks' ) ),
		array( 'tag' => __( 'Edges', '005-nolan-young-theme-evergreen-yardworks' ), 'title' => __( 'Why Clean Edges Change the Whole Yard', '005-nolan-young-theme-evergreen-yardworks' ), 'url' => nolan_young_template_page_url( 'blog/clean-lawn-edges' ), 'image' => 'assets/images/portfolio/lawn-maintenance.jpg', 'excerpt' => __( 'Sidewalks, drives, and bed lines do a lot of visual work when a property needs to look maintained quickly.', '005-nolan-young-theme-evergreen-yardworks' ) ),
		array( 'tag' => __( 'Fall', '005-nolan-young-theme-evergreen-yardworks' ), 'title' => __( 'Fall Leaf Removal Checklist', '005-nolan-young-theme-evergreen-yardworks' ), 'url' => nolan_young_template_page_url( 'blog/fall-leaf-checklist' ), 'image' => 'assets/images/portfolio/seasonal-planting.jpg', 'excerpt' => __( 'What to clear from turf, beds, drains, walkways, and corners before wet leaves become a bigger cleanup.', '005-nolan-young-theme-evergreen-yardworks' ) ),
		array( 'tag' => __( 'Watering', '005-nolan-young-theme-evergreen-yardworks' ), 'title' => __( 'Watering Newly Planted Beds', '005-nolan-young-theme-evergreen-yardworks' ), 'url' => nolan_young_template_page_url( 'blog/watering-new-beds' ), 'image' => 'assets/images/texture/meadow-texture.jpg', 'excerpt' => __( 'Simple watering habits that help new annuals, shrubs, and refreshed beds settle in without constant guesswork.', '005-nolan-young-theme-evergreen-yardworks' ) ),
	);
}

function nolan_young_template_work_items() {
	return array(
		array( 'category' => 'Cleanup', 'title' => __( 'Corner Lot Seasonal Reset', '005-nolan-young-theme-evergreen-yardworks' ), 'url' => nolan_young_template_page_url( 'work/corner-lot-seasonal-reset' ), 'image' => 'assets/images/hero/curb-appeal-lawn.jpg', 'excerpt' => __( 'A visible corner property received mowing, edging, bed clearing, and a seasonal route plan for easier upkeep.', '005-nolan-young-theme-evergreen-yardworks' ) ),
		array( 'category' => 'Beds', 'title' => __( 'Front-Bed Mulch Refresh', '005-nolan-young-theme-evergreen-yardworks' ), 'url' => nolan_young_template_page_url( 'work/front-bed-mulch-refresh' ), 'image' => 'assets/images/portfolio/landscape-install.jpg', 'excerpt' => __( 'Foundation beds were edged, weeded, mulched, and reset around existing plantings for a cleaner entry view.', '005-nolan-young-theme-evergreen-yardworks' ) ),
		array( 'category' => 'Route', 'title' => __( 'Weekly Route Maintenance', '005-nolan-young-theme-evergreen-yardworks' ), 'url' => nolan_young_template_page_url( 'work/weekly-route-maintenance' ), 'image' => 'assets/images/portfolio/lawn-maintenance.jpg', 'excerpt' => __( 'Recurring mowing, trimming, edging, and blowoff kept a residential route predictable through peak growing weeks.', '005-nolan-young-theme-evergreen-yardworks' ) ),
		array( 'category' => 'HOA', 'title' => __( 'HOA Common-Area Schedule', '005-nolan-young-theme-evergreen-yardworks' ), 'url' => nolan_young_template_page_url( 'work/hoa-common-area-schedule' ), 'image' => 'assets/images/texture/meadow-texture.jpg', 'excerpt' => __( 'Small shared green spaces were grouped into a tidy recurring plan with clear weather and access notes.', '005-nolan-young-theme-evergreen-yardworks' ) ),
		array( 'category' => 'Fall', 'title' => __( 'Fall Leaf Closeout', '005-nolan-young-theme-evergreen-yardworks' ), 'url' => nolan_young_template_page_url( 'work/fall-leaf-closeout' ), 'image' => 'assets/images/portfolio/seasonal-planting.jpg', 'excerpt' => __( 'Leaves, bed debris, final edges, and seasonal waste were handled before winter set into the property.', '005-nolan-young-theme-evergreen-yardworks' ) ),
		array( 'category' => 'Planting', 'title' => __( 'Entry Garden Color Update', '005-nolan-young-theme-evergreen-yardworks' ), 'url' => nolan_young_template_page_url( 'work/entry-garden-color-update' ), 'image' => 'assets/images/hero/garden-crew-hands.jpg', 'excerpt' => __( 'Seasonal color and planter updates gave the front entry a friendlier, more cared-for arrival point.', '005-nolan-young-theme-evergreen-yardworks' ) ),
	);
}

function nolan_young_template_render_image( $path, $alt = '', $class = '' ) {
	printf(
		'<img src="%1$s" alt="%2$s" class="%3$s" loading="lazy" decoding="async">',
		nolan_young_template_asset_uri( $path ),
		esc_attr( $alt ),
		esc_attr( $class )
	);
}

function nolan_young_template_render_logo() {
	?>
	<span class="brand-mark" aria-hidden="true"><?php echo file_get_contents( get_theme_file_path( 'assets/icons/platform-mark.svg' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
	<span class="site-branding__text">
		<span class="site-branding__name"><?php esc_html_e( 'Evergreen Yardworks', '005-nolan-young-theme-evergreen-yardworks' ); ?></span>
		<span class="site-branding__tagline"><?php esc_html_e( 'Reliable local lawn care', '005-nolan-young-theme-evergreen-yardworks' ); ?></span>
	</span>
	<?php
}

function nolan_young_template_render_contact_form( $form_type = 'estimate', $service = '' ) {
	$action = esc_url( admin_url( 'admin-post.php' ) );
	?>
	<form class="yardworks-form" method="post" action="<?php echo $action; ?>" novalidate data-enhanced-form>
		<input type="hidden" name="action" value="nolan_young_template_submit_form">
		<input type="hidden" name="form_type" value="<?php echo esc_attr( $form_type ); ?>">
		<input type="hidden" name="service" value="<?php echo esc_attr( $service ); ?>">
		<?php wp_nonce_field( 'nolan_young_template_form', 'nolan_young_template_form_nonce' ); ?>
		<div class="form-honeypot" aria-hidden="true"><label>Leave this field empty <input type="text" name="company_url" tabindex="-1" autocomplete="off"></label></div>
		<div class="form-grid">
			<label><?php esc_html_e( 'Name', '005-nolan-young-theme-evergreen-yardworks' ); ?><input required name="name" type="text" autocomplete="name"></label>
			<label><?php esc_html_e( 'Email', '005-nolan-young-theme-evergreen-yardworks' ); ?><input required name="email" type="email" autocomplete="email"></label>
			<label><?php esc_html_e( 'Phone', '005-nolan-young-theme-evergreen-yardworks' ); ?><input name="phone" type="tel" autocomplete="tel"></label>
			<label><?php esc_html_e( 'Property type', '005-nolan-young-theme-evergreen-yardworks' ); ?><select name="property_type"><option><?php esc_html_e( 'Single-family home', '005-nolan-young-theme-evergreen-yardworks' ); ?></option><option><?php esc_html_e( 'Townhome or duplex', '005-nolan-young-theme-evergreen-yardworks' ); ?></option><option><?php esc_html_e( 'Small HOA', '005-nolan-young-theme-evergreen-yardworks' ); ?></option><option><?php esc_html_e( 'Rental property', '005-nolan-young-theme-evergreen-yardworks' ); ?></option><option><?php esc_html_e( 'Small storefront', '005-nolan-young-theme-evergreen-yardworks' ); ?></option></select></label>
		</div>
		<label><?php esc_html_e( 'Street or service area', '005-nolan-young-theme-evergreen-yardworks' ); ?><input name="service_area" type="text" autocomplete="street-address"></label>
		<label><?php esc_html_e( 'Services needed', '005-nolan-young-theme-evergreen-yardworks' ); ?><textarea required name="services_needed" rows="4" placeholder="<?php esc_attr_e( 'Mowing, edging, bed refresh, cleanup, planting, storm debris, or recurring maintenance.', '005-nolan-young-theme-evergreen-yardworks' ); ?>"></textarea></label>
		<div class="estimate-checklist" data-estimate-checklist>
			<?php foreach ( array( 'Weekly mowing', 'Bed refresh', 'Spring cleanup', 'Fall cleanup', 'Pruning', 'Seasonal planting', 'Storm debris' ) as $interest ) : ?>
				<label><input type="checkbox" name="interests[]" value="<?php echo esc_attr( $interest ); ?>"> <span><?php echo esc_html( $interest ); ?></span></label>
			<?php endforeach; ?>
		</div>
		<div class="form-grid">
			<label><?php esc_html_e( 'Recurring or one-time', '005-nolan-young-theme-evergreen-yardworks' ); ?><select name="schedule_type"><option><?php esc_html_e( 'Recurring care', '005-nolan-young-theme-evergreen-yardworks' ); ?></option><option><?php esc_html_e( 'One-time cleanup', '005-nolan-young-theme-evergreen-yardworks' ); ?></option><option><?php esc_html_e( 'Not sure yet', '005-nolan-young-theme-evergreen-yardworks' ); ?></option></select></label>
			<label><?php esc_html_e( 'Timeline', '005-nolan-young-theme-evergreen-yardworks' ); ?><input name="timeline" type="text" placeholder="<?php esc_attr_e( 'This week, next month, before listing photos...', '005-nolan-young-theme-evergreen-yardworks' ); ?>"></label>
		</div>
		<label><?php esc_html_e( 'Access notes, pets, slopes, gates, yard waste, or photos', '005-nolan-young-theme-evergreen-yardworks' ); ?><textarea name="message" rows="4"></textarea></label>
		<p class="form-note"><?php esc_html_e( 'Photos of your property help Evergreen Yardworks estimate faster. Required fields are checked before submission.', '005-nolan-young-theme-evergreen-yardworks' ); ?></p>
		<button class="btn btn-primary" type="submit"><?php esc_html_e( 'Request an Estimate', '005-nolan-young-theme-evergreen-yardworks' ); ?></button>
	</form>
	<?php
}

function nolan_young_template_render_newsletter_form() {
	?>
	<form class="newsletter-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" data-enhanced-form>
		<input type="hidden" name="action" value="nolan_young_template_newsletter_signup">
		<?php wp_nonce_field( 'nolan_young_template_newsletter', 'nolan_young_template_newsletter_nonce' ); ?>
		<div class="form-honeypot" aria-hidden="true"><label>Leave this empty <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
		<label><?php esc_html_e( 'First name', '005-nolan-young-theme-evergreen-yardworks' ); ?><input name="first_name" type="text" autocomplete="given-name"></label>
		<label><?php esc_html_e( 'Email address', '005-nolan-young-theme-evergreen-yardworks' ); ?><input required name="email" type="email" autocomplete="email"></label>
		<button class="btn btn-secondary" type="submit"><?php esc_html_e( 'Get seasonal reminders', '005-nolan-young-theme-evergreen-yardworks' ); ?></button>
	</form>
	<?php
}
