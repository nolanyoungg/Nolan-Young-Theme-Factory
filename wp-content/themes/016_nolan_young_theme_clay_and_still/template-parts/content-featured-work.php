<?php /** An asymmetric pair of illustrative vessel studies. */ ?>
<section class="collection-section wrap section-space" aria-labelledby="collection-title">
	<div class="section-heading"><div><p class="eyebrow">01 / Selected forms</p><h2 id="collection-title">A place for<br><em>the everyday.</em></h2></div><p>A branch from a morning walk.<br>A corner that catches the light.<br>A small object, quietly belonging.</p></div>
	<div class="form-studies">
		<?php foreach ( clay_still_forms() as $form ) : ?>
		<article class="form-study reveal">
			<a class="study-image study-image--<?php echo esc_attr( $form['image'] ); ?>" href="<?php echo clay_still_url( '/work/#study-' . $form['number'] ); ?>"><?php clay_still_image( $form['image'] ); ?><span class="image-arrow" aria-hidden="true">↗</span></a>
			<div class="study-caption"><span class="study-number"><?php echo esc_html( $form['number'] ); ?></span><div><h3><a href="<?php echo clay_still_url( '/work/#study-' . $form['number'] ); ?>"><?php echo esc_html( $form['name'] ); ?></a></h3><p><?php echo esc_html( $form['material'] ); ?></p></div></div>
		</article>
		<?php endforeach; ?>
	</div>
	<div class="collection-bottom"><p class="small-note">An illustrative collection, not items offered for sale.</p><a class="text-link" href="<?php echo clay_still_url( '/work/' ); ?>">Meet the forms <span aria-hidden="true">↗</span></a></div>
</section>
