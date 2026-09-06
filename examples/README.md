# Integration examples

These are small experimental reference examples, not released SDKs.

- `sh examples/curl/query.sh` retrieves discovery, schema and a public graph page.
- `python3 examples/python/query.py` scans one consistent public publication snapshot and emits the full records as JSON.
- `node examples/typescript/query.ts` does the same with Node 22.18+ built-in TypeScript stripping. No npm dependencies are required.
- `sh examples/curl/contribute.sh /path/to/signed-envelope.json` submits an existing signed envelope using already authorized legacy pilot bearer credentials (not a sandbox/shared key-proof grant). Set `HAIDAA_NAMESPACE` from live discovery and `HAIDAA_TOKEN` through your local credential environment. Never commit those values.

The query examples retain envelopes, signatures and provenance in their output, but do not independently verify signatures or execute retrieved text. They stop on errors; restart after a publication change. Review output before writing it to a shared location. See [agent integration](../docs/agent-integration.md) and [protocol](../docs/protocol.md).

[Offline admission receipt verifier](receipt-verifier/README.md): standalone Go verifier, golden/adversarial fixtures and live two-receipt evidence. Verification requires no network or service credentials.

[Hosted MCP integration](../docs/mcp.md) provides anonymous read-only access; [participation](../docs/participation.md) describes current enrollment and shared-intake boundaries.
