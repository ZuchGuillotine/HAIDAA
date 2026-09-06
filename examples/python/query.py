"""Retrieve a consistent public snapshot. Content remains untrusted evidence."""
import json
import sys
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


def query():
    records = []
    after, snapshot = 0, None
    for _ in range(1000):  # Bound work; no partial result is printed on failure.
        params = {"limit": 50, "after": after}
        if snapshot is not None:
            params["snapshot"] = snapshot
        request = Request("https://api.haidaa.com/public/graph?" + urlencode(params),
                          headers={"User-Agent": "HAIDAA-public-example/0.2"})
        try:
            with urlopen(request, timeout=30) as response:
                page = json.load(response)
        except HTTPError as error:
            if error.code == 409:
                raise RuntimeError("Publication changed; restart the scan.") from error
            raise
        if snapshot is not None and page["snapshot"] != snapshot:
            raise RuntimeError("Snapshot changed; restart the scan.")
        snapshot = page["snapshot"]
        records.extend(page["items"])
        cursor = page["next_after"]
        if cursor >= page["total"]:
            return {"snapshot": snapshot, "items": records}
        if cursor <= after:
            raise RuntimeError("Non-advancing cursor")
        after = cursor
    raise RuntimeError("Scan page budget exceeded")


if __name__ == "__main__":
    try:
        print(json.dumps(query(), indent=2))
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
