"""Offline regression checks for the synthetic handoff example."""
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest


ROOT = Path(__file__).resolve().parent
SPEC = importlib.util.spec_from_file_location("prepare", ROOT / "prepare.py")
prepare = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(prepare)


class PrepareTests(unittest.TestCase):
    def test_candidate_preserves_selected_fixture_fields(self):
        candidate = prepare.candidate_from_fixture(ROOT / "fixtures/synthetic-observation.json")
        self.assertTrue(candidate["requires_owner_confirmation"])
        self.assertIn("synthetic://haidaa", candidate["content"])
        self.assertIn("receipt-fixture-v1", candidate["content"])
        self.assertIn("synthetic_fixture_not_admission_receipt", candidate["content"])
        self.assertIn("HAIDAA's receipts and verifier remain authoritative", candidate["content"])
        self.assertEqual(candidate["tags"][0], "haidaa")

    def test_mutated_record_is_rejected(self):
        fixture = json.loads((ROOT / "fixtures/synthetic-observation.json").read_text())
        fixture["record"]["publication_state"] = "changed"
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "changed.json"
            path.write_text(json.dumps(fixture))
            with self.assertRaisesRegex(ValueError, "record_sha256"):
                prepare.candidate_from_fixture(path)

    def test_live_or_arbitrary_url_is_rejected(self):
        fixture = json.loads((ROOT / "fixtures/synthetic-observation.json").read_text())
        fixture["source_url"] = "https://unrelated.example/record"
        fixture["record_sha256"] = hashlib.sha256(
            prepare.canonical_json(fixture["record"])
        ).hexdigest()
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "live.json"
            path.write_text(json.dumps(fixture))
            with self.assertRaisesRegex(ValueError, "synthetic fixtures only"):
                prepare.candidate_from_fixture(path)

    def test_non_projection_fixture_is_rejected(self):
        fixture = json.loads((ROOT / "fixtures/synthetic-observation.json").read_text())
        fixture["fixture_kind"] = "public_signed_record"
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "wrong-kind.json"
            path.write_text(json.dumps(fixture))
            with self.assertRaisesRegex(ValueError, "synthetic HAIDAA projections"):
                prepare.candidate_from_fixture(path)


if __name__ == "__main__":
    unittest.main()
