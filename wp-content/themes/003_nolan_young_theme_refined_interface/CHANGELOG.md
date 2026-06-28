# Changelog

## 1.2.1 - 2026-06-23

- Added `npm run dev` as a production-mode watch command that performs an initial clean/lint pass, watches source files, and emits minified assets after each change.
- Preserved `npm run start` as the faster, unminified WordPress development watcher for debugging and source-map-friendly local work.
- Added `npm run dev:fast`, `npm run build:assets`, and `npm run check` for explicit local-development and CI workflows.
- Strengthened `npm run build` into the final production gate: clean generated files, lint maintained source, compile optimized assets, and run structural validation before exiting.
- Updated `npm test` and `npm run package` to reuse the final production build gate without maintaining duplicate release logic.
- Expanded the theme README with a detailed command decision guide, watch-mode behavior, final-build order, failure handling, and release workflow.
- Added validator checks that require the documented npm command contract and direct webpack development dependency.

## 1.2.0 - 2026-06-23

- Replaced the placeholder dependency-free compiler with a production webpack pipeline based on the WordPress-maintained `@wordpress/scripts` package.
- Added a root `webpack.config.js` that extends the WordPress webpack defaults and builds frontend JavaScript, frontend SCSS, and editor SCSS from `/src` into `/assets`.
- Added WordPress-generated `*.asset.php` dependency/version metadata and updated the enqueue layer to consume it safely.
- Added generated right-to-left stylesheets and configured the frontend bundle for WordPress RTL replacement.
- Added focused build helpers for cleaning generated files, validating theme structure and architecture boundaries, and creating a one-root-folder production ZIP.
- Added a committed PHPUnit configuration, expanded required-file tests for compiled/RTL assets, and documented the WordPress test-library workflow.
- Added `npm run start`, `build`, `clean`, `lint`, `lint:js`, `lint:node`, `lint:css`, `format`, `validate`, `test`, and `package` development commands.
- Migrated Sass entry files from deprecated `@import` usage to `@use`.
- Applied WordPress JavaScript and CSS coding-standard formatting to maintained source files.
- Added explicit mega-menu related-link classes so dynamically generated and server-rendered links share the same stable styling contract.
- Replaced the theme README with a comprehensive development, architecture, installation, build, security, accessibility, internationalization, testing, packaging, and maintenance manual aligned with the actual implementation.

## 1.1.3 - 2026-06-23

- Set the desktop Services and About mega-menu columns to a 35% options-list area and a 65% featured-content area.
- Preserved the existing single-column mobile layout.

## 1.1.2 - 2026-06-23

- Expanded the desktop Services, About, and Blog dropdown panels to the full header/viewport width.
- Reduced the Services and About featured-image height so the image occupies less dropdown space.

## 1.1.1 - 2026-06-23

- Moved the Services and About featured panels to the right side of their mega menus.
- Moved each selected item’s related sub-links into the dynamic featured panel.

## 1.1.0 - 2026-06-23

- Added click-controlled Services, About, and Blog mega menus.
- Added dynamic featured-content switching for Services and About.
- Added automatically populated latest-post cards for Blog.
- Added keyboard controls, outside-click dismissal, responsive layouts, and reduced-motion support.
- Preserved WordPress-managed primary menu assignment and ordering.

## 1.0.0 - 2026-06-23

- Initial WordPress 7.0 production release.
- Added classic template hierarchy with `theme.json` version 3.
- Added accessible navigation, editor styles, patterns, page templates, and companion-plugin integration.
- Added deterministic source build and validation scripts.
