# Nolan-Menu Header Contract

Generated themes must implement a premium header named around the `nolan-menu` system.

## Desktop Layout

- Left: logo mark and wordmark.
- Center primary nav: `Services`, `About`, `Work`, `Blog`.
- Right: `Contact Us` CTA button.
- Contact must not appear as a primary desktop nav item.
- Header must be sticky, stable, polished, and above page content.
- Header must have top and scrolled visual states without layout shift.

## Required Data Attributes

```html
<button data-menu-item="services"></button>
<div data-menu-dropdown="services"></div>

<button data-menu-item="about"></button>
<div data-menu-dropdown="about"></div>

<button data-menu-item="blog"></button>
<div data-menu-dropdown="blog"></div>
```

Rail controls must use matching keys:

```html
<button data-rail-item="<key>"></button>
<section data-rail-content="<key>"></section>
```

## Required Behavior

- Trigger buttons use `aria-controls`.
- Trigger buttons update `aria-expanded`.
- Only one panel can be open at a time.
- Clicking the same trigger toggles the active panel closed.
- Opening a new panel closes the previous panel.
- Outside click closes the active panel.
- Escape closes the active panel.
- Backdrop appears when a panel or mobile drawer is open.
- Body scroll locks while a panel or mobile drawer is open.
- Closed panels are hidden from assistive technology.
- Inactive rail content must not expose hidden links or buttons to keyboard users.
- Rail hover and keyboard focus update active content.
- JavaScript must initialize safely if optional panels are absent.

## Static Preview Links

- Logo links to `homepage_preview.html`.
- Services links to `services_preview.html`.
- About links to `about-us_preview.html`.
- Work links to `work_preview.html`.
- Blog links to `blog_preview.html`.
- Contact CTA links to `contact_preview.html`.
- Service detail links point to `single_services_preview.html`.

## WordPress Links

- Services links to `/services/`.
- About links to `/about-us/` unless the prompt requires `/about/`.
- Work links to `/work/`.
- Blog links to `/blog/`.
- Contact CTA links to `/contact/`.
- Service detail links use valid service URLs or generated service permalinks.
