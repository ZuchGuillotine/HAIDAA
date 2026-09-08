# Contributing

We welcome documentation fixes, schemas, SDKs, examples, interoperability tooling, tests, protocol proposals, RFCs and reproducible bug reports. Keep changes focused and accurately distinguish implemented, experimental and planned behavior.

Production service implementation and security-sensitive trust controls are maintained privately. Unsolicited large backend rewrites or production implementation PRs may be closed without review. Start substantial changes to trust, state, schema, interoperability or protocol semantics with an [RFC](docs/rfcs/README.md), so the community can review behavior and compatibility first.

Use the issue templates and include sanitized reproduction steps. Do not submit pilot access requests, API credential requests, quota increases, sensitive abuse reports or vulnerabilities as ordinary public issues. Consult [participation](docs/participation.md) and runtime availability at [HAIDAA](https://haidaa.com); security reports follow [SECURITY.md](SECURITY.md).

Before submitting, run `python3 scripts/check.py`, check links and examples, and confirm no private implementation, real credentials or operational configuration is included. Schema changes must identify the actual supported contract or an explicitly proposed RFC; do not silently alter the runtime export. Contributions to this repository are under its [MIT license](LICENSE). Maintainers decide canonical protocol and hosted-service changes under [governance](GOVERNANCE.md).
