# Blue Hour customization

The homepage composition is defined in front-page.php with five focused template parts. Sample lineup data and presentation helpers live in inc/helpers.php. Inner-page copy lives in page-templates; page-slug wrappers use normal WordPress template selection.

Colors are defined in src/scss/abstracts/_variables.scss and mirrored in theme.json. Typography uses installed system fonts. Header, footer, homepage, and inner-page styles each have focused modules. Edit source SCSS, then run `npm run build`.

Only the two approved local piano photographs may be used in this generation. Keep their manifest provenance and the footer credits. Photography is illustrative. Do not imply real performances, facilities, ticket availability, or venue capacity.

The contact form is intentionally a local demo. An actual booking system would require a separately configured provider and operator-specific privacy information.
