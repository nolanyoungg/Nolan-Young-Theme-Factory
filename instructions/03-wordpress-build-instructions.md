# WordPress Build Instructions

- Write valid PHP, enqueue compiled local assets, and follow WordPress escaping rules.
- Use template hierarchy files, page templates, and template parts intentionally.
- Keep the code maintainable and direct.
- Do not introduce plugins or database assumptions that are required for basic operation.
- Implement the Nolan-menu header in `header.php`, local JS, and local CSS.
- Keep Contact as a right-side CTA, not a primary desktop nav item.
- Treat the homepage hero as a primary build surface: it needs prompt-specific positioning, strong CTA hierarchy, local imagery, trust/proof cues, responsive composition, and enough visual detail to feel like the first screen of a premium company website.
- Treat the footer as a complete website section, not a utility strip: include brand positioning, useful navigation groups, contact/CTA content, trust or service context, polished spacing, responsive layout, and visual continuity with the rest of the site.
- Use reusable template parts for home, services, about, work, blog, contact, and single service content.
- Reference local raster image assets from hero, services, work, visual story, and proof sections. Images must match the generated business category.
