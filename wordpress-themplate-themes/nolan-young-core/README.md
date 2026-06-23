# Nolan Young Core

A companion plugin for the Nolan Young WordPress 7.0 theme. It owns durable functionality that must survive a theme change: the Service content type and taxonomy, private contact inquiries, consent-aware newsletter records, page access rules, and WordPress privacy export/erasure integration.

## Shortcodes

- `[nolan_young_contact_form]`
- `[nolan_young_newsletter_form]`

## Integration hooks

- `ny_core_contact_submitted` receives the inquiry ID and sanitized fields.
- `ny_core_newsletter_subscribed` receives the subscriber ID and sanitized email.

Data is retained on uninstall unless `NY_CORE_REMOVE_DATA` is explicitly defined as `true`.
