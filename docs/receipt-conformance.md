# Receipt conformance and public audit evidence

The [normative specification](receipts.md) revision 1 pins the deployed
`dsm-pilot-admission`, wire version **0**, and `DSM-PILOT-ADMISSION-V0\n` domain.
It changes neither scientific events nor historical receipt hashes.

The public [Go verifier](../examples/receipt-verifier/README.md) reproduces canonical
bytes, domain-separated preimages, SHA-256 and Ed25519 signatures against committed
[golden vectors](../examples/receipt-verifier/testdata/v0.json). The positive
fixtures contain genesis and a successor, exact UTF-8/hex, public key, signature,
expected verification outcomes and a public RFC 8032 seed. Negative raw-byte cases
cover encoding, duplicate names, unknown fields, numeric forms, malicious points,
body changes, wrong keys/domains and invalid chains. Reordered JSON is accepted.

Run from the repository root:

```sh
python3 scripts/check.py
(cd examples/receipt-verifier && go test -v ./...)
```

Public CI runs these checks. The Go tests independently regenerate canonical bytes,
preimages, hashes and deterministic signatures against the committed fixture;
tests never regenerate their expected answers. The same fixture was tested in the
TypeScript implementation before publication: TypeScript signing → Go verification,
Go signing → TypeScript verification, with exact byte/hash/signature agreement.
That production TypeScript implementation remains private; this repository provides
a self-contained Go verifier and executable fixture coverage, not the private
service test suite or a claim of complete event/administrative conformance.

## Live historical demonstration

On 2026-09-06, two consecutive live public receipts (namespace sequences 4 and 5)
were downloaded after deployment and independently verified without database access.
A previously retained admission key and sequence-3 checkpoint anchored the segment.
The [raw export](../examples/receipt-verifier/testdata/live/receipts.ndjson),
[context snapshot](../examples/receipt-verifier/testdata/live/trusted-context.json)
and [full results](../examples/receipt-verifier/testdata/live/report.json) are public.
A new reader must authenticate the key/checkpoint independently; publishing this
snapshot does not establish bootstrap trust for that reader.

Receipt 4's independently computed hash is
`sha256:a09b6fd0fb8d2e7237155d045aa9d2a96703ca1850b4a421e7e6ee5963a4900c`.
It exactly equals receipt 5's `previous_receipt_hash`. Both canonical-byte, hash,
Ed25519 signature, namespace, sequence, key and chain-link checks pass.

Changing one ASCII millisecond digit in receipt 4 and updating its canonical-body
representation, while retaining its published hash/signature, causes hash and
signature failures. Receipt 5's predecessor check also fails against the altered
receipt's independently recomputed hash. [Tampered export](../examples/receipt-verifier/testdata/live/altered.ndjson).
Both the positive and altered samples are exercised by `go test`.

All 14 public receipt bodies, canonical encodings, hashes and signatures were
unchanged across the auditability deployment. This is a historical observation,
not a continuing monitor or completeness guarantee. No rotation vectors are
claimed: the pilot has no authenticated rotation protocol, retained authorization
state digests, witnesses or transparency log. Host admission integrity is not
scientific truth, safety, execution authority or proof against equivocation.
