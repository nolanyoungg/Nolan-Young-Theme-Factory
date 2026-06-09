# Required Theme Structure

Generated themes must include the full classic WordPress structure described in `AGENTS.md`.

Key points:

- All required root PHP files must exist.
- The `inc/`, `assets/`, `src/`, `template-parts/`, `page-templates/`, `build/`, `docs/`, and `accessibility/` folders must exist.
- Compiled assets must be present in `assets/css/bundle.css` and `assets/js/bundle.js`.
- Header markup must implement the Nolan-menu contract in `contracts/nolan-menu-header.md`.
- Theme templates must share structure, class names, and content rhythm with the static preview pages.
- Local industry-appropriate demo images must exist under `assets/images/` and be used by hero, service, portfolio/work, and visual story sections.
- The theme must remain installable as a normal WordPress theme ZIP.
