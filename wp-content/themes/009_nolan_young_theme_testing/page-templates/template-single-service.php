<?php
/**
 * Template Name: Single Service
 *
 * @package 009_Nolan_Young_Theme_Testing
 */

get_header();
?>
<main id="primary" class="site-main interior-page">
	<section class="page-hero section-shell">
		<div class="container narrow-flow">
			<p class="section-kicker"><?php esc_html_e( 'Service Detail', '009_nolan_young_theme_testing' ); ?></p>
			<?php the_title( '<h1>', '</h1>' ); ?>
			<p><?php esc_html_e( 'Every engagement is scoped around business outcomes, operational constraints, and the level of system reliability the team actually needs.', '009_nolan_young_theme_testing' ); ?></p>
		</div>
	</section>
	<section class="section-shell">
		<div class="container two-column-copy">
			<div>
				<h2><?php esc_html_e( 'Value proposition', '009_nolan_young_theme_testing' ); ?></h2>
				<?php the_content(); ?>
			</div>
			<div>
				<h2><?php esc_html_e( 'Typical deliverables', '009_nolan_young_theme_testing' ); ?></h2>
				<ul class="check-list">
					<li><?php esc_html_e( 'Workflow mapping and implementation notes', '009_nolan_young_theme_testing' ); ?></li>
					<li><?php esc_html_e( 'Architecture and data-flow decisions', '009_nolan_young_theme_testing' ); ?></li>
					<li><?php esc_html_e( 'Interfaces, dashboards, or automation logic matched to the project', '009_nolan_young_theme_testing' ); ?></li>
					<li><?php esc_html_e( 'Launch planning, documentation, and support handoff', '009_nolan_young_theme_testing' ); ?></li>
				</ul>
			</div>
			<div>
				<h2><?php esc_html_e( 'Process', '009_nolan_young_theme_testing' ); ?></h2>
				<ol class="number-list">
					<li><?php esc_html_e( 'Discovery and workflow mapping', '009_nolan_young_theme_testing' ); ?></li>
					<li><?php esc_html_e( 'Architecture and roadmap', '009_nolan_young_theme_testing' ); ?></li>
					<li><?php esc_html_e( 'Interface review and build sequencing', '009_nolan_young_theme_testing' ); ?></li>
					<li><?php esc_html_e( 'Implementation, QA, and launch', '009_nolan_young_theme_testing' ); ?></li>
				</ol>
			</div>
			<div>
				<h2><?php esc_html_e( 'FAQ', '009_nolan_young_theme_testing' ); ?></h2>
				<p><strong><?php esc_html_e( 'How is scope handled?', '009_nolan_young_theme_testing' ); ?></strong><br><?php esc_html_e( 'By clarifying workflow, users, constraints, and rollout needs early rather than treating implementation as the discovery method.', '009_nolan_young_theme_testing' ); ?></p>
				<p><strong><?php esc_html_e( 'Can this start with a discovery phase?', '009_nolan_young_theme_testing' ); ?></strong><br><?php esc_html_e( 'Yes. Many service engagements begin with technical discovery to reduce risk before full build work begins.', '009_nolan_young_theme_testing' ); ?></p>
			</div>
		</div>
	</section>
</main>
<?php get_footer(); ?>
