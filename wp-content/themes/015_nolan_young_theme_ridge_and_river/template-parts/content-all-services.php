<?php
$ridge_river_services = array(
	array( 'day-walks', 'Day walks', '3–5 hours / Easy to moderate', 'Follow riverside paths, woodland tracks and open country at a pace that leaves room for a pause. A good first step if you want company, fresh air and a manageable day.', 'Time for tea, gentle route options and a shared meeting point.' ),
	array( 'ridge-routes', 'Ridge routes', '6–7 hours / Challenging', 'For regular walkers ready for a longer day: steady climbs, uneven ground and a broad horizon. The sample full-day itinerary gives you a closer look at the rhythm.', 'Route briefing, regular regrouping and a lower-level alternative.' ),
	array( 'private-guiding', 'Private guiding', 'Half or full day / Your pace', 'A day shaped around your own group, interests and comfort. Make space for photography, a quieter route or simply walking with the people you know best.', 'A route conversation, agreed pacing and a plan suited to the group.' ),
	array( 'navigation', 'Introductory navigation', '4 hours / Moderate', 'Slow down and start reading the land. Explore map symbols, contour shapes and simple compass bearings through short exercises along a walking route.', 'A small-group introduction; no qualifications or certification are claimed.' ),
);
foreach ( $ridge_river_services as $i => $service ) : ?>
<article class="service-entry" id="<?php echo esc_attr( $service[0] ); ?>" data-animate><span class="row-number"><?php echo esc_html( sprintf( '%02d', $i + 1 ) ); ?></span><div><p class="eyebrow"><?php echo esc_html( $service[2] ); ?></p><h2><?php echo esc_html( $service[1] ); ?></h2></div><div><p><?php echo esc_html( $service[3] ); ?></p><p class="small-note"><?php echo esc_html( $service[4] ); ?></p><a class="text-link" href="<?php echo esc_url( home_url( $i === 1 ? '/services/featured/' : '/contact/' ) ); ?>"><?php echo $i === 1 ? 'Read the ridge itinerary' : 'Explore this idea with us'; ?> ↗</a></div></article>
<?php endforeach; ?>
