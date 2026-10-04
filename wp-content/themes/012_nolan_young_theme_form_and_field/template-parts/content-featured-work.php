<section class="selected-work section container" aria-labelledby="work-title">
    <div class="section-heading"><div><p class="eyebrow">02 / Selected explorations</p><h2 id="work-title">Ideas made <em>spatial.</em></h2></div><p>Three concept studies.<br>Different scales. A shared sensibility.</p></div>
    <div class="study-grid">
    <?php foreach ( ff_projects() as $project ) : ?>
        <article class="study" data-reveal><a class="study__image" href="<?php echo ff_url( '/work/' ) . '#' . esc_attr( $project['id'] ); ?>" aria-label="Explore <?php echo esc_attr( $project['title'] ); ?>"><?php ff_image( $project['image'] ); ?><span class="study__badge">Concept study / <?php echo esc_html( $project['number'] ); ?></span><span class="study__arrow" aria-hidden="true">↗</span></a><div class="study__caption"><div><h3><a href="<?php echo ff_url( '/work/' ) . '#' . esc_attr( $project['id'] ); ?>"><?php echo esc_html( $project['title'] ); ?></a></h3><p><?php echo esc_html( $project['type'] ); ?></p></div><span class="drawing-number"><?php echo esc_html( $project['number'] ); ?></span></div></article>
    <?php endforeach; ?>
    </div><p class="photo-note">Concepts by a fictional practice. Photographs are material and atmosphere references, not completed projects.</p>
</section>
