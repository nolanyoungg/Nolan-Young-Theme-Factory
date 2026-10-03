# Hearth & Honey

A fictional neighborhood sourdough bakery and coffee counter. The design pairs Georgia serif type, burgundy ink, butter yellow, scalloped edges and arched local bread photography. The homepage has five sections: welcome, daily bakes, story, weekly specials and visit.

## Pages

Create native WordPress pages at `/about/`, `/services/`, `/work/`, `/blog/`, `/contact/`, and `/privacy-policy/`. Create `featured` as a child of `services` for `/services/featured/`. The matching bakery layouts are selected by `page.php`; each can also be assigned from the Page Template selector. Set a Home page as the static front page in Settings > Reading. The journal layout also serves as the posts-index fallback.

The navigation uses ordinary same-frame links. Every page shares a home link and the branded footer. Menu, address, hours, prices and seasonal collections are fictional sample content.

## Assets and build

Run `npm run build` to compile source SCSS and JavaScript to `assets/css/bundle.css` and `assets/js/bundle.js`. Use the existing lockfile and dependencies; no remote runtime fonts, scripts or trackers are required. Prepared theme metadata and package identity are preserved.

The approved images and their provenance are in `assets/images/asset-manifest.json`. Both bread photographs appear throughout the theme with illustrative-stock captions and photographer credits. Decorative local SVGs are interface marks only.

## Inquiry demo

The contact controls do not submit, store or email information. The button only displays a static demo notice. There is no payment, reservation, subscription or custom content registration. A real bakery would need a separate form service and accurate business details before launch.

## Accessibility

Mobile navigation has a labeled toggle, accurate expanded state and Escape close. With JavaScript disabled, mobile links remain available. Native details provide FAQs. Visible focus, semantic landmarks, a skip link and reduced-motion support are included. Essential content is never hidden by animation. See `accessibility/README.md` for the manual review checklist.
