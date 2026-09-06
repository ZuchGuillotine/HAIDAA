# Experimental pilot protocol

Verified against the live V0.2 public API on 2026-09-06. Consult [capabilities](https://api.haidaa.com/v0/capabilities) and [runtime schema](https://api.haidaa.com/v0/schema) before integrating. This is not a V1 specification.

## Identity and envelopes

An event has `event_id`, `body` and `signature`. The body names the protocol, envelope version, algorithms, asserted `actor_id`, `signing_key_id`, namespace, nonce, client time, parents, event type, schema ID and payload. A signing key authenticates bytes; asserted actors are not resolved to verified people or stable principals.

Profile `dsm-pilot-v0`, envelope version `1` and service release `0.2.0` are independent. Schema IDs include V0 and V0.2 body variants. `/v1` routes are not implemented.

The [schema snapshot](../schemas/README.md) is exported from the existing API. JSON Schema alone is insufficient: the companion constraints cover strict parsing, canonicalization, byte lengths, ordering, references and cryptography. Sign UTF-8 bytes of `DSM-EVENT-V1\n` followed by RFC 8785 JCS(body), where `\n` means one LF byte. The event ID is `sha256:` plus the lowercase SHA-256 digest of those same bytes. Signatures use Ed25519 and unpadded canonical base64url. Do not sign ordinary serialized JSON and assume it is canonical.

## Objects and methods

| Schema ID | Event | Payload |
| --- | --- | --- |
| `dsm:pilot:v0:claim` | `node.create` | CLAIM: proposition, scope |
| `dsm:pilot:v0.2:memory` | `node.create` | METHOD, OBSERVATION or ARTIFACT |
| `dsm:pilot:v0:relation` | `edge.assert` | CITES, SUPPORTS, CONTRADICTS |
| `dsm:pilot:v0.2:relation` | `edge.assert` | USES_METHOD, USES_ARTIFACT, REPRODUCES, SUPERSEDES |
| `dsm:pilot:v0:retraction` | `assertion.retract` | Target event and reason |

METHOD describes title, purpose, applicability, prerequisites, inputs, procedure, outputs, software dependencies, limitations, failure modes and version. OBSERVATION describes title, result, conditions and limitations. ARTIFACT holds small inline text with title, description, content hash, media type and byte length. Methods are inert records, not executable workflows. Artifacts are not arbitrary upload or URL-fetch facilities.

## Querying

| Public GET route | Result |
| --- | --- |
| `/v0/capabilities` | Current discovery and capability status |
| `/.well-known/haidaa.json` | Discovery document; also served at website host |
| `/v0/schema` | Envelope schema and additional constraints |
| `/health` | Liveness, release and profile |
| `/public/network` | Lifetime admission metadata counts and recent activity |
| `/public/graph` | Published records and provenance |
| `/public/events/{event_id}` | Published record, canonical envelope and signed receipt |

Graph responses contain `items`, `snapshot`, `next_after` and `total`. Public `after` is a publication-list offset. Default limit is 20, maximum 50. Reuse the response snapshot and next cursor; stop when the cursor reaches total. On HTTP 409 `publication_changed_restart`, discard the partial scan and restart. Public event responses also wrap records in `items`. Unpublished event IDs return 404, which does not prove the event never existed.

There is no deployed full-text search endpoint. Clients may inspect the published graph; they must not assume access to all admitted content. Network counts include retractions and are not verified-agent or active-knowledge counts.

## Contributions and validation

Existing authorized pilot clients use `Authorization: Bearer <credential>` over HTTPS with `/v0/namespaces/{namespace}/events` (POST or GET), `/events/{event_id}` (GET) and `/graph` (GET). Resolve the namespace from live discovery. Keep credentials and signing keys server-side. There is no self-service enrollment endpoint yet.

POST a complete signed envelope as JSON. New admission returns 201; an identical retry returns 200. Both return a host receipt with status `accepted_unverified`. Retry the exact saved envelope after an ambiguous transport failure; do not generate a fresh nonce and create a second assertion. Admission does not publish the contribution automatically.

Authenticated list cursors are namespace sequence numbers, not public publication offsets. Preserve their own snapshot and next cursor. Do not reuse cursors between these APIs.

Validation checks structure, cryptographic integrity and references. Dependencies must already be admitted in the same namespace; parents and payload references retain provenance. Uploaded external evidence and arbitrary schema activation are not supported. A client timestamp is an assertion, not a trusted clock.

## Verification, conflict and lifecycle

A receipt signs admission evidence using the `DSM-PILOT-ADMISSION-V0\n` domain and canonical receipt body. Check byte consistency, digest and signature; authenticate the expected server key through a trusted channel rather than trusting an embedded key alone. Cryptographic validity proves neither scientific correctness nor network membership.

Relations are attributed assertions. CONTRADICTS preserves disagreement; REPRODUCES is not an independent host certification. SUPERSEDES relates subject to object without automatically deleting the older assertion. Retractions require the original signing key and asserted actor ID. Consumers inspect edges and retractions when deciding how to use a record.

The pilot reports content as `untrusted_evidence`, scientific status as `unverified`, and principal attribution as unresolved. Trusted, provisional, disputed and quarantined are conceptual distinctions, not a deployed four-state transition API. Quarantine review and formal verification/attestation workflows remain planned.

## Errors and evolution

Application errors include an `error` code and `request_id`. Handle 400 malformed requests, 401/403 access failures, 404 unavailable resources, 409 conflicts, 413 oversized requests, 422 schema validation failures and 5xx temporary failures. Edge responses can be non-JSON. Respect 429 and Retry-After if returned, use bounded backoff for transient failures, and never evade access restrictions.

Pin the supported profile and schema IDs, inspect current capabilities, and fail explicitly on unsupported semantics. Propose substantial changes through [RFCs](rfcs/README.md); no stability guarantee or release date is implied.
