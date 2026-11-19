# Iroh settings

The dashboard exposes the optional Iroh transport setting separately from
IPFS/Kubo.

- **Iroh: disabled** writes `iroh_mode=disabled`.
- **Iroh: external Rust bridge (coming soon)** is intentionally disabled in
  the menu until the versioned Rust sidecar and its IPC protocol exist.

Iroh is a Rust networking library, not a generic daemon. The dashboard must
not imply that an arbitrary `iroh` executable is a compatible service.
See the backend `docs/IROH-INTEGRATION.md` for the architecture and security
requirements.

The CoffeeScript source and checked-in JavaScript bundle are both updated.
