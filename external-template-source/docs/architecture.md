# Architecture

This is a classic PHP WordPress theme enhanced by `theme.json`. Root templates control requests, template parts render presentation, `inc/` contains narrowly scoped theme modules, and `src/` is the only editable CSS/JavaScript source. Persistent content models and business operations live in the companion **Nolan Young Core** plugin.

## Boundaries

- Theme: layout, markup, editor styles, block styles, patterns, navigation, and presentation integration.
- Plugin: custom post types, taxonomies, form processing, stored submissions, access rules, and privacy operations.
- Generated files: `assets/css/bundle.css`, `assets/css/editor.css`, and `assets/js/bundle.js`; never edit these directly.
