<?php
/** Form & Field editorial data. All studies are fictional and unbuilt. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function form_field_url( $path = '' ) {
	return esc_url( home_url( '/' . ( $path ? trim( $path, '/' ) . '/' : '' ) ) );
}
function form_field_image( $kind = 'hero', $class = '', $eager = false ) {
	$detail = 'detail' === $kind;
	$path = $detail ? 'assets/images/portfolio/editorial-detail.jpg' : 'assets/images/hero/editorial-hero.jpg';
	$alt = $detail ? 'Beige concrete walls framing sky, shadow and an arched recess.' : 'White concrete building with long horizontal windows beneath a pale sky.';
	printf( '<img src="%s" alt="%s" class="%s" width="1600" height="%s" loading="%s" decoding="async"%s>', esc_url( get_theme_file_uri( $path ) ), esc_attr( $alt ), esc_attr( $class ), $detail ? '1086' : '1067', $eager ? 'eager' : 'lazy', $eager ? ' fetchpriority="high"' : '' );
}
function form_field_navigation() {
	return array( '' => 'Home', 'about' => 'About', 'services' => 'Services', 'work' => 'Work', 'blog' => 'Journal', 'contact' => 'Contact' );
}
function form_field_services() {
	return array(
		array( 'title' => 'Residential architecture', 'text' => 'Homes shaped around everyday rituals. We begin with the site, the light and the small details that make a place your own.', 'note' => 'New homes · Extensions · Renovations', 'url' => form_field_url( 'services/featured' ) ),
		array( 'title' => 'Adaptive reuse', 'text' => 'A thoughtful next chapter for existing buildings. We look for what is worth keeping before deciding what needs to change.', 'note' => 'Existing fabric · New purpose · Careful additions', 'url' => form_field_url( 'services' ) . '#reuse' ),
		array( 'title' => 'Interior design', 'text' => 'Quietly expressive interiors, from the flow between rooms to the feel of a handle. Durable materials, considered proportions and room to live.', 'note' => 'Spatial planning · Joinery · Material palettes', 'url' => form_field_url( 'services' ) . '#interiors' ),
	);
}
function form_field_projects() {
	return array(
		array( 'id' => 'courtyard', 'title' => 'The Courtyard House', 'type' => 'Residential / Concept study 01', 'image' => 'hero', 'idea' => 'A home that turns inward to a planted court, bringing daylight and a moment of stillness into a compact footprint.', 'approach' => 'Arrange the shared rooms around a sheltered garden. A deeper threshold between street and living space offers privacy without closing out the sky.', 'materials' => 'Pale mineral render, timber screens and a continuous stone threshold. These are proposed materials, not a specification.' ),
		array( 'id' => 'old-workshop', 'title' => 'A Second Life', 'type' => 'Adaptive reuse / Concept study 02', 'image' => 'detail', 'idea' => 'An imagined workshop becomes a place to gather, retaining the traces of its original working life.', 'approach' => 'Keep the existing perimeter and insert a light, reversible interior structure. Let a shared table become the centre of a flexible room.', 'materials' => 'Retained masonry, reclaimed timber and lightly finished steel. Reuse would depend on condition surveys and local availability.' ),
		array( 'id' => 'quiet-rooms', 'title' => 'Rooms for Pause', 'type' => 'Interiors / Concept study 03', 'image' => 'detail', 'idea' => 'A sequence of calm domestic rooms connected by warm surfaces, soft daylight and generous places to sit.', 'approach' => 'Use joinery to define thresholds rather than adding more walls. Place storage at the edges so the centre of each room stays open.', 'materials' => 'Oiled oak, lime plaster and woven natural fibres. A restrained palette selected for repairability and the way it ages.' ),
	);
}
function form_field_notes() {
	return array(
		array( 'id' => 'light', 'title' => 'Start with the light.', 'label' => '01 / Observation', 'intro' => 'Before drawing a room, spend a day watching it.', 'text' => 'Morning light and late afternoon light make different spaces. Note where the sun falls, which views invite you to pause and when glare makes a room uncomfortable. A simple sketch at three times of day can reveal more than a photograph.', 'ending' => 'Use those observations to place the activities you care about: a breakfast table, a reading chair, a clear work surface. Bigger windows are not always the answer; the depth of an opening and a well-placed shade can matter just as much.' ),
		array( 'id' => 'scale', 'title' => 'Measure for living.', 'label' => '02 / Proportion', 'intro' => 'A room is more than its floor area.', 'text' => 'A generous room can still feel awkward if a door cuts through its best corner. Draw the furniture you actually use, then trace the paths between it. Leave space to pull out a chair, open a cupboard and pass someone without a negotiation.', 'ending' => 'Try marking a proposed layout with tape before committing to it. Pay attention to the height of a sill, the reach of a shelf and the distance between a seat and a view. Good proportion starts with the body.' ),
		array( 'id' => 'reuse', 'title' => 'Keep what has a future.', 'label' => '03 / Resources', 'intro' => 'The first design decision can be to leave something in place.', 'text' => 'Begin a renovation with an inventory. Separate what is sound, what can be repaired and what needs specialist assessment. A worn surface may hold character; a hidden defect may require a more careful intervention.', 'ending' => 'Ask how a new element could be taken apart later. Accessible fixings, repairable finishes and simple material junctions leave options open for the next occupant. Reuse is a design question as much as a sourcing decision.' ),
	);
}
