<?php
/**
 * Template Name: About Us
 *
 * @package 009_Nolan_Young_Theme_Testing
 */

get_header();
?>
<main id="primary" class="site-main interior-page">
	<section class="page-hero section-shell">
		<div class="container narrow-flow">
			<p class="section-kicker"><?php esc_html_e( 'About', '009_nolan_young_theme_testing' ); ?></p>
			<h1><?php esc_html_e( 'A senior-engineer approach to custom software work.', '009_nolan_young_theme_testing' ); ?></h1>
			<p><?php esc_html_e( 'Northstar Codeworks helps founders and operations leaders replace fragile process stacks with reliable systems that are easier to run, easier to explain, and easier to maintain as the business grows.', '009_nolan_young_theme_testing' ); ?></p>
		</div>
	</section>
	<section class="section-shell section-shell--alt">
		<div class="container two-column-copy">
			<div>
				<h2><?php esc_html_e( 'Company philosophy', '009_nolan_young_theme_testing' ); ?></h2>
				<p><?php esc_html_e( 'Software is only valuable when it makes the business more legible. That means clarifying workflows, ownership, and system responsibilities before implementation volume takes over.', '009_nolan_young_theme_testing' ); ?></p>
			</div>
			<div>
				<h2><?php esc_html_e( 'Senior technical approach', '009_nolan_young_theme_testing' ); ?></h2>
				<p><?php esc_html_e( 'Engagements emphasize architecture, maintainability, realistic sequencing, and direct communication about tradeoffs so teams do not inherit avoidable complexity.', '009_nolan_young_theme_testing' ); ?></p>
			</div>
			<div>
				<h2><?php esc_html_e( 'What clients can expect', '009_nolan_young_theme_testing' ); ?></h2>
				<ul class="check-list">
					<li><?php esc_html_e( 'Clear scope and implementation logic', '009_nolan_young_theme_testing' ); ?></li>
					<li><?php esc_html_e( 'Reliable delivery rhythms and review checkpoints', '009_nolan_young_theme_testing' ); ?></li>
					<li><?php esc_html_e( 'Maintainable systems with documentation and handoff notes', '009_nolan_young_theme_testing' ); ?></li>
					<li><?php esc_html_e( 'Security and access considerations handled early', '009_nolan_young_theme_testing' ); ?></li>
				</ul>
			</div>
			<div>
				<h2><?php esc_html_e( 'Long-term partnership', '009_nolan_young_theme_testing' ); ?></h2>
				<p><?php esc_html_e( 'Many projects continue into support, optimization, and modernization work after launch. The goal is software that keeps making sense as the team changes around it.', '009_nolan_young_theme_testing' ); ?></p>
			</div>
		</div>
	</section>
</main>
<?php get_footer(); ?>
