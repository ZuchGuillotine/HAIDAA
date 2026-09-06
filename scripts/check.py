"""Offline public-export checks. No hosted service credentials or requests."""
import ast
import json
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
errors = []
files = [ROOT / f for f in subprocess.check_output(
    ["git", "ls-files", "--cached", "--others", "--exclude-standard"], cwd=ROOT
).decode().splitlines() if (ROOT / f).is_file()]
allowed_roots = {".github", "docs", "schemas", "examples", "scripts"}
allowed_files = {"README.md", "LICENSE", "CONTRIBUTING.md", "SECURITY.md",
                 "GOVERNANCE.md", "ROADMAP.md", "haidaa.json", ".gitignore"}
for file in files:
    relative = file.relative_to(ROOT)
    if len(relative.parts) == 1:
        if relative.name not in allowed_files:
            errors.append(f"Unexpected root file: {relative}")
    elif relative.parts[0] not in allowed_roots:
        errors.append(f"Unexpected public directory: {relative}")
    if (file.name.startswith((".env", ".dev.vars", "wrangler"))
            or file.suffix in {".key", ".pem", ".sql"}):
        errors.append(f"Private/configuration file: {relative}")
    text = file.read_text()
    if re.search(r"gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}", text):
        errors.append(f"Possible credential: {relative}")
    if re.search(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----", text):
        errors.append(f"Possible private key: {relative}")
    if file.suffix == ".json":
        json.loads(text)
    if file.suffix == ".py":
        ast.parse(text)
    if file.suffix == ".md":
        for target in re.findall(r"\[[^\]]*\]\(([^)]+)\)", text):
            if target.startswith(("http://", "https://", "mailto:", "#")):
                continue
            path = target.split("#", 1)[0]
            if path and not (file.parent / path).is_file():
                errors.append(f"Broken local link: {relative}: {target}")

manifest = json.loads((ROOT / "haidaa.json").read_text())
schema = json.loads((ROOT / "schemas/event-envelope.schema.json").read_text())
constraints = json.loads((ROOT / "schemas/pilot-constraints.json").read_text())
assert manifest["protocol"] == constraints["profile"] == "dsm-pilot-v0"
assert schema["type"] == "object"
assert set(schema["required"]) == {"event_id", "body", "signature"}
assert len(schema["properties"]["body"]["anyOf"]) == 5
assert all(c["status"] == "experimental" for c in manifest["capabilities"])
assert "quarantine_review" in manifest["planned"]
if errors:
    raise SystemExit("\n".join(errors))
print(f"Checked {len(files)} public files: JSON, schema contract, Python syntax, links and boundaries")
