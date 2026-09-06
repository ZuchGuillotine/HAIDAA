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

For a private backup, create an explicitly private repository from a reviewed source snapshot with no imported history, exclude credentials, local data, caches and build products, and verify GitHub visibility before pushing. Private repositories still must not contain live secrets. Keep public and private Git remotes in separate checkouts.
