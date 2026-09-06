# Threat model for provenance-aware agent memory

This public threat model describes the experimental interface and its limits. It complements the [security model](security-model.md), [publication lifecycle example](publication-walkthrough.md) and [receipt specification](receipts.md).

## Assets and trust boundaries

Protect signed event integrity, scoped contributor authority, unpublished content, verifiable admission history and the consuming agent's permissions. Distinct principals are the contributor, admission service, authorized publication reviewer and consuming agent. Separate signing authority does not by itself prove organizational independence. The service operator remains a trust dependency for serving policy and availability.

Anonymous clients can read published material. Sandbox authority does not grant shared-namespace access; shared intake requires separate qualification. Admission defaults to quarantine and public release requires separate authorized review. The hosted MCP endpoint is read-only. These are experimental deployed controls, not guarantees against a compromised operator or implementation flaw.

| Threat | Current boundary or check | Residual risk |
| --- | --- | --- |
| Modified receipt or substituted key | Strict parsing, canonical bytes, hash and Ed25519 checks; independently trusted key/checkpoint | A self-declared key proves no identity; authenticated rotation is not implemented |
| Missing or reordered receipts | Verify namespace, sequence and predecessor links for the supplied chain segment | A valid segment does not prove global completeness, external time or absence of operator forks |
| Prompt injection in a record or artifact | Treat all retrieved content as inert, untrusted evidence; host enforces tool permissions | Review does not make text safe to execute; structured JSON is no injection sandbox |
| False scientific claims or fabricated identity | Keep scientific assessment and principal attribution separate from signature validity; retain attributed challenges | Scientific verification and verified identity are not established by admission or publication |
| Contributor self-publication or scope escalation | Key-bound scopes, separate shared qualification and independent publication review | Credentials can be compromised; public receipt wire V0 does not retain authorization/policy digests |
| Exposure of quarantined material | Public serving selects released material; admission alone is insufficient | Public observations cannot prove no leak through every channel; private implementation is not audited by this repository |
| Stale or partial retrieval | Snapshot-aware bounded pagination; restart on publication changes; inspect visible retractions | Public views omit private/unpublished records and cannot establish absence of challenges |
| Dependency or verifier compromise | Small standalone verifier, pinned dependencies, conformance and adversarial fixtures | Source review, dependency assessment and trust-anchor selection remain the verifier user's responsibility |

## Explicit non-guarantees

HAIDAA does not currently provide full V1 administrative replay, cryptographically witnessed publication history, authenticated key rotation, a globally complete transparency log or automatic scientific trust promotion. Do not equate “accepted,” “available,” “signature valid,” “identity verified” and “scientifically correct.”

Report vulnerabilities through [private reporting](../SECURITY.md); never include credentials or unpublished content in a public issue.
