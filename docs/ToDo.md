# Dashboard ToDo

This list tracks dashboard work that remains unimplemented or unverified. A task is complete only after the backend contract, source, generated browser bundle and relevant tests agree.

## Content v2 identity and verification

- [ ] Add UI tests for Ethereum identity with manifest pending, verified v2, invalid manifest, legacy content and unavailable verification.
- [ ] Confirm the backend API exposes content_verification_status and migration_state consistently in every site-list and site-info response.
- [ ] Test that forged migration_status, migration_role and arbitrary migration metadata never create a historical badge or destination link.
- [ ] Add explicit UI states for migration_pending, migration_conflict and verification_unavailable, including accessible explanations.
- [ ] Add browser tests for direct Ethereum URL entry, site list, reload, internal links, lowercase/checksummed addresses, missing site, invalid manifest and unavailable peers.

## Migration workflow and compatibility

- [ ] Implement guided migration only after backend staging, journal recovery and conflict handling are complete.
- [ ] Show preflight results before any signing or file mutation, including includes, user_contents and transport limitations.
- [ ] Show source/destination identities, immutable snapshot, signing/acceptance phases, progress and actionable errors.
- [ ] Provide backend-confirmed resume and safe-abort actions; never let the UI independently mark migration complete.
- [ ] Document Ethereum onion-peer restrictions separately from global Tor/tracker behavior.

## Build and release

- [x] Run the pinned CoffeeScript build and prove js/all.js is byte-for-byte reproducible from js/ sources (GitHub Actions run 3 passed).
- [x] Verify the build workflow succeeds on a clean runner and that generated bundle changes are included in pull requests (the workflow regenerated and committed js/all.js, then passed the bundle check).
- [ ] Add smoke tests against the browser bundle and a real backend, not only CoffeeScript source.
- [ ] Run browser-level regression tests for historical read-only menus and verified destination navigation.
