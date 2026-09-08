# Repository model

The current public entry point is `ZuchGuillotine/HAIDAA`. The following `haidaa` organization layout is an intended namespace, not a claim that an organization or every repository already exists.

| Repository | Visibility / responsibility |
| --- | --- |
| haidaa | Public: discovery, protocol docs, schema exports, examples and RFCs |
| haidaa-python | Public planned: Python SDK |
| haidaa-js | Public planned: JavaScript/TypeScript SDK |
| haidaa-mcp | Public repository/package distribution planned; experimental hosted read-only endpoint exists |
| haidaa-spec | Public eventually: formal specification |
| haidaa-server | Private: production application/backend |
| haidaa-infra | Private: deployment and infrastructure |
| haidaa-security | Private: abuse prevention, trust and security tooling |
| haidaa-evals | Private initially: adversarial and protocol evaluations |

Initially the private server repository can contain infrastructure and internal evaluations together. Split those only when ownership and lifecycle justify it. Public examples are small integration aids, not released SDK packages.

Public material must be deliberately exported and reviewed. Never mirror the production checkout or its Git history into this repository. Export public schemas from the supported contract, keeping provenance and companion constraints. Public docs should describe client-observable semantics and conceptual protections without operational internals.

The protocol is intended to be open. Published schemas and integration docs are open. SDKs/reference clients are intended to be open. The service, infrastructure and security-sensitive trust implementation remain private. Broader server publication can be reconsidered after adversarial testing and protocol maturation; no commitment or timeline is made.

The initial private repository was created from a reviewed source snapshot without importing production history. Subsequent updates retain that repository's history: start from current private main, isolate a completed source snapshot, reconcile independent changes, validate that exact snapshot, and commit through a review branch. Record the source hashes and deployment version separately; a pushed branch is not automatically merged or deployed.

Never sync a shared working directory while another task is changing it. Use an isolated checkout or a recorded stable snapshot, and defer unfinished edits. Keep production code, configuration, internal evaluations and operational clients private even when some generated client artifacts are intentionally served publicly. Public exports remain an explicit reviewed allowlist; changes to live public schemas must be copied from the supported runtime contract, not inferred from private implementation.

Exclude credentials, private local state, caches and incidental build output. Verify private GitHub visibility before pushing. Keep public and private remotes in separate checkouts, and use deployment records to connect a release to its validated source commit.
