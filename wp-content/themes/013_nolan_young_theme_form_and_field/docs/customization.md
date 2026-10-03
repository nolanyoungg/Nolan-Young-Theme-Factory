# Customize Form & Field

The core palette is chalk `#f5f3ed`, stone `#e6e1d6`, ink `#252520` and rust `#91482f`. Change the source tokens and matching editor palette in `theme.json` together. Fonts use local system stacks; the theme does not download font files.

The homepage is intentionally limited to six sections. Adjust those sections in `front-page.php` and their corresponding template parts. Capability, study and journal data lives in `inc/helpers.php`. The unused comparison, filtering and mailing-list systems have been removed.

Header navigation is a compact set of links with one native capability disclosure. On small screens JavaScript enhances it to an inline drawer, closed by default. Keep the Services page link separate from its disclosure control.

Photography must remain traceable to `assets/images/asset-manifest.json`. Keep the footer credits and visible labels distinguishing photographs from fictional studies. The two supplied marks are decorative interface details and are shown in grayscale.

The contact form is intentionally a local demonstration. A production form service belongs in a separate integration with its own consent, data handling and delivery settings. Do not change the demo notice to a sent-message claim without implementing and testing that service.

After editing styles or interaction code, run `npm run build`. Review keyboard operation, reduced motion, and layouts at 390px, 768px and a desktop width before publication. In factory evaluation, failed generated output must be preserved rather than repaired after validation.
