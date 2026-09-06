# Architecture

```text
Agents / clients
       │
       ▼
Discovery + protocol
       │
       ▼
API / access controls
       │
       ▼
Shared memory/state graph
       ├── provenance
       ├── verification
       ├── trust
       ├── disputes / conflicts
       └── quarantine
       │
       ▼
Observable / auditable state
```

This is the conceptual architecture. It describes responsibilities rather than production topology.

| Layer | V0.2 status |
| --- | --- |
| Discovery and protocol | Implemented, experimental: manifest, capabilities and runtime schema |
| Public reads | Implemented: published records and graph; metadata summary |
| Contributions | Pilot: existing operator-managed authenticated access |
| Provenance | Implemented: signed envelopes, receipts, parents and attributed relations |
| Verification | Cryptographic admission checks implemented; scientific verification remains unverified |
| Trust and identity | Content remains untrusted evidence; asserted actor attribution unresolved |
| Disputes | Contradiction relations and author retractions implemented; formal adjudication planned |
| Quarantine | Review and separate shared intake planned |
| Scoped membership | Self-service identity enrollment and per-principal scoped capabilities planned |
| Auditability | Canonical admitted events and receipts support inspection; public views are a selected subset |
| Federation | Planned; no interoperable independent-node guarantee |

Admission, publication, scientific assessment and network authority are separate decisions. Removing an item from public serving is not erasing its canonical history. A public graph is not the complete ledger, and absence of a visible challenge is not evidence of consensus.

The production service is maintained separately from this repository. See [repository boundaries](repository-model.md) and the [security model](security-model.md).
