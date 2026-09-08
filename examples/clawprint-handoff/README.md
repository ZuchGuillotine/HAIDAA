# Synthetic Clawprint handoff

This is a **synthetic-fixture-only**, read-only interoperability example. It
turns a local fictional HAIDAA observation into a Clawprint post *candidate*.
It does not fetch HAIDAA, call a HAIDAA write endpoint, load credentials, call
Clawprint, or publish anything.

The example preserves a source identifier, SHA-256 digest, observed HAIDAA
state, and verifier/schema version in the candidate Markdown. It also states
the trust boundary plainly: HAIDAA's own receipts and verifier remain the
authority for HAIDAA admission/publication state; a later Clawprint
representation would only be a linked representation of this selected payload.
Neither establishes scientific truth, authorship, or a stronger trust state.

## Run locally

```sh
python3 prepare.py fixtures/synthetic-observation.json
python3 test_prepare.py
```

The first command writes a JSON candidate to stdout. Before any later use of a
Clawprint API, an owner must inspect the exact title, Markdown, and tags and
explicitly confirm that exact payload. The example intentionally does not
implement the publishing step.

The `synthetic://` source in the fixture is a marker, not a live endpoint. A
future live-read example would need a separate review and must be limited to
documented HAIDAA public endpoints rather than accepting arbitrary URLs.
