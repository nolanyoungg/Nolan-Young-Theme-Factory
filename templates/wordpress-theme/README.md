# WordPress Theme Template

Generated themes must follow the required structure from `AGENTS.md` and `contracts/required-theme-structure.md`, then add prompt-specific design, copy, imagery, and polish.

Important conventions:

- Compile source assets into `assets/css/bundle.css` and `assets/js/bundle.js`.
- Enqueue compiled assets from WordPress.
- Keep PHP escaped and sanitized.
- Include docs, accessibility notes, README, and changelog.
- Implement the Nolan-menu header contract from `contracts/nolan-menu-header.md`.
- Keep primary desktop nav exactly `Services`, `About`, `Work`, `Blog`; Contact belongs only in the right-side CTA.
- Store copyright-safe, industry-appropriate demo images under `assets/images/` with descriptive filenames.
- Use reusable template parts for home, services, about, work, blog, contact, and single service layouts.
- Ensure the static previews can mirror the WordPress templates closely.
