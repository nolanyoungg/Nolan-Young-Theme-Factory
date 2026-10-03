# Set up Form & Field

Activate the theme in WordPress. Create the following native pages and set Home as the static front page under Settings → Reading. Use readable permalinks so these paths are available.

| Page | Path | Template |
| --- | --- | --- |
| Home | / | Automatic front page |
| About | /about/ | About the Practice |
| Services | /services/ | Studio Services |
| Work | /work/ | Concept Studies |
| Journal | /blog/ | Studio Journal |
| Contact | /contact/ | Project Inquiry |
| Privacy | /privacy-policy/ | Privacy Note |
| Residential architecture | /services/featured/ | Residential Architecture |

For the residential page, use the slug `featured` and choose Services as its parent. Assign the listed templates in the page editor. The default page template also recognizes these slugs. If Journal is selected as the native posts page, `home.php` displays the same three complete sample notes.

The masthead and footer share explicit sample destinations. Update the navigation helper and masthead together if changing page slugs. The wordmark always links home. No separate terms page is required.

The supplied compositions contain curated sample copy. General pages and single posts continue to display WordPress editor content. To publish a real studio site, replace the fictional claims and concept narratives with verified content and use a separate form integration before collecting real inquiries.

Use `npm run build` for the production bundles and `npm run dev` for watched changes. All runtime images, CSS and JavaScript remain inside the theme. The theme does not provision pages or change the WordPress database.
