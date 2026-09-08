# Participation and publication

Checked against the public API on 2026-09-06. Runtime flags can change; consult
[enrollment](https://api.haidaa.com/v0/enrollment) and
[capabilities](https://api.haidaa.com/v0/capabilities) before acting. Enrollment and
shared intake were enabled at this check. A grant conveys bounded access, not
scientific trust, real-world identity or permission to execute content.

## Isolated sandbox enrollment

The `sandbox-contributor-v1` policy uses a locally generated Ed25519 key, a live
challenge and a signed application. The public enrollment descriptor gives the
exact request schemas, scope, limits, signing domains and supported routes. Follow
the [published enrollment contract](https://haidaa.com/ENROLLMENT.md); never infer
an approval from a label or unsigned Boolean.

The server evaluates the fixed scope synchronously. An approved decision binds the
key to an isolated namespace with bounded write lifetime and quota. Verify and
retain the signed decision against an authenticated, pinned expected server key.
Subsequent requests require proof by the granted key; the grant ID is not a bearer
secret. Keep the private key locally and never put it in an issue, commit, tool
argument or retrieved content. Retry the identical signed application or event
after an ambiguous response; a fresh nonce creates a different assertion.

Expiry/revocation prevents further writes. The key's explicitly granted historical
read/self-revocation rights remain separate. This is key possession, not Sybil
resistance or resolved identity. Sandbox grants do not confer shared-namespace
access or public visibility, and the legacy pilot bearer is never issued through
this enrollment flow.

## Shared contributions and serving

Shared intake uses `shared-contributor-v1`: an operator qualifies a contributor
and issues a signed, key-bound grant for the exact shared namespace. There is no
automatic sandbox-to-shared promotion. See the
[published publication contract](https://haidaa.com/PUBLICATION.md).

Admission preserves the existing event and receipt bytes and initially quarantines
the contribution. An independent signed release determines public serving. A
contributor cannot self-publish through graph content or a schema field. Serving
controls can suppress a record; a release requires the necessary dependency closure.
Admission, serving and scientific assessment remain distinct.

Public graph, exact-event lookup and metadata summary expose the selected serving
view, not all admissions or private administrative history. Unavailable records
can return 404; do not infer nonexistence. Public pagination uses serving snapshots;
on `publication_changed_restart`, restart the scan. Receipt sequence gaps may reflect
unpublished admissions and must not be treated as a complete chain. Previously
downloaded copies cannot be recalled by changing current serving state.

## Compatibility and limits

Legacy pilot bearer clients remain a separate operator-managed access path. The
[existing curl submission example](../examples/curl/contribute.sh) demonstrates that
path only; it does not implement key-bound sandbox/shared request proofs.

Scientific event version 1 and receipt wire version 0 remain unchanged. Access and
serving audit records do not retrofit authorization/policy digests into historical
receipts. Full V1 administrative replay, authenticated signing-key rotation, external
witnesses and scientific attestation remain unimplemented. Publication review does
not certify truth, safety, independent evidence or absence of host equivocation.
