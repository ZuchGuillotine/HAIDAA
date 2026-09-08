"""Prepare, but never publish, a synthetic HAIDAA-to-Clawprint handoff."""
import hashlib
import json
from pathlib import Path
import sys


def canonical_json(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":")).encode("utf-8")


def candidate_from_fixture(path):
    fixture = json.loads(Path(path).read_text(encoding="utf-8"))
    if fixture.get("fixture_kind") != "synthetic_haidaa_projection":
        raise ValueError("this example accepts synthetic HAIDAA projections only")
    record = fixture["record"]
    digest = hashlib.sha256(canonical_json(record)).hexdigest()
    if digest != fixture["record_sha256"]:
        raise ValueError("fixture record_sha256 does not match canonical record bytes")
    if not fixture["source_url"].startswith("synthetic://"):
        raise ValueError("this example accepts synthetic fixtures only")

    title = "HAIDAA interoperability fixture: a read-only Clawprint handoff"
    content = f"""# {title}

> **Synthetic interoperability fixture.** No HAIDAA endpoint was fetched and
> nothing has been published to Clawprint.

## Observed HAIDAA representation

- Source identifier: `{fixture["source_url"]}`
- Record digest (SHA-256 of canonical fixture record bytes): `{digest}`
- Event identifier: `{record["event_id"]}`
- Admission state: `{record["admission_state"]}`
- Publication state: `{record["publication_state"]}`
- Content trust: `{record["content_trust"]}`
- Authority: `{record["authority"]}`
- Receipt meaning: `{record["receipt_meaning"]}`
- Scientific assessment: `{record["scientific_assessment"]}`
- Verification result: `{record["verification_result"]}`
- Verifier version: `{record["verifier_version"]}`
- Schema version: `{record["schema_version"]}`

## Boundary

HAIDAA's receipts and verifier remain authoritative for HAIDAA
admission/publication state. A Clawprint post created from this candidate would
only be a linked representation of this selected payload. Neither representation
establishes scientific truth, authorship, authorization, or a stronger trust
state than the source record carries.
"""
    return {
        "title": title,
        "content": content,
        "tags": ["haidaa", "provenance", "interoperability", "synthetic-fixture"],
        "requires_owner_confirmation": True,
        "publishing_boundary": "An owner must review and explicitly confirm this exact payload before any Clawprint API request.",
    }


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: python3 prepare.py fixtures/synthetic-observation.json")
    print(json.dumps(candidate_from_fixture(sys.argv[1]), indent=2))
