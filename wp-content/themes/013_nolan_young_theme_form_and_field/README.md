# Form & Field

An editorial WordPress theme for a fictional independent architecture and interiors practice. The visual system uses chalk, warm stone, black ink and restrained rust, with system serif typography, fine rules and deliberate photographic crops.

The homepage has six sections: introduction, studio philosophy, selected concept studies, capabilities, process and invitation. About, Services, Work, Journal, Contact, Privacy and Residential Architecture are complete sample pages. The three studies are expressly fictional and unbuilt.

## Setup

See [Getting started](docs/getting-started.md) for the exact native WordPress page slugs and templates. No content types, automatic page creation or rewrite endpoints are installed. Navigation uses ordinary same-frame links.

## Build

Run `npm run build` in this directory to compile local CSS and JavaScript with the prepared dependencies. `npm run dev` watches source changes. Keep the existing package name, prepared theme metadata and bundle paths. There are no dependency additions or remote runtime libraries.

## Content and design

Editorial data is in `inc/helpers.php`; page compositions are in `page-templates/`; shared sections are in `template-parts/`. SCSS tokens live in `src/scss/abstracts/_variables.scss`. See [Customization](docs/customization.md) and [Accessibility](accessibility/README.md).

## Inquiry demonstration

The project form performs browser validation only. Its controls have no submission field names; there is no delivery handler, data store or email notification. The check button clearly reports that nothing was sent or stored. With JavaScript disabled the fields remain readable and the check button is disabled.

## Approved imagery

Only the two seeded stock photographs and two local interface marks are used. The unchanged asset manifest is `assets/images/asset-manifest.json`. Photography is illustrative, not a record of work by the fictional studio. Credits and source links appear in the footer. No project results, client endorsements or professional credentials are claimed.

## Evaluation boundary

This source pass does not produce previews, archives or run reports. A deterministic build and read-only source checks are separate from the factory's later preview, packaging and visual evaluation.
