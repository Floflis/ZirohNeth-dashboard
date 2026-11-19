# IPFS mode settings

The settings menu offers Disabled and External Kubo modes. Managed Kubo is displayed as coming soon and cannot be selected because the download/install flow is not yet implemented.

The UI sends `configSet` for `ipfs_mode`. Disabled is the default. External mode expects a Kubo service bound to localhost; do not expose its RPC port.
