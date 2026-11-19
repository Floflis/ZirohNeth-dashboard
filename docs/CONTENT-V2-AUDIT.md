# Content v2 dashboard audit findings

**Status:** static UI/source audit, not a browser test report  
**Scope:** Ethereum/v2 identity display, historical-site state, migration UX, URL routing assumptions, source/bundle consistency  
**Audited revision:** `master` at the time of review (2026-11-19)  
**Related backend audit:** `Floflis/ZirohNeth/docs/CONTENT-V2-AUDIT.md`

This document records dashboard-specific findings. It does not duplicate backend cryptographic findings except where the dashboard consumes or presents backend state.

## Executive summary

The dashboard has initial support for recognizing Ethereum-shaped addresses, displaying v2 identity badges, and treating migrated Bitcoin identities as historical. The main risks are that the UI can infer security state from incomplete or unverified metadata, and that the migration lifecycle is not yet represented as a complete user workflow.

No browser automation, compiled build, or end-to-end backend/dashboard test was run during this review.

## Findings

### D2-01. Identity badges can describe v2 properties before a v2 manifest has been confirmed

**Severity:** Medium  
**Relevant file:** `js/PageSites/Site.coffee`, especially `isEthereumIdentity()`, `contentVersion()`, and `renderIdentityBadges()`

The dashboard can recognize an Ethereum-shaped address before the site's manifest is loaded. The version helper defaults to v1 when manifest data is not yet available, while identity badge rendering can already infer Ethereum identity from the address. This can produce a transitional state where the UI displays Ethereum identity alongside legacy SHA-512/v1 or other not-yet-confirmed properties.

Identity type and content format are separate facts. An Ethereum address does not, by itself, prove that a site's current manifest is v2 or that BLAKE3/EIP-712 verification succeeded.

**Recommendation**
- Model identity scheme, manifest version, digest algorithm, and verification status as separate fields.
- While loading, display a neutral state such as “Ethereum identity · manifest pending”.
- Show BLAKE3/EIP-712 badges only after the backend reports a successfully verified v2 manifest.
- Add UI tests for loading, valid v2, invalid v2, legacy content under an Ethereum-looking identifier, and unavailable manifest states.

### D2-02. Historical-site classification trusts manifest metadata rather than an explicit verified migration state

**Severity:** High  
**Relevant file:** `js/PageSites/Site.coffee`, `isHistorical()`

The historical-site helper accepts metadata signals such as `migration_role == "historical"`, `migration_status == "historical"`, or the presence of a `migration` object. The backend verification path does not appear to require a migration proof merely because a status field says “historical”; proof validation is associated with the migration object.

As a result, a site could be presented as historical based on metadata that has not been established as a verified migration. The dashboard may then hide normal actions or present a destination link without a confirmed migration relationship.

**Recommendation**
- Have the backend expose a normalized, explicit migration state that is set only after validating the migration proof and source/destination relationship.
- Make the dashboard consume that verified state instead of independently inferring it from arbitrary manifest fields.
- Distinguish at least: `not_migrated`, `migration_pending`, `migration_verified`, `migration_conflict`, and `verification_unavailable`.
- Add tests for forged status-only metadata, missing proof, invalid proof, and valid proof.

### D2-03. Dashboard does not expose the complete migration lifecycle or recovery path

**Severity:** Medium  
**Relevant file:** `js/PageSites/Site.coffee`

Historical-site actions are intentionally restricted, including normal update/pause/clone/delete operations. The current UI offers historical destination navigation and archive/export behavior, but does not provide a complete guided migration workflow.

Users need a safe path to initiate migration and understand progress, errors, signature requirements, conflicts, and recovery after interruption. This is especially important because the backend migration currently has crash-recovery and destination-conflict risks documented in the backend audit.

**Recommendation**
- Add a guided migration flow only after backend staging/recovery semantics are implemented.
- Show source identity, destination identity, the exact content snapshot being migrated, and required signing/acceptance steps.
- Expose phase progress and actionable errors without implying success before the backend confirms it.
- Provide a recovery/resume or safe-abort action for interrupted migrations.
- Never let the dashboard independently mark a migration complete.

### D2-04. Ethereum URL recognition is not equivalent to end-to-end site-access support

**Severity:** Medium  
**Relevant files:** `js/utils/Text.coffee`, `js/PageSites/Site.coffee`, backend request routing

The URL helper can construct a route for an Ethereum-shaped address, and the backend route/address-normalization path appears designed to accept it. This confirms basic route wiring, not complete site access. It does not prove that a real v2 manifest is discovered, verified, served, and synchronized through peers.

**Recommendation**
- Add an end-to-end browser test for opening a known Ethereum v2 site from a clean client.
- Cover direct URL entry, dashboard site list, reload, internal links, missing site, invalid manifest, and unavailable peers.
- Test both normalized/checksummed and lowercase Ethereum address input.
- Ensure error states distinguish invalid identity, site not found, manifest verification failure, and transport failure.

### D2-05. CoffeeScript and checked-in JavaScript bundle can drift

**Severity:** Medium  
**Relevant files:** `js/PageSites/Site.coffee`, `js/all.js`, dashboard `README.md`

The repository checks in both CoffeeScript source and a compiled JavaScript bundle. The repository documentation indicates there is no reproducible build/dependency pipeline. That leaves source/bundle synchronization dependent on manual updates and makes it possible for development and deployed behavior to diverge.

**Recommendation**
- Define a pinned, reproducible build toolchain and dependencies.
- Add a CI check that compiles CoffeeScript and fails if the generated bundle differs from the committed bundle.
- Document the supported build command and runtime version.
- Add smoke tests against the generated bundle, not only the source.

### D2-06. Dashboard does not communicate unsupported migration layouts or transport limitations

**Severity:** Low to Medium  
**Area:** user-facing compatibility messaging

The backend migration currently rejects some legacy manifest structures (including `includes` and `user_contents`) and has transport restrictions for onion peers on Ethereum-addressed sites. The dashboard does not yet provide a complete compatibility/preflight explanation for these constraints.

**Recommendation**
- Present migration preflight results before requesting signatures or modifying local data.
- Explain unsupported site structures and transport constraints in actionable language.
- Link to the backend's compatibility documentation.
- Avoid presenting Ethereum identity as synonymous with universal reachability.

## Recommended dashboard remediation order

1. Separate identity, content format, and verification state in the UI model.
2. Consume backend-verified migration state only.
3. Add end-to-end Ethereum v2 navigation tests.
4. Establish a reproducible CoffeeScript build and bundle consistency check.
5. Add migration preflight, progress, conflict, and recovery UX after backend support exists.

## Validation still required

This is a static source review. The following remain unverified:
- Dashboard build/compilation.
- Browser rendering and interaction.
- Source-to-bundle equivalence.
- Real Ethereum v2 navigation against a running backend.
- UI behavior for invalid, stale, conflicting, or unverifiable migration proofs.

Do not interpret this document as a claim that these scenarios have already been reproduced at runtime.
