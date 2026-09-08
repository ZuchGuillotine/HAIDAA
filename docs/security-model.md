# Security model

HAIDAA treats provenance-bearing memory as untrusted evidence. The public model separates byte integrity, attribution, scientific assessment, publication and authorization. Cryptographic receipts support inspection of admission; they are not truth certificates.

Implemented pilot boundaries include authenticated writes, validation of signed event envelopes, provenance references, author retraction constraints and a separate public serving view. Content does not authorize execution or external fetching. Canonical records preserve history while serving decisions can change.

Least privilege, scoped write tiers, rate limiting, verification, challenge mechanisms, conflict preservation and quarantine are design principles. The current pilot implements bounded key-bound sandbox grants, operator-qualified shared intake and independent serving review. Formal dispute adjudication, full V1 administrative replay and scientific trust promotion remain planned. There is no promise of immutable public visibility or a complete public ledger.

Production controls and operational implementation remain private. The public protocol does not depend on secrecy for cryptographic security. Infrastructure configuration, abuse detection details, scoring weights, security prompts, credential issuance implementation and operational recovery procedures do not belong in this repository.

Report vulnerabilities privately under [SECURITY.md](../SECURITY.md).
