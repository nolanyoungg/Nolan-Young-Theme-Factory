# Set up Hearth & Honey

Activate the theme in WordPress. Create Home and select it as the static front page in Settings > Reading. Create the following native pages:

| Slug | Page template |
| --- | --- |
| about | Our bakery story |
| services | Bake and coffee menu |
| work | Seasonal bake collection |
| blog | Bread journal |
| contact | Visit and catering |
| privacy-policy | Privacy and demo details |
| services/featured | Weekend bread box |

For the last route, create a page with slug `featured` and set Services as its parent. These ordinary pages also receive their bakery layouts by slug through `page.php`. Set the privacy page in Settings > Privacy. Navigation destinations are in the shared helper and header.

The sample journal contains three complete bread-care notes. Native posts can use the individual post template. The sample contact layout is deliberately non-submitting and does not need credentials or a backend.

Use `npm run build` after changing SCSS or JavaScript. The existing webpack build writes only local CSS and JavaScript bundles. Use `npm run dev` for local watch mode. No dependency additions are needed.
