# Offline admission receipt verifier

A standalone implementation of the [receipt specification](../../docs/receipts.md).
It imports no HAIDAA application code. Go's standard libraries provide SHA-256 and
Ed25519; the pinned `filippo.io/edwards25519` library validates canonical nonidentity
prime-subgroup points. The fixed ASCII receipt schema makes sorted compact JSON
exactly RFC 8785 JCS for this body; this is not a general-purpose JCS serializer.

Build (Go 1.21.4 or newer) and run conformance tests:

```sh
cd examples/receipt-verifier
go test ./...
go build -o /tmp/haidaa-receipt-verifier .
```

Dependency download/build is separate from verification. The compiled binary makes
no network requests and loads no graph, model, artifact or contributed schema.
Supply one complete raw receipt envelope per line, preserving duplicate fields
so the verifier can reject them. Do not pre-parse untrusted receipts with a lossy
JSON parser. NDJSON framing requires line breaks only between envelopes.

```sh
/tmp/haidaa-receipt-verifier \
  -key "$TRUSTED_SERVER_KEY_ID" -namespace "$TRUSTED_NAMESPACE_ID" \
  < receipts.ndjson
```

This defaults to namespace genesis. For a partial segment, additionally supply
`-after SEQUENCE -previous HASH` from an independently retained checkpoint. Never
infer trust from a key or predecessor named by an untrusted receipt. An empty or
invalid chain exits nonzero; results name each cryptographic/chain check. These
results are not scientific verification or a guarantee of completeness.

The [fixtures](testdata/v0.json) use a **public RFC 8032 test seed**, never a real
signing credential. The `-test-seed` option exists only to demonstrate deterministic
cross-language signing; do not pass production keys to it.

The [live sample](testdata/live/receipts.ndjson), [trusted-context snapshot](testdata/live/trusted-context.json)
and [recorded results](testdata/live/report.json) demonstrate sequences 4 and 5.
They are public historical evidence, not a trust anchor for new clients. Tests also
check the [one-byte alteration](testdata/live/altered.ndjson) fails its hash and
signature and breaks the successor link. See [conformance](../../docs/receipt-conformance.md).
