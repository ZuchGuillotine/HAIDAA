# HAIDAA admission receipts — normative specification, revision 1

This is revision 1 of the specification for the **existing wire protocol
`dsm-pilot-admission`, version `0`**. It does not introduce a wire V1 or change
any historical hash. Implementers MUST use the deployed constants below, not
`DSM-ADMISSION-V1`. A future wire version needs a separate specification.

## Purpose and limits

A receipt is a host attestation that the exact signed `event_id` was admitted
into the named namespace at a namespace-local committed sequence, at a
host-asserted time, following the named previous receipt. It is an audit primitive,
not a scientific truth or authorization primitive. Events retain their separate
`DSM-EVENT-V1\n` protocol; a receipt neither reconstructs nor interprets their content.

The deployed pilot does **not** retain an authorization audit head, authorization
state digest, policy bundle digest or admission inputs digest in receipts. It cannot
prove historical V1 authorization replay. The three fixed pilot labels describe
that limitation; they do not attest reconstructed authorization state. No such
fields are added by this specification.

Receipts do not prove scientific truth, correctness, safety, real-world identity,
independence of evidence, permission to execute content, global history completeness,
absence of host equivocation, or trusted external wall-clock time. They do not prove
that different clients saw the same chain. A linear chain lets a client detect
modification or reordering relative to an independently held prefix/checkpoint.
It cannot detect pre-publication censorship, internally valid forks shown to different
clients, a hidden unseen suffix, false host timestamps, refusal to serve history,
or selective omission of private administrative material. This is not a transparency
log. Witnesses, Merkle trees, consensus and federation are outside this protocol.

## Closed transport envelope

Exactly four mandatory members, with no nulls or unknown members:

```json
{
  "body": { "...": "the eleven mandatory members below" },
  "canonical_body_base64url": "unpadded base64url of B",
  "receipt_hash": "sha256: followed by 64 lowercase hexadecimal digits",
  "signature": "unpadded base64url of the 64-byte Ed25519 signature"
}
```

The illustrative `...` is not a member. `receipt_hash`, signature and encoded
canonical bytes are outside the body and MUST NOT enter their own preimages.
Envelope key order and whitespace do not affect the body bytes.

## Exact body schema

All eleven members below are mandatory. Only `version` is a JSON number; all others
are JSON strings. No optional members, algorithms, extensions, contributed fields,
URLs, embedded content, schemas or executable hooks exist.

| Member | Exact representation | Meaning and trust limitation |
|---|---|---|
| `protocol` | Literal `dsm-pilot-admission` | Fixed receipt domain family; no algorithm negotiation. |
| `version` | Integer token `0` | Fixed wire version, not specification revision; no fallback to other versions. |
| `server_key_id` | `ed25519:` + canonical unpadded base64url of 32 raw public-key bytes (43 characters after prefix) | Signing authority identified by key possession only. Trust must come from independent bootstrap. |
| `namespace_id` | UUID spelling `8-4-4-4-12` hexadecimal digits; version nibble 1–8 and variant nibble 8, 9, a or b; nil and lowercase all-ones UUIDs also permitted by the event UUID profile. Hex letters may use either case. | Exact immutable namespace string. Preserve case and compare exactly; do not normalize a signed identifier. Pilot admissions use the configured namespace. |
| `sequence` | Decimal string matching `[1-9][0-9]{0,15}`, integer at most 9007199254740991 | Committed namespace admission sequence; starts at 1, no leading zero, sign, whitespace, exponent or fraction. Not scientific causality or global time. Current namespace quota is narrower than the encoding range. |
| `event_id` | `sha256:` + 64 lowercase hex digits | Exact admitted signed event identifier; no scientific assessment. |
| `previous_receipt_hash` | Same hash encoding | Immediately previous committed receipt in this namespace, or the genesis sentinel below. |
| `accepted_at` | Exactly `YYYY-MM-DDTHH:mm:ss.sssZ`, four-digit year, a valid Gregorian calendar date, hours 00–23, minutes/seconds 00–59; three millisecond digits | Host-attested UTC time only; no leap-second spelling, offset, alternate precision, date normalization, or external timestamp guarantee. |
| `profile` | Literal `dsm-pilot-v0` | Pilot admission profile only, not a retained policy digest. |
| `verification_state` | Literal `unverified` | Scientific contribution remains unverified. |
| `principal_attribution` | Literal `unresolved` | No established stable principal or real-world identity. |

There is no separate `server_id`: `server_key_id` is the existing cryptographic
signing-authority identifier. Display hostnames are not cryptographic identities.
The absent V1 administrative fields, if introduced in a future version, must
separately distinguish committed administrative prefix, reconstructed authorization
state, retained policy bundle, and retained admission inputs. Ordinary receipt
verification must never fetch, import or execute those materials.

## Strict parsing and encodings

Bound a raw envelope to **8192 bytes** before parsing, and retained B to **4096
bytes**. Parse strict UTF-8 without replacement, without BOM, and reject trailing
non-whitespace or multiple root values. Reject duplicate decoded names at every
object level (including escaped equivalents), lone surrogate escapes, invalid JSON,
nonfinite numbers, negative zero, exponent/fraction number tokens, unsafe integers,
and invalid leading-zero numeric tokens. Reuse the deployed event lexical parser:
root value depth is 0, reject a value at depth greater than 16; at most 256 members
per object and 64 elements per array before closed schema validation. This depth
convention describes the deployed parser, not the future architecture's planned
root-at-1 convention. No arrays or nested objects other than `body` survive receipt
schema validation. Unexpected nulls and unknown body/envelope fields fail closed.

Decode base64url using only `A-Z a-z 0-9 - _`, with no padding and zero unused pad
bits; decoding and re-encoding must reproduce the original string. Reject bad
signature/key lengths and alternate hash spellings, including uppercase hex.
All regex profiles in this document match the **entire** string. Strings are never
trimmed, coerced, case-folded or Unicode-normalized. Validate the closed schema
before canonicalizing. Do not use graph-defined schemas.

## Canonical bytes, hash and signature

Use RFC 8785 JCS, UTF-16 property-name ordering, no Unicode normalization, no
trailing newline in B. The closed body contains only ASCII names and values and
the numeric constant zero. Sorted compact JSON is JCS for **this validated schema**;
that observation is not permission to use it as a general JCS implementation.

```text
B = UTF8(JCS(body))
D = UTF8("DSM-PILOT-ADMISSION-V0\n")
M = D || B
receipt_hash = "sha256:" || lowercase_hex(SHA256(M))
signature = base64url_no_padding(Ed25519.Sign(server_private_key, M))
canonical_body_base64url = base64url_no_padding(B)
```

D ends with exactly one LF byte `0a`, not the two bytes backslash and n. Its hex is
`44534d2d50494c4f542d41444d495353494f4e2d56300a`.
Hashing and signing use exactly the same M. Use plain Ed25519, not Ed25519ph or ctx.
Verify 32-byte canonical public-key encodings, 64-byte signatures, canonical R,
nonidentity prime-subgroup public key and R, scalar S less than group order, and the
signature equation. Reject small-order/mixed-order and noncanonical points using
reviewed libraries, not custom curve arithmetic. This is the event verifier's
strict cryptographic acceptance profile applied to receipt verification. It does
not change honest deterministic signatures already issued by the pilot.

The body supplied in the envelope MUST independently canonicalize to exactly the
retained B. Never verify a signature over only the supplied B while displaying an
unchecked `body` projection.

## Genesis and trusted signing keys

Sequence **1** MUST name this previous hash:

```text
sha256:0000000000000000000000000000000000000000000000000000000000000000
```

No later sequence may use that sentinel. The namespace database starts at sequence
0 with that head; sequence 0 itself is not a receipt. Duplicate genesis, wrong
starting sequence, gaps, duplicates, reorderings and predecessor mismatches fail
chain verification.

Supply a trusted namespace and `server_key_id` from an authenticated operator
bootstrap or an independently retained prior admission key. The embedded key is
not its own trust anchor. A key fetched alongside receipts from the same host only
establishes consistency under that supplied key, not independently trusted identity.

The pilot has **one bootstrap signing key, no authenticated rotation history and
no rotation protocol**. A valid public key cannot authorize itself as its replacement.
Changing the secret is not a supported rotation. A future rotation must retain old
public keys and signatures, authenticate the transition, and define exact namespace
sequence/administrative boundaries before new signatures become applicable.
Historical receipts must not be rewritten. Rotation vectors are future conformance
work, because rotation is not implemented.

## Retained material and compatibility

The deployed host retains authoritative canonical receipt body bytes and their
hash, rather than reconstructing them from a disposable JSON projection. Public
exports include those bytes as `canonical_body_base64url`, a parsed body projection,
the hash and signature. Verifiers must compare the projection to retained bytes.

The pilot deterministically regenerates historical signatures over retained M
using the same retained private key; a receipt export itself retains the signature.
Loss or replacement of that key can prevent host-side historical serving. Already
exported signatures remain independently verifiable using the historical public
key. This limitation is not a claim of authenticated rotation or durable host-side
signature persistence. A key mismatch fails closed as `historical_signer_unavailable`.

The reproducibility gap was underspecified envelope/body/hash preimage and
permissive client validation, not lost canonical bytes. Specification revision 1
pins the existing wire V0 bytes. No historical hash is rewritten and no wire V1
transition is introduced. Full V1 authorization receipts remain future work.

## Normative offline verification algorithm

For a genesis export, initialize expected sequence to 1 and predecessor hash to the
sentinel. For a partial segment, require an explicit trusted predecessor checkpoint
(sequence and independently known hash); do not infer it from the segment's first
receipt. A provisional segment can be checked against an untrusted supplied anchor,
but must be labeled as such and cannot establish a known prefix.

For each raw receipt, in supplied order:

1. Enforce size, UTF-8, lexical and closed-schema rules; validate fixed constants
   and exact encodings. Reject malformed input without interpreting contributed data.
2. Independently compute B with JCS and compare it byte-for-byte with decoded
   `canonical_body_base64url` (`canonicalization_check`).
3. Construct M using the exact D above, compute SHA-256 and compare the formatted
   hash exactly (`receipt_hash_check`).
4. Compare `server_key_id` to the applicable trusted bootstrap key
   (`bootstrap_key_check`); verify the strict Ed25519 signature over independently
   constructed M (`server_signature_check`). Mathematical signature validity may be
   reported separately even when bootstrap trust is absent or mismatched.
5. Compare namespace exactly (`namespace_check`), require sequence progression
   (`sequence_check`), and compare previous hash to the **independently recomputed**
   predecessor hash (`chain_link_check`), including the genesis rule.
6. Advance using the recomputed hash. After any failure, the chain's overall result
   remains failed; later matching links cannot repair an invalid prefix.

Each check returns `pass`, `fail` or `not_checked`. `protocol_verification: pass`
requires all seven checks to pass and a nonempty chain. No trusted context means
bootstrap/namespace/sequence/chain checks remain `not_checked`, and no overall pass.
Never return an unqualified `verified: true`. Cryptographic success means only:
**This host-signed receipt is cryptographically intact and linked according to the
published admission-chain protocol.** It is not a scientific assessment.

Parsing failures return a specific `failures` code and leave cryptographic checks
`not_checked`: `receipt_too_large`, `invalid_utf8`, `invalid_json`, `receipt_schema`,
or `invalid_encoding`. Later failure codes are `receipt_body_mismatch`,
`receipt_hash_mismatch`, `bad_receipt_signature`, `unexpected_server_key`,
`namespace_mismatch`, `sequence_mismatch`, and `chain_link_mismatch`. Chain continuation
also reports `predecessor_invalid`. Multiple diagnostics may be reported; a hash
mismatch does not suppress signature diagnostics. Invalid caller checkpoints are
configuration errors (`invalid_checkpoint`), not receipt success. Report no secrets.

## Public export, administrative privacy and offline use

Public `/public/graph` items include `provenance.receipt`; public
`/public/events/{event_id}` returns the same full receipt for explicitly published
events. This envelope already contains all cryptographic receipt material. Graph
pagination/publication selection may omit intervening receipts: missing material
must be reported, not treated as a contiguous chain or a complete global export.
Authenticated ledger exports retain their existing access controls. Private
administrative material is not made public, and no new graph or network access
is needed to verify saved receipts. Deeper authorization audits are separate and
currently unavailable in this pilot.

The standalone Go tool takes one complete raw receipt JSON envelope per line
(NDJSON framing; no line breaks inside an envelope). The TypeScript byte API also
accepts ordinary JSON formatting/whitespace within a single receipt. Download the
Go source and its pinned dependencies once, build locally, and then verify with
network access disabled:

```sh
cd examples/receipt-verifier
go build -o receipt-verifier .
./receipt-verifier -key "$TRUSTED_SERVER_KEY_ID" -namespace "$NAMESPACE_ID" < receipts.ndjson
# For a segment following an independently held checkpoint:
./receipt-verifier -key "$TRUSTED_SERVER_KEY_ID" -namespace "$NAMESPACE_ID" \
  -after 42 -previous "$KNOWN_HASH_AT_42" < segment.ndjson
```

When downloading the public files individually, save `receipt-verifier.go` as
`main.go`, `receipt-verifier-go.mod` as `go.mod`, and `receipt-verifier-go.sum` as
`go.sum` together in a directory before building.

The compiled tool uses no network, graph, model, artifact execution, dynamic loading
or contributed validation. It exits nonzero on failed/empty chains and emits
explicit checks per receipt. Go signing is available only with an explicit public
test seed for conformance; never use production private keys with that option.

## Golden and adversarial vectors

[`v0.json`](../examples/receipt-verifier/testdata/v0.json) is the normative machine-readable fixture. It
contains the human-readable bodies, exact canonical UTF-8 and hex, exact preimage
and hex, expected SHA-256 and receipt hash, public key, deterministic Ed25519
signature, signature/chain outcomes, and a **public test-only** RFC 8032 seed.
The second receipt links to the first; both are independently regenerated in Go
and checked against the committed bytes and signatures in TypeScript.

The same file includes raw-byte negative fixtures (not lossy parsed substitutes)
and chain fixtures for field alterations, duplicate names, unknown fields,
invalid UTF-8, Unicode and numeric forms, malformed encodings, wrong signatures,
keys and domains, uppercase hashes, omitted/duplicated/skipped/reordered receipts,
false genesis and namespace insertion. Reordered JSON is a positive fixture.
See [receipt conformance](receipt-conformance.md) for exact test commands and implemented scope.

Protocol references: [RFC 8785 JCS](https://www.rfc-editor.org/rfc/rfc8785),
[RFC 8032 Ed25519](https://www.rfc-editor.org/rfc/rfc8032).
