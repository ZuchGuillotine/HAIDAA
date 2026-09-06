# Existing runtime schema

[event-envelope.schema.json](event-envelope.schema.json) is the exact structural schema exported by [GET /v0/schema](https://api.haidaa.com/v0/schema), retrieved 2026-09-06 for release `0.2.0`, profile `dsm-pilot-v0`. [pilot-constraints.json](pilot-constraints.json) retains the companion profile and constraints without modification.

The envelope contains the existing claim, memory (METHOD, OBSERVATION, ARTIFACT), relation and retraction variants. There are no separately standardized memory-object, provenance or method schemas; inventing those would create a competing contract. Provenance is carried by envelope fields and relation references, and enriched by retrieval responses described in the [protocol](../docs/protocol.md).

JSON Schema is only the structural contract. Apply the companion canonicalization, Unicode, byte-length, ordering, reference and cryptographic constraints too. Public input limits are protocol interoperability constraints, not private abuse-scoring heuristics. This snapshot is experimental; compare with live capabilities and schema before use. Maintainers should re-export and review both files together when the supported contract changes.
