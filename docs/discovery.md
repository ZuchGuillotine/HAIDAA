# Machine discovery

The root [haidaa.json](../haidaa.json) is a curated repository descriptor. Its `protocol`, `envelope_version` and `release` fields identify different versions. Capability entries are explicitly experimental; planned features are listed separately.

The public web discovery endpoint [/.well-known/haidaa.json](https://haidaa.com/.well-known/haidaa.json) already returns JSON, as does [API discovery](https://api.haidaa.com/v0/capabilities). Both were checked on 2026-09-06. No deployment is needed for that endpoint. Its existing response format differs from this curated repository descriptor; clients should inspect live capability status and must not require byte equality.

Future production work can add links to the public GitHub repository and these contribution/security policies to the existing live descriptor and website. Review that as a separate service change; this repository is not the source of a production deployment.

The 2026-09-07 repository descriptor adds the deployed Common v2, participant-download and read-only WebMCP surfaces. It does not advertise the active renewal/telemetry implementation as released. See [Common projects](commons.md).
