<?php
/** Form & Field editorial data. Every study is a fictional concept. */
if ( ! defined( 'ABSPATH' ) ) { exit; }
function ff_url( $path = '/' ) { return esc_url( home_url( $path ) ); }
function ff_image( $name = 'hero', $class = '', $eager = false ) {
    $photos = array(
        'hero' => array( 'assets/images/hero/editorial-hero.jpg', 'White concrete building with long recessed windows beneath a pale sky', 1600, 1067 ),
        'detail' => array( 'assets/images/portfolio/editorial-detail.jpg', 'Weathered beige concrete building with an arched recess and an opening to the sky', 1600, 1086 ),
    );
    $photo = $photos[ $name ];
    printf( '<img src="%s" alt="%s" class="%s" width="%d" height="%d" loading="%s" decoding="async"%s>', esc_url( get_theme_file_uri( $photo[0] ) ), esc_attr( $photo[1] ), esc_attr( $class ), $photo[2], $photo[3], $eager ? 'eager' : 'lazy', $eager ? ' fetchpriority="high"' : '' );
}
function ff_mark( $number = 1 ) {
    $file = 2 === $number ? 'assets/icons/mark-2.svg' : 'assets/icons/mark-1.svg';
    printf( '<img class="interface-mark" src="%s" alt="" width="32" height="32" aria-hidden="true">', esc_url( get_theme_file_uri( $file ) ) );
}
function ff_projects() {
    return array(
        array( 'id' => 'courtyard-house', 'number' => '01', 'title' => 'Courtyard House', 'type' => 'Residential architecture', 'image' => 'hero', 'note' => 'A home organised around a little open sky.', 'approach' => 'An inward-looking plan gathers kitchen, living and work spaces around a planted court. Deep thresholds give everyday routines a place to pause, while a sheltered edge extends the living space outdoors.', 'materials' => 'Limewashed walls, pale timber joinery and a mineral floor bring warmth to a restrained palette. External shading is considered before additional glazing.', 'brief' => 'A compact family home with a shared centre and quiet rooms at its edges.' ),
        array( 'id' => 'the-second-life', 'number' => '02', 'title' => 'The Second Life', 'type' => 'Adaptive reuse', 'image' => 'detail', 'note' => 'Keeping the character. Making room for change.', 'approach' => 'This imagined conversion retains a masonry shell and introduces a freestanding timber structure. Existing openings guide the plan; new partitions stop short of the old walls so the original building remains legible.', 'materials' => 'Reclaimed brick, repairable lime plaster and demountable timber fittings. A material survey would establish what could be retained before anything is removed.', 'brief' => 'An unused neighbourhood workshop reimagined as a shared place to gather.' ),
        array( 'id' => 'rooms-in-sequence', 'number' => '03', 'title' => 'Rooms in Sequence', 'type' => 'Interior design', 'image' => 'hero', 'note' => 'A quieter interior, one threshold at a time.', 'approach' => 'A sequence of furniture-scale elements replaces an open room without character. Storage becomes a dividing wall, a window seat becomes a destination, and circulation becomes useful rather than leftover space.', 'materials' => 'Oiled oak, woven textiles and brushed metal offer contrasting textures. A limited family of finishes allows small details and changing daylight to do the work.', 'brief' => 'A flexible apartment interior shaped around reading, cooking and hosting.' ),
    );
}
function ff_capabilities() {
    return array(
        array( 'title' => 'Residential architecture', 'id' => 'residential', 'text' => 'Homes shaped by daily rituals, the particulars of a site and the people who will live there.', 'detail' => 'From a first feasibility study to coordinated drawings, we explore proportion, daylight, privacy and the relationship between inside and outside.', 'scope' => 'New homes · Extensions · Thoughtful alterations' ),
        array( 'title' => 'Adaptive reuse', 'id' => 'reuse', 'text' => 'A careful next chapter for buildings that already have a story.', 'detail' => 'We begin with what is present. A measured survey and a conversation about future use help distinguish what should stay, what can adapt and where a new intervention can add value.', 'scope' => 'Existing buildings · New uses · Sensitive interventions' ),
        array( 'title' => 'Interior design', 'id' => 'interiors', 'text' => 'Tactile, useful rooms where material, light and detail belong together.', 'detail' => 'We consider the room from the scale of a plan to the touch of a handle. Joinery, lighting and finishes are developed together, with time for samples and practical decisions.', 'scope' => 'Spatial planning · Bespoke joinery · Material palettes' ),
    );
}
function ff_intro( $label, $title, $copy ) {
    echo '<header class="page-intro container"><p class="eyebrow">' . esc_html( $label ) . '</p><h1>' . esc_html( $title ) . '</h1><p class="page-intro__copy">' . esc_html( $copy ) . '</p></header>';
}
