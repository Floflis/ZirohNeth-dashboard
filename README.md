# ZirohNeth Dashboard

Dashboard and visited-site manager for ZirohNeth, descended from the ZeroNet Hello dashboard.

## Content format support

The dashboard displays the content metadata supplied by the ZirohNeth core:

- **Content v1:** legacy Bitcoin identities and legacy SHA-512 file manifests.
- **Content v2:** Ethereum EOA identities, BLAKE3-256 file hashes and EIP-712 signatures.
- **Historical Bitcoin sites:** marks a migrated legacy identity and exposes the Ethereum destination in the site menu.

The dashboard is a presentation layer. It does **not** independently verify Bitcoin or EIP-712 signatures in browser JavaScript. Cryptographic validation, migration-proof verification and rollback pinning are responsibilities of the ZirohNeth core before site metadata is exposed to the UI.

Historical site menus intentionally omit update, pause/resume, clone and delete actions. They retain the option to export the historical copy and provide a link to the Ethereum destination when the migration target is available.

## Source and browser bundle

UI source is maintained in CoffeeScript under `js/`. The browser loads the checked-in `js/all.js` bundle directly from `index.html`; changes to CoffeeScript must be reflected in that bundle. Styles are maintained in the individual CSS files and the checked-in aggregate `css/all.css`.

There is currently no build script or dependency manifest in this repository. Until a reproducible build pipeline is added, keep source and browser artifacts synchronized and verify both when changing the UI.

## Compatibility

Legacy v1 metadata remains supported. Sites without v2 fields are presented as Bitcoin/v1 with legacy SHA-512 labeling. V2 badges are derived from `content_version`, `identity_scheme`, and `hash_algorithm`; historical state is derived from migration metadata or site settings.
